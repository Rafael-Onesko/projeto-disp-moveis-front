import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import 'dayjs/plugin/customParseFormat';
import { ToastrService } from 'ngx-toastr';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { admissionDateValidFuture, admissionDateValidPast, birthDateValid, cpfValidator, matriculaExists, retornaErro, telefoneDuplicado, } from '../../validators';

interface Tipos {
  value: number;
  tipo: string;
}


@Component({
  selector: 'app-cadastro-colaborador',
  templateUrl: './cadastro-colaborador.component.html',
  styleUrls: ['./cadastro-colaborador.component.scss'],
})
export class CadastroColaboradorComponent implements OnInit {
  formColaborador!: FormGroup;
  valorDataNascimento: any
  valorDataAdmissao: any;
  matcher = new ErrorStateMatcher();
  //tel table
  telefoneColumns: string[] = ['numero', 'tipo', 'excluir'];
  telefoneSource = new MatTableDataSource<AbstractControl>();
  telefones!: FormArray;
  //end table
  enderecoColumns: string[] = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'tipo', 'excluir',];
  enderecoSource = new MatTableDataSource<AbstractControl>();
  enderecos!: FormArray;
  tiposCB: Tipos[] = [
    { value: 1, tipo: 'Estagiário' },
    { value: 2, tipo: 'Efetivo' },
    { value: 3, tipo: 'Terceirizado' },
  ];
  tiposTL: Tipos[] = [
    { value: 1, tipo: 'Residencial' },
    { value: 2, tipo: 'Comercial' },
    { value: 3, tipo: 'Celular' },
  ];
  tiposED: Tipos[] = [
    { value: 1, tipo: 'Residencial' },
    { value: 2, tipo: 'Comercial' },
  ];

  retornaErro = retornaErro;
  modoEditar = false;
  constructor(private route: ActivatedRoute, private router: Router, private colaboradorService: ColaboradoresService,
    private toastr: ToastrService, private formBuilder: FormBuilder,) {
    this.formColaborador = this.formBuilder.group({
      pessoaFisica: this.formBuilder.group({
        cpf: ['', Validators.compose([Validators.required, Validators.maxLength(11), Validators.pattern('[0-9 , .]+'), cpfValidator,]),],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),]),],
        dataNascimento: ['', Validators.compose([Validators.required, birthDateValid()]),],
        rg: ['', Validators.compose([Validators.required, Validators.maxLength(10)]),],
      }),
      tipoColaborador: ['', Validators.compose([Validators.required])],
      matricula: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.min(1),]),
        matriculaExists(this.colaboradorService),],
      dataAdmissao: ['', Validators.compose([Validators.required, admissionDateValidFuture(), admissionDateValidPast()]),],
      valorContribuicao: [0, Validators.compose([Validators.pattern('[0-9 , .]+'), Validators.max(10000), Validators.min(0),]),],
      enderecos: new FormArray([]),
      telefones: new FormArray([]),
    });
  }
  id: number = 0;
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id != 0) {
      this.modoEditar = true;
      this.getColaborador(this.id);
    } else {
      this.modoEditar = false;
      this.telefoneSource = new MatTableDataSource(
        (this.formColaborador.get('telefones') as FormArray).controls);
      this.enderecoSource = new MatTableDataSource(
        (this.formColaborador.get('enderecos') as FormArray).controls);
    }
  }
  async getColaborador(id: number) {
    await this.colaboradorService.getOneColaborador(id).subscribe({
      next: (x) => {
        this.formColaborador.get('matricula')?.disable();
        x.pessoaFisica.cpf = x.pessoaFisica.cpf.toString().padStart(11, '0');

        for (let i = 0; i < x.telefones.length; i++) {
          this.addTelefone();
        }
        for (let i = 0; i < x.enderecos.length; i++) {
          this.addEndereco();
        }
        this.formColaborador.patchValue(x);
        this.formatData(x.pessoaFisica.dataNascimento, 1);
        this.formatData(x.dataAdmissao, 2);
        this.formColaborador.get("pessoaFisica.dataNascimento")?.markAsTouched();
        this.formColaborador.get("dataAdmissao")?.markAsTouched();

        (this.formColaborador.get('enderecos') as FormArray).controls.forEach(
          (element) => {
            element.get('cep')?.patchValue(element.get('cep')?.value.toString().padStart(8, '0'));
          }
        );
      },
      error: (e) => {
        this.toastr.error('Colaborador não encontrado!');
        this.router.navigate(['/listacolaboradores']);
      },
    });
  }

  viaCEP(element: FormGroup): void {
    if (element.get('cep')?.value.toString().length >= 7) {
      element.get('cep')?.patchValue(element.get('cep')?.value.toString().padStart(8, '0'));
    }
    this.colaboradorService.getCEP(element.get('cep')?.value.toString().padStart(8, '0')).subscribe({
      next: (x) => {
        if (x.erro == true) { this.toastr.error('O CEP inserido não é válido!'); }
        else {
          element.get('logradouro')?.patchValue(x.logradouro);
          element.get('numeroEndereco')?.patchValue(x.complemento.substring(0, 10));
          element.get('bairro')?.patchValue(x.bairro);
          element.get('cidade')?.patchValue(x.localidade);
        }
      },
      error: (e) => {
        this.toastr.error('O CEP inserido não é válido!');
      },
    });
  }

  checkData() {
    this.formColaborador.get('dataAdmissao')?.updateValueAndValidity();
    this.formColaborador.get('pessoaFisica.dataNascimento')?.updateValueAndValidity();
  }

  formatData(data: Date, field: number) {
    const format = dayjs(data).format('DD/MM/YYYY');
    if (field == 1) {
      this.valorDataNascimento = format;
    }
    if (field == 2) {
      this.valorDataAdmissao = format;
    }
  }

  fillData(field: number) {
    if (field == 1) {
      if (this.valorDataNascimento.toString().length == 10) {
        let splitData = this.valorDataNascimento.toString().split('/')
        const dia = Number(splitData[0]);
        const mes = Number(splitData[1]);
        const ano = Number(splitData[2]);
        if (dayjs(mes + '/' + dia + '/' + ano).isValid()) {
          const dataFormatada = new Date(ano, mes - 1, dia);
          this.formColaborador.get('pessoaFisica.dataNascimento')?.patchValue(dataFormatada)
        }
        else {
          this.formatData(this.formColaborador.get('pessoaFisica.dataNascimento')?.value, 1);
        }
      }
    }
    if (field == 2) {
      if (this.valorDataAdmissao.toString().length == 10) {
        let splitData = this.valorDataAdmissao.toString().split('/')
        const dia = Number(splitData[0]);
        const mes = Number(splitData[1]);
        const ano = Number(splitData[2]);
        if (dayjs(mes + '/' + dia + '/' + ano).isValid()) {
          const formataData = new Date(ano, mes - 1, dia);
          this.formColaborador.get('dataAdmissao')?.patchValue(formataData)
        }
        else {
          this.formatData(this.formColaborador.get('dataAdmissao')?.value, 2);
        }
      }
    }
  }
  //
  //TELEFONE
  //
  createTelefone() {
    return this.formBuilder.group({
      numeroTelefone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]+'),
      Validators.maxLength(20), Validators.minLength(11), telefoneDuplicado(),]),],
      tipoTelefone: ['', Validators.compose([Validators.required]),],
    });
  }

  addTelefone(): void {
    this.telefones = this.formColaborador.get('telefones') as FormArray;
    this.telefones.push(this.createTelefone());
    this.telefoneSource.data = this.telefones.controls;
  }
  removeTelefone(index: number) {
    this.telefones.removeAt(index);
    this.telefoneSource.data = this.telefones.controls;
    this.checkNumeroTelefone();
  }
  checkNumeroTelefone() {
    this.telefones.controls.forEach((control) => {
      control.get('numeroTelefone')?.updateValueAndValidity();
    });
  }
  //
  //ENDEREÇOS
  //
  createEndereco() {
    return this.formBuilder.group({
      logradouro: ['', Validators.compose([Validators.required, Validators.maxLength(100)]),],
      numeroEndereco: ['', Validators.compose([Validators.required, Validators.maxLength(10)]),],
      bairro: ['', Validators.compose([Validators.required, Validators.maxLength(50)]),],
      cidade: ['', Validators.compose([Validators.required, Validators.maxLength(100)]),],
      cep: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8),]),],
      tipoEndereco: ['', Validators.compose([Validators.required]),],
    });
  }
  addEndereco(): void {
    this.enderecos = this.formColaborador.get('enderecos') as FormArray;
    this.enderecos.push(this.createEndereco());
    this.enderecoSource.data = this.enderecos.controls;
  }
  removeEndereco(index: number) {
    this.enderecos.removeAt(index);
    this.enderecoSource.data = this.enderecos.controls;
  }
  async onClickSalvar() {
    this.fillData(1);
    this.fillData(2);
    if (this.formColaborador.get('valorContribuicao')?.value <= 0) { this.formColaborador.get('valorContribuicao')?.patchValue(''); }
    if (this.formColaborador.invalid) {
      this.toastr.error('Algum dado está inválido, favor revisar o formulário');
      this.formColaborador.updateValueAndValidity();
    } else {
      if (this.modoEditar == true) {
        await this.colaboradorService.editColaborador(this.formColaborador.getRawValue(), this.id).subscribe({
          next: (x) => {
            this.toastr.success('Colaborador editado com Sucesso!');
            this.router.navigate(['/listacolaboradores']);
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      } else {
        await this.colaboradorService.addColaborador(this.formColaborador.getRawValue()).subscribe({
          next: (x) => {
            this.toastr.success('Colaborador cadastrado com Sucesso!');
            this.router.navigate(['/listacolaboradores']);
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      }
    }
  }
}
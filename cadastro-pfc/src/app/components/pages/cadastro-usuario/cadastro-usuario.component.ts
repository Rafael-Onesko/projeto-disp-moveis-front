import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { retornaErro, usuarioExists } from '../../validators';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss'],
})
export class CadastroUsuarioComponent implements OnInit {
  usuarioData: Usuario | null = null;
  usuarioForm!: FormGroup;
  public showPassword = false;
  modoEditar = true;
  selfEdit = false;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioEmail = localStorage.getItem('usuarioEmail');
  retornaErro = retornaErro;

  constructor(private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService,
    private toastr: ToastrService, private formBuilder: FormBuilder
  ) {
    this.usuarioForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20),]),
        usuarioExists(this.usuarioService),],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20),]),],
      admin: [false],
    });
  }

  id: string = '';
  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    if (this.id != 'null') { this.getusuario(this.id); }
    else if (this.usuarioAdmin == 'false') {
      this.toastr.error('Você não tem permissão para criar um usuário!');
      this.usuarioForm.disable();
      this.router.navigate(['/listausuarios']);
    } else {
      this.modoEditar = false;
      this.selfEdit = false;
    }
  }

  getusuario(id: string): void {
    this.usuarioService.getOneUsuario(id).subscribe({
      next: (x) => {
        this.usuarioForm.patchValue(x);
        this.usuarioForm.get('email')?.disable();
        this.modoEditar = true;
        if (x.email == this.usuarioEmail) {
          this.selfEdit = true;
          this.usuarioForm.get('nome')?.enable();
          this.usuarioForm.get('senha')?.enable();
          this.usuarioForm.get('admin')?.disable();
        } else {
          if (this.usuarioAdmin !== 'true') { this.usuarioForm.disable(); }
        }
      },
      error: (e) => {
        this.toastr.error('Usuário não encontrado!');
        this.router.navigate(['/listausuarios']);
      },
    });
  }

  async onClickSalvar() {
    if (this.usuarioForm.invalid) {
      this.toastr.error('Algum dado está inválido, favor revisar o formulário');
      this.usuarioForm.get('email')?.updateValueAndValidity();
    } else if (this.modoEditar == true) {
      this.usuarioService.editUsuario(this.usuarioForm.getRawValue(), this.usuarioForm.get('email')?.value).subscribe({
        next: (x) => {
          if (x == true) {
            if (this.selfEdit == true) {
              const usuarioNome = this.usuarioForm.get('nome')?.value.substring(0, this.usuarioForm.get('nome')?.value.indexOf(' '));
              if (usuarioNome == '') {
                localStorage.setItem('usuarioNome', this.usuarioForm.get('nome')?.value);
              }
              else { localStorage.setItem('usuarioNome', usuarioNome); }
            }
            this.toastr.success('Usuário editado com Sucesso!');
            this.router.navigate(['/listausuarios']);
          } else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
        },
        error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
      });
    } else {
      this.usuarioService.addUsuario(this.usuarioForm.getRawValue()).subscribe({
        next: (x) => {
          if (x == true) {
            this.toastr.success('Usuário cadastrado com Sucesso!');
            this.router.navigate(['/listausuarios']);
          }
          else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
        },
        error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
      });
    }
  }
}

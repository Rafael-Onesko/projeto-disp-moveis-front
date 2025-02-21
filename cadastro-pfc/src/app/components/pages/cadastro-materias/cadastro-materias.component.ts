import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { MateriaService } from 'src/app/services/materias.service';
import { materiaExists, retornaErro } from '../../validators';
import { Professor } from 'src/app/interfaces/professor';
import { ProfessorService } from 'src/app/services/professores.service';

@Component({
  selector: 'app-cadastro-materias',
  templateUrl: './cadastro-materias.component.html',
  styleUrls: ['./cadastro-materias.component.scss'],
})
export class CadastroMateriaComponent implements OnInit {
  usuarioData: Usuario | null = null;
  materiaForm!: FormGroup;
  public showPassword = false;
  modoEditar = true;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioprofessor_ID = localStorage.getItem('usuarioLogin');
  retornaErro = retornaErro;

  professoresAPI: Professor[] | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private materiaService: MateriaService, private professorService: ProfessorService,
    private toastr: ToastrService, private formBuilder: FormBuilder
  ) {
    this.materiaForm = this.formBuilder.group({
      materia_ID: ['', Validators.compose([Validators.required, Validators.maxLength(20),]),
        materiaExists(this.materiaService),],
      materia_Nome: ['', Validators.compose([Validators.required]),],
      materia_Bloco: ['', Validators.compose([Validators.required]),],
      professor_ID: ['', Validators.compose([Validators.required]),],
      professor_Nome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),])],
    });
  }

  id: string = '';
  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    if (this.id != 'null') { this.getMateria(this.id); }
    else if (this.usuarioAdmin == 'false') {
      this.toastr.error('Você não tem permissão para criar uma matéria!');
      this.materiaForm.disable();
      this.router.navigate(['/listamaterias']);
    } else {
      this.modoEditar = false;
    }
    this.professorService.getAllProfessores().subscribe({
      next: (x) => {
        this.professoresAPI = x;
      }
    })
    this.materiaForm.get('professor_Nome')?.disable();
  }

  getMateria(id: string): void {
    this.materiaService.getOneMateria(id).subscribe({
      next: (x) => {
        this.materiaForm.patchValue(x);
        this.materiaForm.get('materia_ID')?.disable();
        this.modoEditar = true;
        if (this.usuarioAdmin !== 'true') { this.materiaForm.disable(); }
      },
      error: (e) => {
        this.toastr.error('Materia não encontrada!');
        this.router.navigate(['/listamaterias']);
      },
    });
  }

  updateProfessor(): void {
    this.professorService.getOneProfessor(this.materiaForm.get('professor_ID')?.value).subscribe({
      next: (x) => {
        this.materiaForm.get('professor_Nome')?.patchValue(x.professor_Nome);
      }
    })
  }

  async onClickSalvar() {
    if (this.materiaForm.invalid) {
      this.toastr.error('Algum dado está inválido, favor revisar o formulário');
      this.materiaForm.get('materia_ID')?.updateValueAndValidity();
    } else
      if (this.modoEditar == true) {
        this.materiaService.editMateria(this.materiaForm.getRawValue(), this.materiaForm.get('materia_ID')?.value).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Materia editada com Sucesso!');
              this.router.navigate(['/listamaterias']);
            } else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      } else {
        this.materiaService.addMateria(this.materiaForm.getRawValue()).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Materia cadastrada com Sucesso!');
              this.router.navigate(['/listamaterias']);
            }
            else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      }
  }
}

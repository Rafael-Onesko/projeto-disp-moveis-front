import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { professorExists, retornaErro, usuarioExists } from '../../validators';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from 'src/app/interfaces/role';
import { RoleService } from 'src/app/services/roles.service';
import { MateriaService } from 'src/app/services/materias.service';
import { Materia } from 'src/app/interfaces/materia';
import { ProfessorService } from 'src/app/services/professores.service';

@Component({
  selector: 'app-cadastro-professor',
  templateUrl: './cadastro-professor.component.html',
  styleUrls: ['./cadastro-professor.component.scss'],
})
export class CadastroProfessorComponent implements OnInit {
  usuarioData: Usuario | null = null;
  professorForm!: FormGroup;
  public showPassword = false;
  modoEditar = true;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioprofessor_ID = localStorage.getItem('usuarioLogin');
  retornaErro = retornaErro;

  //materiasTable
  materiaColumns: string[] = ['materia_ID', 'materia_Nome', 'materia_Bloco'];
  materiaSource = new MatTableDataSource<AbstractControl>();
  materias!: FormArray;
  materiasAPI: Materia[] | undefined;
  constructor(private route: ActivatedRoute, private router: Router,
    private professorService: ProfessorService, private materiaService: MateriaService,
    private toastr: ToastrService, private formBuilder: FormBuilder
  ) {
    this.professorForm = this.formBuilder.group({
      professor_ID: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20),]),
        professorExists(this.professorService),],
      professor_Nome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),])],
      materiasProfessor: new FormArray([]),
    });
  }

  id: string = '';
  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    if (this.id != 'null') { this.getProfessor(this.id); }
    else if (this.usuarioAdmin == 'false') {
      this.toastr.error('Você não tem permissão para criar um professor!');
      this.professorForm.disable();
      this.router.navigate(['/listaprofessores']);
    } else {
      this.modoEditar = false;
    }
    this.materiaService.getAllMaterias().subscribe({
      next: (x) => {
        this.materiasAPI = x;
      }
    })
  }

  getProfessor(id: string): void {
    this.professorService.getOneProfessor(id).subscribe({
      next: (x) => {
        for (let i = 0; i < x.materiasProfessor.length; i++) {
          this.addMateria();
        }
        this.professorForm.patchValue(x);
        this.professorForm.get('materiasProfessor')?.disable();
        this.professorForm.get('professor_ID')?.disable();
        this.modoEditar = true;
        if (this.usuarioAdmin !== 'true') { this.professorForm.disable(); }
      },
      error: (e) => {
        this.toastr.error('Professor não encontrado!');
        this.router.navigate(['/listaprofessores']);
      },
    });
  }

  //materias
  createMateria() {
    return this.formBuilder.group({
      materia_ID: ['', Validators.compose([Validators.required])],
      materia_Nome: ['', Validators.compose([Validators.required])],
      materia_Bloco: ['', Validators.compose([Validators.required])],
      professor_ID: ['', Validators.compose([Validators.required])],
      professor_Nome: ['', Validators.compose([Validators.required])],
    });
  }
  addMateria(): void {
    this.materias = this.professorForm.get('materiasProfessor') as FormArray;
    this.materias.push(this.createMateria());
    this.materiaSource.data = this.materias.controls;
  }
  removeMateria(index: number) {
    this.materias.removeAt(index);
    this.materiaSource.data = this.materias.controls;
  }
  updateMateriaNome(element: FormGroup): void {
    this.materiaService.getAllMaterias().subscribe({
      next: (x) => {
        x.forEach(e => {
          if (element.get('materia_Nome')?.value == e.materia_Nome) {
            element.get('materia_Nome')?.patchValue(e.materia_Nome);
            element.get('materia_ID')?.patchValue(e.materia_ID);
            element.get('materia_Bloco')?.patchValue(e.materia_Bloco);
            element.get('professor_ID')?.patchValue(e.professor_ID);
            element.get('professor_Nome')?.patchValue(e.professor_Nome);
          }
        });
      }
    })
  }

  updateMateriaCod(element: FormGroup): void {
    this.materiaService.getOneMateria(element.get('materia_ID')?.value).subscribe({
      next: (x) => {
        element.get('materia_Nome')?.patchValue(x.materia_Nome);
        element.get('materia_ID')?.patchValue(x.materia_ID);
        element.get('materia_Bloco')?.patchValue(x.materia_Bloco);
        element.get('professor_ID')?.patchValue(x.professor_ID);
        element.get('professor_Nome')?.patchValue(x.professor_Nome);
      }
    })
  }


  async onClickSalvar() {
    if (this.professorForm.invalid) {
      this.toastr.error('Algum dado está inválido, favor revisar o formulário');
      this.professorForm.get('professor_ID')?.updateValueAndValidity();
    } else
      if (this.modoEditar == true) {
        this.professorService.editProfessor(this.professorForm.getRawValue(), this.professorForm.get('professor_ID')?.value).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Professor editado com Sucesso!');
              this.router.navigate(['/listaprofessores']);
            } else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      } else {
        this.professorService.addProfessor(this.professorForm.getRawValue()).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Professor cadastrado com Sucesso!');
              this.router.navigate(['/listaprofessores']);
            }
            else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      }
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { retornaErro, usuarioExists } from '../../validators';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from 'src/app/interfaces/role';
import { RoleService } from 'src/app/services/roles.service';

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
  usuarioEmail = localStorage.getItem('usuarioLogin');
  retornaErro = retornaErro;

  //roleTable
  roleColumns: string[] = ['roleNome', 'excluir'];
  roleSource = new MatTableDataSource<AbstractControl>();
  roles!: FormArray;
  rolesAPI: Role[] | undefined
  //materiasTable
  materiaColumns: string[] = ['materia_ID', 'materia_Nome', 'materia_Bloco','professor_ID','professor_Nome','excluir'];
  materiaSource = new MatTableDataSource<AbstractControl>();
  materias!: FormArray;
  constructor(private route: ActivatedRoute, private router: Router, 
    private usuarioService: UsuarioService, private roleService: RoleService,
    private toastr: ToastrService, private formBuilder: FormBuilder
  ) {
    this.usuarioForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20),]),
        usuarioExists(this.usuarioService),],
      primeiroNome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),])],
      ultimoNome: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20),]),],
      admin: [false],
      rolesUsuario: new FormArray([]),
      materias: new FormArray([]),
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
    this.roleService.getAllRoles().subscribe({
      next: (x) => 
      {
        this.rolesAPI = x;
      }
    })
  }

  getusuario(id: string): void {
    this.usuarioService.getOneUsuario(id).subscribe({
      next: (x) => {
        for (let i = 0; i < x.rolesUsuario.length; i++) {
          this.addRole();
        }
        this.usuarioForm.patchValue(x);
        this.usuarioForm.get('email')?.disable();
        this.modoEditar = true;
        if (x.email == this.usuarioEmail) {
          this.selfEdit = true;
          this.usuarioForm.get('primeiroNome')?.enable();
          this.usuarioForm.get('ultimoNome')?.enable();
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

  //role
  //
    createRole() {
      return this.formBuilder.group({
        role_ID: ['', Validators.compose([Validators.required]),],
        roleNome: ['', Validators.compose([Validators.required]),],
      });
    }
    addRole(): void {
      this.roles = this.usuarioForm.get('rolesUsuario') as FormArray;
      this.roles.push(this.createRole());
      this.roleSource.data = this.roles.controls;
    }
    removeRole(index: number) {
      this.roles.removeAt(index);
      this.roleSource.data = this.roles.controls;
    }    
    updateRole(element: FormGroup): void{
      if(element.get('roleNome')?.value != null){
        this.roleService.getAllRoles().subscribe({
          next:(x) =>{
            x.forEach(e => {
              if(element.get('roleNome')?.value == e.roleNome){
                element.get('role_ID')?.patchValue(e.role_ID);
              }
            });
          }
        })
      }
    }
  //materias
  createMateria() {
    return this.formBuilder.group({
      materia_ID: ['',Validators.compose([Validators.required])],
      materia_Nome: ['',Validators.compose([Validators.required])],
      materia_Bloco: ['',Validators.compose([Validators.required])],
      professor_ID: ['',Validators.compose([Validators.required])],
      professor_Nome: ['',Validators.compose([Validators.required])],
    });
  }
  addMateria(): void {
    this.materias = this.usuarioForm.get('materias') as FormArray;
    this.materias.push(this.createMateria());
    this.materiaSource.data = this.materias.controls;
  }
  removeMateria(index: number) {
    this.materias.removeAt(index);
    this.materiaSource.data = this.materias.controls;
  }    

  async onClickSalvar() {
    // if (this.usuarioForm.invalid) {
    //   this.toastr.error('Algum dado está inválido, favor revisar o formulário');
    //   this.usuarioForm.get('email')?.updateValueAndValidity();
    // } else 
    if (this.modoEditar == true) {
      this.usuarioService.editUsuario(this.usuarioForm.getRawValue(), this.usuarioForm.get('email')?.value).subscribe({
        next: (x) => {
          if (x == true) {
            if (this.selfEdit == true) {
              const usuarioNome = this.usuarioForm.get('primeiroNome')?.value.substring(0, this.usuarioForm.get('primeiroNome')?.value.indexOf(' '));
              if (usuarioNome == '') {
                localStorage.setItem('usuarioNome', this.usuarioForm.get('primeiroNome')?.value);
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

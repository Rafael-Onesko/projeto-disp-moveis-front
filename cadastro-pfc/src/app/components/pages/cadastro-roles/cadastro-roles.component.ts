import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Professor } from 'src/app/interfaces/professor';
import { Usuario } from 'src/app/interfaces/usuario';
import { ProfessorService } from 'src/app/services/professores.service';
import { RoleService } from 'src/app/services/roles.service';
import { retornaErro } from '../../validators';

@Component({
  selector: 'app-cadastro-roles',
  templateUrl: './cadastro-roles.component.html',
  styleUrls: ['./cadastro-roles.component.scss'],
})
export class CadastroRoleComponent implements OnInit {
  usuarioData: Usuario | null = null;
  roleForm!: FormGroup;
  public showPassword = false;
  modoEditar = true;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioprofessor_ID = localStorage.getItem('usuarioLogin');
  retornaErro = retornaErro;

  constructor(private route: ActivatedRoute, private router: Router, private roleService: RoleService, private professorService: ProfessorService,
    private toastr: ToastrService, private formBuilder: FormBuilder
  ) {
    this.roleForm = this.formBuilder.group({
      roleNome: ['', Validators.compose([Validators.required]),],
      role_ID: [0],
    });
  }

  id: string = '';
  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    if (this.id != 'null') { this.getRole(this.id); }
    else if (this.usuarioAdmin == 'false') {
      this.toastr.error('Você não tem permissão para criar um role!');
      this.roleForm.disable();
      this.router.navigate(['/listaroles']);
    } else {
      this.modoEditar = false;
    }
  }

  getRole(id: string): void {
    this.roleService.getOneRole(id).subscribe({
      next: (x) => {
        this.roleForm.patchValue(x);
        this.roleForm.get('role_ID')?.disable();
        this.modoEditar = true;
        if (this.usuarioAdmin !== 'true') { this.roleForm.disable(); }
      },
      error: (e) => {
        this.toastr.error('Role não encontrada!');
        this.router.navigate(['/listaroles']);
      },
    });
  }

  async onClickSalvar() {
    if (this.roleForm.invalid) {
      this.toastr.error('Algum dado está inválido, favor revisar o formulário');
      this.roleForm.get('role_ID')?.updateValueAndValidity();
    } else
      if (this.modoEditar == true) {
        this.roleService.editRole(this.roleForm.getRawValue(), this.roleForm.get('role_ID')?.value).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Role editada com Sucesso!');
              this.router.navigate(['/listaroles']);
            } else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      } else {
        this.roleService.addRole(this.roleForm.getRawValue()).subscribe({
          next: (x) => {
            if (x == true) {
              this.toastr.success('Role cadastrada com Sucesso!');
              this.router.navigate(['/listaroles']);
            }
            else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
          },
          error: (e) => { this.toastr.error('Ocorreu um erro, favor tentar novamente'); },
        });
      }
  }
}

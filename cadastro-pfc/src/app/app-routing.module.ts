import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpfcGuard } from './auth/cpfc.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { CadastroMateriaComponent } from './components/pages/cadastro-materias/cadastro-materias.component';
import { CadastroProfessorComponent } from './components/pages/cadastro-professor/cadastro-professor.component';
import { CadastroRoleComponent } from './components/pages/cadastro-roles/cadastro-roles.component';
import { CadastroUsuarioComponent } from './components/pages/cadastro-usuario/cadastro-usuario.component';
import { ListaMateriasComponent } from './components/pages/lista-materias/lista-materias.component';
import { ListaProfessoresComponent } from './components/pages/lista-professores/lista-professores.component';
import { ListaRolesComponent } from './components/pages/lista-roles/lista-roles.component';
import { ListaUsuariosComponent } from './components/pages/lista-usuarios/lista-usuarios.component';
import { LoginComponent } from './components/pages/login/login.component';

const routes: Routes = [
  { path: 'editarusuario', redirectTo: 'novousuario', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [CpfcGuard],
    title: "main",
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [CpfcGuard],
        title: "Home",
      },
      {
        path: 'listausuarios',
        component: ListaUsuariosComponent,
        canActivate: [CpfcGuard],
        title: "Lista Usuários"
      },
      {
        path: 'listaprofessores',
        component: ListaProfessoresComponent,
        canActivate: [CpfcGuard],
        title: "Lista Professores"
      },
      {
        path: 'listamaterias',
        component: ListaMateriasComponent,
        canActivate: [CpfcGuard],
        title: "Lista Materias"
      },
      {
        path: 'listaroles',
        component: ListaRolesComponent,
        canActivate: [CpfcGuard],
        title: "Lista Roles"
      },

      
      {
        path: 'novousuario',
        component: CadastroUsuarioComponent,
        canActivate: [CpfcGuard],
        title: "Cadastro de Usuário"
      },
      {
        path: 'editarusuario/:id',
        component: CadastroUsuarioComponent,
        canActivate: [CpfcGuard],
        title: "Edição de Usuário"
      },
      {
        path: 'novoprofessor',
        component: CadastroProfessorComponent,
        canActivate: [CpfcGuard],
        title: "Cadastro de Professor"
      },
      {
        path: 'editarprofessor/:id',
        component: CadastroProfessorComponent,
        canActivate: [CpfcGuard],
        title: "Edição de Professor"
      },
      {
        path: 'novomateria',
        component: CadastroMateriaComponent,
        canActivate: [CpfcGuard],
        title: "Cadastro de Materia"
      },
      {
        path: 'editarmateria/:id',
        component: CadastroMateriaComponent,
        canActivate: [CpfcGuard],
        title: "Edição de Materia"
      },
      {
        path: 'novorole',
        component: CadastroRoleComponent,
        canActivate: [CpfcGuard],
        title: "Cadastro de Role"
      },
      {
        path: 'editarrole/:id',
        component: CadastroRoleComponent,
        canActivate: [CpfcGuard],
        title: "Edição de Role"
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { MainComponent } from './components/main/main.component';
import { CpfcGuard } from './auth/cpfc.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaColaboradoresComponent } from './components/pages/lista-colaboradores/lista-colaboradores.component';
import { ListaUsuariosComponent } from './components/pages/lista-usuarios/lista-usuarios.component';
import { CadastroUsuarioComponent } from './components/pages/cadastro-usuario/cadastro-usuario.component';
import { CadastroColaboradorComponent } from './components/pages/cadastro-colaborador/cadastro-colaborador.component';

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
        path: 'listacolaboradores',
        component: ListaColaboradoresComponent,
        canActivate: [CpfcGuard],
        title: "Lista Colaboradores"
      },
      {
        path: 'listausuarios',
        component: ListaUsuariosComponent,
        canActivate: [CpfcGuard],
        title: "Lista Usuários"
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
        path: 'novocolaborador',
        component: CadastroColaboradorComponent,
        canActivate: [CpfcGuard],
        title: "Cadastro de Colaborador"
      },
      {
        path: 'editarcolaborador/:id',
        component: CadastroColaboradorComponent,
        canActivate: [CpfcGuard],
        title: "Edição de Colaborador"
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

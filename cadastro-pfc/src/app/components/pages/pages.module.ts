import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DeletaUsuarioComponent } from '../dialogs/deleta-usuario/deleta-usuario.component';
import { CadastroMateriaComponent } from './cadastro-materias/cadastro-materias.component';
import { CadastroProfessorComponent } from './cadastro-professor/cadastro-professor.component';
import { CadastroRoleComponent } from './cadastro-roles/cadastro-roles.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ListaMateriasComponent } from './lista-materias/lista-materias.component';
import { ListaProfessoresComponent } from './lista-professores/lista-professores.component';
import { ListaRolesComponent } from './lista-roles/lista-roles.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    LoginComponent,
    ListaUsuariosComponent,
    ListaProfessoresComponent,
    ListaMateriasComponent,
    ListaRolesComponent,
    CadastroUsuarioComponent,
    CadastroProfessorComponent,
    CadastroMateriaComponent,
    CadastroRoleComponent,
    DeletaUsuarioComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxTrimDirectiveModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    CurrencyMaskModule,
    FlexLayoutModule,
    TextMaskModule,
  ],
  providers: [provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  {
    provide: DateAdapter, useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  exports: []
})
export class PagesModule { }

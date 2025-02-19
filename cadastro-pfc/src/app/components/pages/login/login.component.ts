import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthData, Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { comparadorSenhas, retornaErro, usuarioExists } from '../../validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginData: Usuario | null = null;
  authData: AuthData | null = null;
  formLogin!: FormGroup;
  public modoCadastro = false;
  public showPassword = false;
  retornaErro = retornaErro;
  constructor(private router: Router, private usuarioService: UsuarioService, private authService: AuthService,
    private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      login: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      loginCadastro: ['', Validators.compose([Validators.required, Validators.minLength(6),]), usuarioExists(this.usuarioService)],
      primeiroNome: ['', Validators.compose([Validators.required, Validators.minLength(6),]),],
      ultimoNome: ['', Validators.compose([Validators.required, Validators.minLength(6),]),],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6),]),],
      confirmaSenha: ['', Validators.compose([Validators.required, comparadorSenhas()]),],
    });
  }
  checaSenhas() {
    this.formLogin.get('senha')?.valueChanges.subscribe(() => this.formLogin.get('confirmaSenha')?.updateValueAndValidity());
  }
  onClickLogin() {
    this.authService.getLogin(this.authData = {email: this.formLogin.get('login')?.value, senha: this.formLogin.get('senha')?.value,}).subscribe({
      next: (x) => {
        if (x == true) {
          this.usuarioService.getOneUsuario(this.formLogin.value.login).subscribe((a) => {
            this.authService.checkAuth(x, a.admin, a.email, a.ultimoNome);
            this.toastr.success('Login Efetuado com sucesso!');
            this.router.navigate(['/dashboard']);
          });
        } else {
          this.toastr.error('Usuário e/ou Senha incorretos, favor tentar novamente');
          this.formLogin.reset();
        }
      },
      error: (e) => {
        if (e.status == 404) {
          this.toastr.error('Usuário e/ou Senha incorretos, favor tentar novamente');
          this.formLogin.reset();
        } else {
          this.toastr.error('Ocorreu um erro no Login, favor tentar novamente');
          this.formLogin.reset();
        }
      }
    });
  }

  async onClickCadastro() {
    this.loginData = {
      email: this.formLogin.get('loginCadastro')?.value,
      primeiroNome: this.formLogin.get('primeiroNome')?.value,
      ultimoNome: this.formLogin.get('ultimoNome')?.value,
      senha: this.formLogin.get('senha')?.value,
      admin: false,
    };
    this.usuarioService.addUsuario(this.loginData).subscribe((x) => {
      if (x == true) { this.toastr.success('Usuário Cadastrado com Sucesso!'); }
      else { this.toastr.error('Ocorreu um erro, favor tentar novamente'); }
    });
  }
}

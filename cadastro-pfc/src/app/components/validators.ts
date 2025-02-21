import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ColaboradoresService } from '../services/colaboradores.service';
import { UsuarioService } from '../services/usuario.service';
import * as dayjs from 'dayjs';
import { ProfessorService } from '../services/professores.service';
import { MateriaService } from '../services/materias.service';

export function retornaErro(campo: AbstractControl | null) {
  if (campo?.hasError('required')) { return 'O campo é obrigatório!'; }
  if (campo?.hasError('maxlength')) {
    return ('O campo deve ter no máximo ' + campo?.errors?.['maxlength'].requiredLength + ' caracteres!');
  }
  if (campo?.hasError('minlength')) {
    return ('O campo deve ter no mínimo ' + campo?.errors?.['minlength'].requiredLength + ' caracteres!');
  }
  if (campo?.hasError('pattern')) { return 'O campo não aceita estes caracteres!'; }
  if (campo?.hasError('min')) { return 'O valor está abaixo do mínimo de ' + campo?.errors?.['min'].min + '!'; }
  if (campo?.hasError('max')) { return 'O valor excede o máximo de ' + campo?.errors?.['max'].max + '!'; }
  if (campo?.hasError('custom')) { return campo?.getError('custom').message; }
  else return null;
}

export function comparadorSenhas(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const actualForm = control.parent?.getRawValue();
    const senha = actualForm?.senha;
    if (senha && control.value !== senha) { return { custom: { message: 'As senhas estão diferentes' } }; }
    return null;
  };
}

export function usuarioExists(usuario: UsuarioService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return usuario.getOneUsuario(control.value).pipe(
      map((usuario) => !usuario ? null : { custom: { message: 'Este email já existe' } }),
      catchError(() => of(null))
    );
  };
}

export function professorExists(professor: ProfessorService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return professor.getOneProfessor(control.value).pipe(
      map((professor) => !professor ? null : { custom: { message: 'Este email já existe' } }),
      catchError(() => of(null))
    );
  };
}

export function materiaExists(materia: MateriaService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return materia.getOneMateria(control.value).pipe(
      map((materia) => !materia ? null : { custom: { message: 'Esta materia já existe' } }),
      catchError(() => of(null))
    );
  };
}

export function matriculaExists(colaboradorService: ColaboradoresService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return colaboradorService.getMatricula(control.value).pipe(
      map((matricula) => matricula ? { custom: { message: 'Esta matrícula já existe' } } : null),
      catchError(() => of(null))
    );
  };
}

export function birthDateValid(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (control.value > minDate) { return { custom: { message: 'O colaborador deve ter no mínimo 18 anos' }, }; }
    return null;
  };
}

export function admissionDateValidFuture(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    if (control.value > maxDate) { return { custom: { message: 'A data de admissão deve ser no máximo 30 dias após a data atual', }, }; }
    return null;
  };
}

export function admissionDateValidPast(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const actualForm = control.parent;
    if (actualForm?.get('pessoaFisica.dataNascimento')?.value) {
      let birthDate = dayjs(actualForm?.get('pessoaFisica.dataNascimento')?.value).add(18, 'year');      
      if (dayjs(control.value).format() < birthDate.format()) {
        return { custom: { message: 'Data de admissão inválida' } };
      }
    }
    return null;
  };
}

export function telefoneDuplicado(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const actualForm = control.parent?.parent?.getRawValue();
    let count: number = 0;
    for (const index in actualForm) {
      if ((index !== actualForm.indexOf(control)) && (actualForm[index].numeroTelefone === control.value)) { count++; }
    }
    if (count > 1) { return { custom: { message: 'Há numeros duplicados' } }; }
    return null;
  };
}

export function cpfValidator(ctrl: AbstractControl) {
  if (!!ctrl && !!ctrl.value && !isValidCPF(ctrl.value)) { return { custom: { message: 'CPF Inválido.' } }; }
  return null;
}

export function isValidCPF(cpf: string) {
  cpf = (cpf || '').replace(/\D+/g, '');
  if (cpf.length !== 11) {
    return false;
  }
  const numeros = cpf.split('').map((char) => parseInt(char, 10));

  const igual = !numeros.some((d) => d !== numeros[0]);
  if (igual || cpf === '12345678909') {
    return false;
  }
  let soma1 = 0;
  let soma2 = 0;
  for (let i = 0, j = 10, k = 11; i < 9; i++, j--, k--) {
    soma1 += numeros[i] * j;
    soma2 += numeros[i] * k;
  }
  let dv1 = soma1 % 11;
  dv1 = dv1 < 2 ? 0 : 11 - dv1;
  soma2 += dv1 * 2;
  let dv2 = soma2 % 11;
  dv2 = dv2 < 2 ? 0 : 11 - dv2;

  const dv = cpf.substr(cpf.length - 2, cpf.length);
  const digito = '' + dv1 + dv2;
  return dv === digito;
}

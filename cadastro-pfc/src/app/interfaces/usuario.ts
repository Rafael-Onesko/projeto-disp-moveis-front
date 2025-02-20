import { Materia } from "./materia";
import { Role } from "./role";

export interface Usuario {
    email: string;
    primeiroNome: string;
    ultimoNome: string;
    senha: string;
    admin: boolean;
    rolesUsuario: Role[];
    materiasUsuario: Materia[];
}

export interface AuthData {
    email: string;
    senha: string;
}
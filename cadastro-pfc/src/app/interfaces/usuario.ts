export interface Usuario {
    login: string;
    nome: string;
    senha: string;
    administrador: boolean;
}

export interface AuthData {
    login: string;
    senha: string;
}
export interface Usuario {
    email: string;
    primeiroNome: string;
    ultimoNome: string;
    senha: string;
    admin: boolean;
}

export interface AuthData {
    email: string;
    senha: string;
}
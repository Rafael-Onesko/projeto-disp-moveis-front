import { Materia } from "./materia";

export interface Professor {
    professor_ID: string;
    professor_Nome: string;
    materias: Materia[]
}
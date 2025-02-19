export interface Colaborador{
    enderecos: [
      {
        idEnd: number,
        cep: string,
        logradouro: string,
        numeroEndereco: string,
        bairro: string,
        cidade: string,
        tipoEndereco: number,
      }
    ],
    telefones: [
      {
        idTel: number,
        numeroTelefone: number,
        tipoTelefone: number,
      }
    ],
    pessoaFisica: {
      idPf: number,
      nome: string,
      cpf: string,
      dataNascimento: Date,
      rg: string,
    },
    idColab: number,
    matricula: number,
    valorContribuicao: number,
    tipoColaborador: number,
    dataAdmissao: Date
  }

  export interface Colaboradores{
    id: number,
    matricula: number,
    nome: string,
    tipoColaborador: number,
  }



  
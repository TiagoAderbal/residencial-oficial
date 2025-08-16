export interface AnotacoesPacientes {
  id: number;
  id_user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  patient: {
    id: number;
    nome_completo: string;
  };
  ocorrencia: string;
  data_hora: string;
};

export interface APIGetAnotacoesPacientes {
  results: AnotacoesPacientes[];
  count: number;
}

export interface APICreateAnotacoesPacientes {
  id_user: number;
  id_patient: string;
  id_medication: string;
  ocorrencia: string;
}

export type APIGetDetailAnotacoesPacientes = AnotacoesPacientes;
export type APIUpdateAnotacoesPacientes = APICreateAnotacoesPacientes;
export type APIDeleteAnotacoesPacientes = void;
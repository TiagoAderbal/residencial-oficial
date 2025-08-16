export interface Prescricao {
  id: number;
  id_patient: {
    id: number;
    nome_completo: string;
  };
  id_medication: {
    id: number;
    name: string;
  };
  dosage: string;
};

export interface APIGetPrescricao {
  results: Prescricao[];
  count: number;
}

export interface APICreatePrescricao {
  id_user: number;
  id_patient: string;
  id_medication: string;
  dosage: string;
}

export type APIGetDetailPrescricao = Prescricao;
export type APIUpdatePrescricao = APICreatePrescricao;
export type APIDeletePrescricao = void;
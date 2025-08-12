export interface Medicamento {
  id: number;
  id_user: number;
  name: string;
  description: string;
  mg: string;
  quantity: number;
}

export interface APIGetMedicamentos {
  count: number;
  next: string | null;
  previous: string | null;
  results: Medicamento[];
}

export interface APICreateMedicamento {
  id: number;
  id_user: number;
  name: string;
  description: string;
  mg: string;
  quantity: number;
}

export interface APIUpdateMedicamento extends APICreateMedicamento {
  id: number;
}

export type APIDeleteMedicamento = void;
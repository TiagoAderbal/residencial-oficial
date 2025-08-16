export interface SinaisVitais {
  id: number;
  id_user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  patient: {
    nome_completo: string;
  };
  pressao_arterial_sistolica: number;
  pressao_arterial_diastolica: number;
  frequencia_cardiaca: number;
  frequencia_respiratoria: number;
  temperatura_corporal: string;
  saturacao_oxigenio: number;
  glicemia_capilar: number;
  observacoes: string;
  data_hora: string;
}

export interface APIGetSinaisVitais {
  results: SinaisVitais[];
  count: number;
}

export interface APICreateSinaisVitais {
  id_user: number;
  patient: number;
  pressao_arterial_sistolica: number;
  pressao_arterial_diastolica: number;
  frequencia_cardiaca: number;
  frequencia_respiratoria: number;
  temperatura_corporal: string;
  saturacao_oxigenio: number;
  glicemia_capilar: number;
  observacoes: string;
}

export type APIGetDetailSinaisVitais = SinaisVitais;
export type APIUpdateSinaisVitais = APICreateSinaisVitais;
export type APIDeleteSinaisVitais = void;
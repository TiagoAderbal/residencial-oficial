export interface TipoLancamento {
  id: number;
  name: string;
  description: string;
}

export interface APIGetTipoLancamentos {
  count: number;
  next: string | null;
  previous: string | null;
  results: TipoLancamento[];
}

export interface APICreateTipoLancamento {
  id: number;
  name: string;
  description: string;
}

export type APIUpdateTipoLancamento = APICreateTipoLancamento;
export type APIDeleteTipoLancamento = void;
export interface TipoConta {
  id: number;
  name: string;
  description: string;
}

export interface APIGetTipoContas {
  count: number;
  next: string | null;
  previous: string | null;
  results: TipoConta[];
}

export interface APICreateTipoConta {
  id: number;
  name: string;
  description: string;
}

export type APIGetDetailTipoConta = TipoConta;
export type APIUpdateTipoConta = APICreateTipoConta;
export type APIDeleteTipoConta = void;
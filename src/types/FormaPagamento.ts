export interface FormaPagamento {
  id: number;
  name: string;
  description: string;
}

export interface APIGetFormaPagamentos {
  count: number;
  next: string | null;
  previous: string | null;
  results: FormaPagamento[];
}

export interface APICreateFormaPagamento {
  id: number;
  name: string;
  description: string;
}

export type APIUpdateFormaPagamento = APICreateFormaPagamento;
export type APIDeleteFormaPagamento = void;
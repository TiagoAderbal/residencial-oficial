export type Lancamento = {
  id: number,
  user: number,
  supplier: number,
  account: number,
  document: number,
  plan_account: number,
  payment_method: number,
  number: string,
  situation: string,
  installment: number,
  dueDate: string,
  value: string,
  fine: string,
  discount: string,
  amount_paid: string,
  observation: string
};

export type APIGetLancamentos = {
  results: Lancamento[];
  count: number;
};

export type APICreateLancamento = Lancamento;
export type APIUpdateLancamento = Lancamento;
export type APIDeleteLancamento = {
  message: string;
};
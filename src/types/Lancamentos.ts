export type Lancamento = {
  id?: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  supplier: {
    id: number;
    name: string;
    taxId: string;
    description: string;
    address: string;
    number: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    mobile: string;
  };
  account: {
    id: number;
    name: string;
    description: string;
  };
  document: {
    id: number;
    name: string;
    description: string;
  };
  plan_account: {
    id: number;
    name: string;
    description: string;
  };
  payment_method: {
    id: number;
    name: string;
    description: string;
  };
  number?: string;
  situation: string;
  installment: number;
  dueDate: string;
  value: string;
  fine: string;
  discount: string;
  amount_paid: string;
  observation?: string;
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
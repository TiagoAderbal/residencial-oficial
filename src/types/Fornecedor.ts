export type Fornecedor = {
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

export type APIGetFornecedores = {
  results: Fornecedor[];
  count: number;
};

export type APIGetDetailFornecedor = Fornecedor;
export type APICreateFornecedor = Fornecedor;
export type APIUpdateFornecedor = Fornecedor;
export type APIDeleteFornecedor = {
  message: string;
};
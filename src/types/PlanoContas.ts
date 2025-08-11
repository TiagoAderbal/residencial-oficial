// src/types/PlanoConta.ts
export type PlanoConta = {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'a' | 's';
  father: number | null;
  subMenus?: PlanoConta[];
};

export type APIGetPlanosConta = {
  results: PlanoConta[];
  count: number;
};

export type APICreatePlanoConta = PlanoConta;
export type APIUpdatePlanoConta = PlanoConta;
export type APIDeletePlanoConta = {
  message: string;
};
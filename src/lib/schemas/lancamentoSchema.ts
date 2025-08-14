"use client";

import { z } from 'zod';

export const lancamentoSchema = z.object({
  supplier: z.string().min(1, { message: "Fornecedor é obrigatório" }),
  account: z.string().min(1, { message: "Tipo de conta é obrigatório" }),
  document: z.string().min(1, { message: "Tipo de documento é obrigatório" }),
  plan_account: z.string().min(1, { message: "Plano de conta é obrigatório" }),
  payment_method: z.string().min(1, { message: "Forma de pagamento é obrigatória" }),
  number: z.string().optional(),
  situation: z.string().min(1, { message: "Situação é obrigatória" }),
  installment: z.string().min(1, { message: "Mês de lançamento é obrigatório" }),
  dueDate: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  value: z.string()
    .min(1, { message: "Valor é obrigatório" })
    .refine(val => /^[\d.,]+$/.test(val), {
      message: "Valor deve ser numérico"
    }),
  fine: z.string()
    .refine(val => /^[\d.,]+$/.test(val), {
      message: "Multa/Juros deve ser numérico"
    })
    .default("0"),
  discount: z.string()
    .refine(val => /^[\d.,]+$/.test(val), {
      message: "Desconto deve ser numérico"
    })
    .default("0"),
  amount_paid: z.string()
    .refine(val => /^[\d.,]+$/.test(val), {
      message: "Valor pago deve ser numérico"
    })
    .default("0"),
  observation: z.string().optional(),
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

export type LancamentoAPI = {
  id?: number;
  user: number;
  supplier: number;
  account: number;
  document: number;
  plan_account: number;
  payment_method: number;
  number?: string;
  situation: string;
  installment: number;
  dueDate: string;
  value: number;
  fine: number;
  discount: number;
  amount_paid: number;
  observation?: string;
};
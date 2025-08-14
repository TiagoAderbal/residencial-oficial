"use client";

import { z } from 'zod';

const requiredField = (fieldName: string) => z.string().min(1, {
  message: `${fieldName} é obrigatório`
});

const currencyField = (fieldName: string) =>
  z.string()
    .min(1, { message: `${fieldName} é obrigatório` })
    .refine(val => /^[\d.,]+$/.test(val), {
      message: `${fieldName} deve ser um valor monetário válido`
    })
    .transform(val => {
      // Remove todos os pontos (separadores de milhar) e substitui vírgula por ponto
      const cleaned = val.replace(/\./g, '').replace(',', '.');
      // Garante que é um número válido
      if (isNaN(Number(cleaned))) return '0';
      return cleaned;
    });

export const lancamentoSchema = z.object({
  supplier: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(val => val !== null, {
    message: "Fornecedor é obrigatório"
  }),
  account: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(val => val !== null, {
    message: "Tipo de conta é obrigatório"
  }),
  document: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(val => val !== null, {
    message: "Tipo de documento é obrigatório"
  }),
  plan_account: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string().optional()
  }).nullable().refine(val => val !== null, {
    message: "Plano de conta é obrigatório"
  }),
  payment_method: z.object({
    id: z.number(),
    name: z.string()
  }).nullable().refine(val => val !== null, {
    message: "Forma de pagamento é obrigatória"
  }),
  number: requiredField("Número"),
  situation: z.enum(["0", "1"], {
    required_error: "Situação é obrigatória"
  }),
  installment: z.number().min(1, {
    message: "Parcela deve ser entre 1 e 12"
  }).max(12),
  dueDate: requiredField("Data de vencimento"),
  value: currencyField("Valor"),
  fine: z.string()
    .default("0")
    .transform(val => val.replace(/\./g, '').replace(',', '.')),
  discount: z.string()
    .default("0")
    .transform(val => val.replace(/\./g, '').replace(',', '.')),
  amount_paid: currencyField("Valor pago"),
  observation: z.string().optional(),
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

export type LancamentoAPI = {
  user_id: number;
  supplier_id: number;
  account_id: number;
  document_id: number;
  plan_account_id: number;
  payment_method_id: number;
  number: string;
  situation: string;
  installment: number;
  dueDate: string;
  value: number;
  fine: number;
  discount: number;
  amount_paid: number;
  observation?: string;
};
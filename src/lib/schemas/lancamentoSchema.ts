"use client";

import { z } from 'zod';

const requiredString = (fieldName: string) => z.string().min(1, {
  message: `${fieldName} é obrigatório`
});

const currencyString = (fieldName: string) =>
  z.string()
    .min(1, { message: `${fieldName} é obrigatório` })
    .refine(val => /^[\d.,]+$/.test(val), {
      message: `${fieldName} deve ser um valor monetário válido`
    })
    .refine(val => {
      const cleaned = val.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleaned) > 0;
    }, {
      message: `${fieldName} deve ser maior que zero`
    });

export const lancamentoSchema = z.object({
  supplier_id: z.number({ required_error: "Fornecedor é obrigatório" }),
  account_id: z.number({ required_error: "Tipo de conta é obrigatório" }),
  document_id: z.number({ required_error: "Tipo de documento é obrigatório" }),
  plan_account_id: z.number({ required_error: "Plano de conta é obrigatório" }),
  payment_method_id: z.number({ required_error: "Forma de pagamento é obrigatória" }),
  number: requiredString("Número"),
  situation: z.enum(["0", "1"], { required_error: "Situação é obrigatória" }),
  installment: z.number(),
  dueDate: requiredString("Data de vencimento"),
  value: currencyString("Valor"),
  fine: z.string(),
  discount: z.string(),
  amount_paid: currencyString("Valor pago"),
  observation: z.string().optional(),
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

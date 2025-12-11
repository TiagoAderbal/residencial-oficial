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
  launch_type: z.number({ required_error: "Tipo de lançamento é obrigatório" }),
  supplier_id: z.number().optional(),
  patient_id: z.number().optional(),

  account_id: z.number({ required_error: "Tipo de conta é obrigatório" }),
  document_id: z.number({ required_error: "Tipo de documento é obrigatório" }),
  plan_account_id: z.number({ required_error: "Plano de contas é obrigatório" }),
  payment_method_id: z.number({
    required_error: "Forma de pagamento é obrigatória",
  }),
  number: requiredString("Número"),
  situation: z.enum(["0", "1"], { required_error: "Situação é obrigatória" }),
  installment: z.number(),
  dueDate: requiredString("Data de vencimento"),
  value: currencyString("Valor"),
  fine: z.string(),
  discount: z.string(),
  amount_paid: currencyString("Valor pago"),
  observation: z.string().optional(),
})
.superRefine((data, ctx) => {
  // Validação condicional baseada no tipo de lançamento
  if (data.launch_type === 1 && data.supplier_id === undefined) { // 1 = Pagamento
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fornecedor é obrigatório para pagamentos.",
      path: ["supplier_id"],
    });
  }
  if (data.launch_type === 2 && data.patient_id === undefined) { // 2 = Recebimento
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paciente é obrigatório para recebimentos.",
      path: ["patient_id"],
    });
  }
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

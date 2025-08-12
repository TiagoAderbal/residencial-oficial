"use client";

import { z } from 'zod';

export const medicamentoSchema = z.object({
  name: z.string()
    .min(1, { message: "Nome obrigatório" })
    .max(50, { message: "Nome muito longo (máx. 50 caracteres)" }),

  description: z.string()
    .min(1, { message: "Descrição obrigatória" })
    .max(100, { message: "Descrição muito longa (máx. 100 caracteres)" })
    .optional(),

  mg: z.string()
    .min(1, { message: "Miligramagem obrigatória" })
    .regex(/^\d+$/, { message: "Apenas números são permitidos" }),

  quantity: z.number()
    .min(1, { message: "Quantidade obrigatória" })
    .max(100000000, { message: "Verifique se a quantidade está correta" })
});

export type MedicamentoFormValues = z.infer<typeof medicamentoSchema>;
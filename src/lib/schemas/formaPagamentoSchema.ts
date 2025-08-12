"use client";

import { z } from 'zod';

export const formaPagamentoSchema = z.object({
  name: z.string()
    .min(1, { message: "Nome obrigatório" })
    .max(50, { message: "Nome muito longo (máx. 50 caracteres)" }),

  description: z.string()
    .min(1, { message: "Descrição obrigatória" })
    .max(50, { message: "Descrição muito longa (máx. 50 caracteres)" })
    .optional(),
});

export type FormaPagamentoFormValues = z.infer<typeof formaPagamentoSchema>;
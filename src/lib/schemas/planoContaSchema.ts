"use client";

import { z } from 'zod';

export const planoContaSchema = z.object({
  code: z.string()
    .min(1, { message: "Código obrigatório" })
    .regex(/^\d(\.\d{2}){0,2}$/, {
      message: "Formato inválido (use X.XX.XX)"
    })
    .refine((value) => {
      const parts = value.split('.');
      return parts.length <= 3 &&
        parts.every(part => part.length <= 2 && part.length > 0);
    }, {
      message: "Estrutura inválida (cada parte deve ter 1-2 dígitos)"
    }),

  name: z.string()
    .min(1, { message: "Nome obrigatório" })
    .max(50, { message: "Nome muito longo (máx. 50 caracteres)" }),

  description: z.string()
    .min(1, { message: "Descrição obrigatória" })
    .max(50, { message: "Descrição muito longa (máx. 50 caracteres)" })
    .optional(),

  type: z.enum(['a', 's'], {
    required_error: "Tipo obrigatório",
    invalid_type_error: "Tipo inválido (use 'a' ou 's')"
  }),

  father: z.string().nullable().optional()
});

export type PlanoContaFormValues = z.infer<typeof planoContaSchema>;
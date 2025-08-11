"use client";

import { z } from 'zod';

// Funções auxiliares para formatação
const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatPhone = (value: string): string => {
  if (!value) return '';

  const cleaned = value.replace(/\D/g, '');
  const isMobile = cleaned.length === 11;

  if (isMobile) {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

export const fornecedorSchema = z.object({
  name: z.string()
    .min(1, { message: "Nome obrigatório" })
    .max(100, { message: "Nome muito longo (máx. 100 caracteres)" }),

  taxId: z.string()
    .min(1, { message: "Documento obrigatório" })
    .transform((value) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length <= 11 ? formatCPF(value) : formatCNPJ(value);
    })
    .refine((value) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 11 || cleaned.length === 14;
    }, { message: "CPF (11 dígitos) ou CNPJ (14 dígitos) inválido" }),

  description: z.string()
    .max(500, { message: "Descrição muito longa (máx. 500 caracteres)" })
    .optional(),

  address: z.string()
    .max(200, { message: "Endereço muito longo (máx. 200 caracteres)" })
    .optional(),

  number: z.string()
    .max(20, { message: "Número muito longo (máx. 20 caracteres)" })
    .optional(),

  city: z.string()
    .max(100, { message: "Cidade muito longa (máx. 100 caracteres)" })
    .optional(),

  state: z.string()
    .length(2, { message: "Selecione um estado válido" })
    .optional(),

  country: z.string()
    .max(100, { message: "País muito longo (máx. 100 caracteres)" })
    .optional(),

  phone: z.string()
    .transform(formatPhone)
    .refine((value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 10 || cleaned.length === 11;
    }, { message: "Telefone inválido (formato: (00) 0000-0000 ou (00) 00000-0000)" })
    .optional(),

  mobile: z.string()
    .transform(formatPhone)
    .refine((value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 10 || cleaned.length === 11;
    }, { message: "Celular inválido (formato: (00) 0000-0000 ou (00) 00000-0000)" })
    .optional(),
});

export type FornecedorFormValues = z.infer<typeof fornecedorSchema>;
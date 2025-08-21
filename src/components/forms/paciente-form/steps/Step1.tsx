"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PacienteFormValues } from "@/lib/schemas/pacienteSchema";

// Função utilitária para calcular idade
function calcularIdade(dataNascimento: string | undefined | null): number {
  if (!dataNascimento) return 0;
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return 0; // Data inválida
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade > 0 ? idade : 0;
}

// Função para formatar data no formato YYYY-MM-DD
function formatarDataParaInput(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

interface Step1Props {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  userId?: number;
}

export const Step1 = ({ form, userId }: Step1Props) => {
  const { watch, setValue } = useFormContext<PacienteFormValues>();

  const dataNascimento = watch("data_nascimento");

  useEffect(() => {
    const idade = calcularIdade(dataNascimento);
    setValue("idade", idade, { shouldValidate: true });
  }, [dataNascimento, setValue]);

  // Definir data atual automaticamente quando o componente montar
  useEffect(() => {
    const dataAtual = formatarDataParaInput(new Date());
    setValue("data_avaliacao", dataAtual, { shouldValidate: true });
  }, [setValue]);

  useEffect(() => {
    if (userId) {
      setValue("id_user", userId, { shouldValidate: true });
    }
  }, [userId, setValue]);

  return (
    <div className="p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="data_avaliacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Avaliação</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ?? ''}
                  readOnly
                  tabIndex={-1}
                  className="bg-gray-100 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resto dos campos permanecem iguais */}
        <FormField
          control={form.control}
          name="nome_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_nascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento *</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade</FormLabel>
              <FormControl>
                <Input {...field} readOnly tabIndex={-1} value={field.value || 0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value
                      .replace(/\D/g, '')
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                      .replace(/(-\d{2})\d+?$/, '$1'));
                  }}
                  placeholder="000.000.000-00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG *</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
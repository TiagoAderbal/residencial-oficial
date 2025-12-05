"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { planoContaSchema, PlanoContaFormValues } from "@/lib/schemas/planoContaSchema";

type PlanoConta = {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'a' | 's';
  father: number | null;
  subMenus?: PlanoConta[];
};

type PlanoContaFormProps = {
  onSubmit: (values: Omit<PlanoContaFormValues, 'father'> & { father: number | null }) => void;
  defaultValues?: Partial<PlanoConta>;
  loading?: boolean;
  onCancel: () => void;
  planosConta?: PlanoConta[];
};

export const PlanoContaForm = ({
  onSubmit,
  defaultValues,
  loading,
  onCancel,
  planosConta = [],
}: PlanoContaFormProps) => {
  const form = useForm<PlanoContaFormValues>({
    resolver: zodResolver(planoContaSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      type: defaultValues?.type || "a",
      father: defaultValues?.father ? String(defaultValues.father) : null,
    },
  });

  const handleSubmit = (values: PlanoContaFormValues) => {
    const apiPayload = {
      ...values,
      father: values.father ? Number(values.father) : null,
    };
    onSubmit(apiPayload);
  };

  const flattenAccounts = (accounts: PlanoConta[], level = 0): (PlanoConta & { level: number })[] => {
    let flatList: (PlanoConta & { level: number })[] = [];
    for (const account of accounts) {
      flatList.push({ ...account, level });
      if (account.subMenus) {
        flatList = flatList.concat(flattenAccounts(account.subMenus, level + 1));
      }
    }
    return flatList;
  };

  const contasSinteticasOptions = flattenAccounts(planosConta).filter(
    (conta) => conta.type === "s"
  );
  
  const formatCodeInput = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, "");

    // Aplica a máscara X.XX.XX conforme o usuário digita
    let formatted = "";

    if (digits.length > 0) {
      formatted = digits[0];

      if (digits.length > 1) {
        formatted += "." + digits.slice(1, 3);

        if (digits.length > 3) {
          formatted += "." + digits.slice(3, 5);
        }
      }
    }

    return formatted;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    placeholder="1.01.01"
                    onChange={(e) => {
                      const formattedValue = formatCodeInput(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Conta</FormLabel>
                <FormControl>
                  <Input {...field} required maxLength={50} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded"
                    {...field}
                    required
                  >
                    <option value="a">Analítica</option>
                    <option value="s">Sintética</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={50} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="father"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conta Pai</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  >
                    <option value="">Nenhuma</option>
                    {contasSinteticasOptions.map((conta) => (
                      <option key={conta.id} value={String(conta.id)}>
                        {'\u00A0'.repeat(conta.level * 4)}
                        {conta.code} - {conta.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
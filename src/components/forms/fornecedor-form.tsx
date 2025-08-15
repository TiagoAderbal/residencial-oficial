"use client";

import { useForm } from "react-hook-form";
import { estadosBrasileiros } from "@/lib/constants";
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
import { fornecedorSchema, FornecedorFormValues } from "@/lib/schemas/fornecedorSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const FornecedorForm = ({
  onSubmit,
  defaultValues,
  loading,
  onCancel,
}: {
  onSubmit: (values: FornecedorFormValues) => void;
  defaultValues?: Partial<FornecedorFormValues>;
  loading?: boolean;
  onCancel: () => void;
}) => {
  const form = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: defaultValues || {
      name: "",
      taxId: "",
      description: "",
      address: "",
      number: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      mobile: "",
    },
  });

  // Campos com máscara dinâmica
  const taxIdValue = form.watch("taxId");
  const phoneValue = form.watch("phone");
  const mobileValue = form.watch("mobile");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleaned = value.replace(/\D/g, '');

                      if (cleaned.length <= 11) {
                        // Formata como CPF
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                          .replace(/(-\d{2})\d+?$/, '$1'));
                      } else {
                        // Formata como CNPJ
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/^(\d{2})(\d)/, '$1.$2')
                          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                          .replace(/\.(\d{3})(\d)/, '.$1/$2')
                          .replace(/(\d{4})(\d)/, '$1-$2')
                          .replace(/(-\d{2})\d+?$/, '$1'));
                      }
                    }}
                    placeholder={taxIdValue?.length > 14 ? '00.000.000/0000-00' : '000.000.000-00'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded"
                    {...field}
                  >
                    <option value="">Selecione</option>
                    {estadosBrasileiros.map((estado) => (
                      <option key={estado.sigla} value={estado.sigla}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleaned = value.replace(/\D/g, '');

                      if (cleaned.length <= 10) {
                        // Formato: (00) 0000-0000
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{2})(\d)/, '($1) $2')
                          .replace(/(\d{4})(\d)/, '$1-$2')
                          .replace(/(-\d{4})\d+?$/, '$1'));
                      } else {
                        // Formato: (00) 00000-0000
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{2})(\d)/, '($1) $2')
                          .replace(/(\d{5})(\d)/, '$1-$2')
                          .replace(/(-\d{4})\d+?$/, '$1'));
                      }
                    }}
                    placeholder="(00) 0000-0000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleaned = value.replace(/\D/g, '');

                      if (cleaned.length <= 10) {
                        // Formato: (00) 0000-0000
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{2})(\d)/, '($1) $2')
                          .replace(/(\d{4})(\d)/, '$1-$2')
                          .replace(/(-\d{4})\d+?$/, '$1'));
                      } else {
                        // Formato: (00) 00000-0000
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{2})(\d)/, '($1) $2')
                          .replace(/(\d{5})(\d)/, '$1-$2')
                          .replace(/(-\d{4})\d+?$/, '$1'));
                      }
                    }}
                    placeholder="(00) 00000-0000"
                  />
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
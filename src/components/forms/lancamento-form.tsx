"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  getFornecedores,
  getTipoContas,
  getTipoDocumentos,
  getPlanoDeContas,
  getFormaPagamentos,
} from "@/lib/requests";
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
import { lancamentoSchema, LancamentoFormValues } from "@/lib/schemas/lancamentoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const LancamentoForm = ({
  onSubmit,
  defaultValues,
  loading,
  onCancel,
}: {
  onSubmit: (values: LancamentoFormValues) => void;
  defaultValues?: Partial<LancamentoFormValues>;
  loading?: boolean;
  onCancel: () => void;
}) => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [tipoContas, setTipoContas] = useState<any[]>([]);
  const [tipoDocumentos, setTipoDocumentos] = useState<any[]>([]);
  const [planoContas, setPlanoContas] = useState<any[]>([]);
  const [formaPagamentos, setFormaPagamentos] = useState<any[]>([]);

  const form = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: defaultValues || {
      supplier: null,
      account: null,
      document: null,
      plan_account: null,
      payment_method: null,
      number: "",
      situation: "0",
      installment: 1,
      dueDate: "",
      value: "0,00",
      fine: "0,00",
      discount: "0,00",
      amount_paid: "0,00",
      observation: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: fornecedoresData },
          { data: tipoContasData },
          { data: tipoDocumentosData },
          { data: planoContasData },
          { data: formaPagamentosData },
        ] = await Promise.all([
          getFornecedores(),
          getTipoContas(),
          getTipoDocumentos(),
          getPlanoDeContas(),
          getFormaPagamentos(),
        ]);

        setFornecedores(fornecedoresData?.results || []);
        setTipoContas(tipoContasData?.results || []);
        setTipoDocumentos(tipoDocumentosData?.results || []);
        setPlanoContas(planoContasData?.results || []);
        setFormaPagamentos(formaPagamentosData?.results || []);
      } catch (error) {
        console.error("Erro ao carregar dados para formulário:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const value = parseCurrencyToFloat(form.getValues('value') || '0');
    const fine = parseCurrencyToFloat(form.getValues('fine') || '0');
    const discount = parseCurrencyToFloat(form.getValues('discount') || '0');

    const total = (value + fine) - discount;
    const formattedTotal = formatDefaultValue(total);

    form.setValue('amount_paid', formattedTotal);
  }, [form.watch('value'), form.watch('fine'), form.watch('discount')]);

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    let onlyNumbers = value.replace(/\D/g, '');

    // Remove zeros à esquerda
    onlyNumbers = onlyNumbers.replace(/^0+/, '');

    // Se ficou vazio, retorna "0,00"
    if (onlyNumbers === '') return '0,00';

    // Garante duas casas decimais
    onlyNumbers = onlyNumbers.padStart(3, '0');

    // Separa parte inteira e decimal
    const integerPart = onlyNumbers.slice(0, -2);
    const decimalPart = onlyNumbers.slice(-2);

    // Formata parte inteira com separadores de milhar
    const formattedInteger = integerPart
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})(?=\d)/g, '$1.')
      .split('')
      .reverse()
      .join('')
      .replace(/^\./, '');

    return `${formattedInteger},${decimalPart}`;
  };

  const handleCurrencyChange = (field: any, value: string) => {
    // Formata o valor enquanto digita
    const formattedValue = formatCurrency(value);
    field.onChange(formattedValue);
  };

  const parseCurrencyToFloat = (value: string) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  // Função para formatar valores padrão
  const formatDefaultValue = (value: number | undefined) => {
    return value ? value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : "0,00";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = fornecedores.find(f => f.id === parseInt(value));
                    field.onChange(selected);
                  }}
                  value={field.value?.id?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                        {fornecedor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = tipoContas.find(t => t.id === parseInt(value));
                    field.onChange(selected);
                  }}
                  value={field.value?.id?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tipoContas.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = tipoDocumentos.find(d => d.id === parseInt(value));
                    field.onChange(selected);
                  }}
                  value={field.value?.id?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tipoDocumentos.map((documento) => (
                      <SelectItem key={documento.id} value={documento.id.toString()}>
                        {documento.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano de Contas *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    let selected = null;
                    for (const group of planoContas) {
                      if (group.id === parseInt(value)) {
                        selected = group;
                        break;
                      }
                      for (const sub of group.subMenus || []) {
                        if (sub.id === parseInt(value)) {
                          selected = sub;
                          break;
                        }
                      }
                      if (selected) break;
                    }
                    field.onChange(selected);
                  }}
                  value={field.value?.id?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano de contas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planoContas.map((group) => (
                      <div key={group.id}>
                        <SelectItem
                          value={group.id.toString()}
                          disabled={group.type !== "a"}
                          className="font-semibold text-gray-500"
                        >
                          {group.name} ({group.code})
                        </SelectItem>

                        {group.subMenus?.map((sub) => (
                          <SelectItem
                            key={sub.id}
                            value={sub.id.toString()}
                            disabled={sub.type !== "a"}
                            className="ml-4"
                          >
                            {sub.name} ({sub.code})
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = formaPagamentos.find(f => f.id === parseInt(value));
                    field.onChange(selected);
                  }}
                  value={field.value?.id?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formaPagamentos.map((forma) => (
                      <SelectItem key={forma.id} value={forma.id.toString()}>
                        {forma.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Pendente</SelectItem>
                    <SelectItem value="1">Pago</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcela *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a parcela" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} {month === 1 ? 'Parcela' : 'Parcelas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor *</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(e) => handleCurrencyChange(field, e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0,00") {
                        e.target.select();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multa/Juros</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(e) => handleCurrencyChange(field, e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0,00") {
                        e.target.select();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(e) => handleCurrencyChange(field, e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0,00") {
                        e.target.select();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount_paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Pago *</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    value={field.value}
                    className="bg-gray-1" // Estilo opcional para indicar que é readonly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
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
import {
  lancamentoSchema,
  LancamentoFormValues,
} from "@/lib/schemas/lancamentoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fornecedor } from "@/types/Fornecedor";
import { TipoConta } from "@/types/TipoContas";
import { TipoDocumento } from "@/types/TipoDocumentos";
import { PlanoConta } from "@/types/PlanoContas";
import { FormaPagamento } from "@/types/FormaPagamento";

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
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [tipoContas, setTipoContas] = useState<TipoConta[]>([]);
  const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
  const [planoContas, setPlanoContas] = useState<PlanoConta[]>([]);
  const [formaPagamentos, setFormaPagamentos] = useState<FormaPagamento[]>([]);

  const form = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: defaultValues || {
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
    const value = parseCurrencyToFloat(form.getValues("value"));
    const fine = parseCurrencyToFloat(form.getValues("fine"));
    const discount = parseCurrencyToFloat(form.getValues("discount"));

    const total = value + fine - discount;
    const formattedTotal = formatDefaultValue(total);

    form.setValue("amount_paid", formattedTotal);
  }, [form, form.watch("value"), form.watch("fine"), form.watch("discount")]);

  const formatCurrency = (value: string) => {
    if (!value) return "0,00";
    let onlyNumbers = value.replace(/\D/g, "");
    onlyNumbers = onlyNumbers.replace(/^0+/, "");
    if (onlyNumbers === "") return "0,00";
    onlyNumbers = onlyNumbers.padStart(3, "0");
    const integerPart = onlyNumbers.slice(0, -2);
    const decimalPart = onlyNumbers.slice(-2);
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger},${decimalPart}`;
  };

  const handleCurrencyChange = (
    field: { onChange: (value: string) => void },
    value: string
  ) => {
    const formattedValue = formatCurrency(value);
    field.onChange(formattedValue);
  };

  const parseCurrencyToFloat = (value: string | undefined) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  };

  const formatDefaultValue = (value: number | undefined) => {
    return value
      ? value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      : "0,00";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem
                        key={fornecedor.id}
                        value={fornecedor.id.toString()}
                      >
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
            name="account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() ?? ""}
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
            name="document_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tipoDocumentos.map((documento) => (
                      <SelectItem
                        key={documento.id}
                        value={documento.id.toString()}
                      >
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
            name="plan_account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano de Contas *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() ?? ""}
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

                        {group.subMenus?.map((sub: PlanoConta) => (
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
            name="payment_method_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() ?? ""}
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
                  value={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a parcela" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month} {month === 1 ? "Parcela" : "Parcelas"}
                        </SelectItem>
                      )
                    )}
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
                    {...field}
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
                    {...field}
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
                    {...field}
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
                    {...field}
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
                <Textarea className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
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
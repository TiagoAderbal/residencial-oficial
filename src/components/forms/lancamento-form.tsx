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
import { useState, useEffect } from "react";
import {
  getFornecedores,
  getTipoContas,
  getTipoDocumentos,
  getPlanoDeContas,
  getFormaPagamentos,
} from "@/lib/requests";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lancamentoSchema, LancamentoFormValues, LancamentoAPI } from "@/lib/schemas/lancamentoSchema";

type Option = {
  id: number;
  name: string;
};

type LancamentoFormProps = {
  onSubmit: (values: LancamentoAPI) => void;
  defaultValues?: Partial<LancamentoFormValues>;
  loading?: boolean;
  onCancel: () => void;
  currentUserId: number; // Adicione esta prop
};

export const LancamentoForm = ({
  onSubmit,
  defaultValues,
  loading,
  onCancel,
  currentUserId, // Recebe o ID do usuário
}: LancamentoFormProps) => {
  const [fornecedores, setFornecedores] = useState<Option[]>([]);
  const [tipoContas, setTipoContas] = useState<Option[]>([]);
  const [tipoDocumentos, setTipoDocumentos] = useState<Option[]>([]);
  const [planoContas, setPlanoContas] = useState<Option[]>([]);
  const [formaPagamentos, setFormaPagamentos] = useState<Option[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
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
        console.error("Erro ao carregar opções:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const form = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: {
      supplier: defaultValues?.supplier || "",
      account: defaultValues?.account || "",
      document: defaultValues?.document || "",
      plan_account: defaultValues?.plan_account || "",
      payment_method: defaultValues?.payment_method || "",
      number: defaultValues?.number || "",
      situation: defaultValues?.situation || "0",
      installment: defaultValues?.installment || "",
      dueDate: defaultValues?.dueDate || new Date(),
      value: defaultValues?.value || "0",
      fine: defaultValues?.fine || "0",
      discount: defaultValues?.discount || "0",
      amount_paid: defaultValues?.amount_paid || "0",
      observation: defaultValues?.observation || "",
    },
  });

  const handleSubmit = (values: LancamentoFormValues) => {
    const parseCurrency = (value: string) => {
      return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    };

    const apiValues: LancamentoAPI = {
      user: currentUserId, // Usa o ID do usuário logado
      supplier: parseInt(values.supplier),
      account: parseInt(values.account),
      document: parseInt(values.document),
      plan_account: parseInt(values.plan_account),
      payment_method: parseInt(values.payment_method),
      number: values.number || undefined,
      situation: values.situation,
      installment: parseInt(values.installment),
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      value: parseCurrency(values.value),
      fine: parseCurrency(values.fine),
      discount: parseCurrency(values.discount),
      amount_paid: parseCurrency(values.amount_paid),
      observation: values.observation || undefined,
    };

    onSubmit(apiValues);
  };

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Seção de informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fornecedor */}
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <div className="p-2 text-center">Carregando...</div>
                    ) : (
                      fornecedores.map((fornecedor) => (
                        <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                          {fornecedor.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Conta */}
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <div className="p-2 text-center">Carregando...</div>
                    ) : (
                      tipoContas.map((conta) => (
                        <SelectItem key={conta.id} value={conta.id.toString()}>
                          {conta.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Documento */}
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <div className="p-2 text-center">Carregando...</div>
                    ) : (
                      tipoDocumentos.map((documento) => (
                        <SelectItem key={documento.id} value={documento.id.toString()}>
                          {documento.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Plano de Contas */}
          <FormField
            control={form.control}
            name="plan_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano de Contas</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano de contas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <div className="p-2 text-center">Carregando...</div>
                    ) : (
                      planoContas.map((plano) => (
                        <SelectItem key={plano.id} value={plano.id.toString()}>
                          {plano.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forma de Pagamento */}
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <div className="p-2 text-center">Carregando...</div>
                    ) : (
                      formaPagamentos.map((forma) => (
                        <SelectItem key={forma.id} value={forma.id.toString()}>
                          {forma.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número do Documento */}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Documento</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Número do documento" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Situação */}
          <FormField
            control={form.control}
            name="situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação</FormLabel>
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

          {/* Mês de Lançamento */}
          <FormField
            control={form.control}
            name="installment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês de Lançamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data de Vencimento */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção de valores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Valor */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="0,00"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d)(\d{2})$/, "$1,$2")
                        .replace(/(?=(\d{3})+(\D))\B/g, ".");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multa/Juros */}
          <FormField
            control={form.control}
            name="fine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multa/Juros</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="0,00"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d)(\d{2})$/, "$1,$2")
                        .replace(/(?=(\d{3})+(\D))\B/g, ".");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Desconto */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="0,00"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d)(\d{2})$/, "$1,$2")
                        .replace(/(?=(\d{3})+(\D))\B/g, ".");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor Pago */}
          <FormField
            control={form.control}
            name="amount_paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Pago</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="0,00"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d)(\d{2})$/, "$1,$2")
                        .replace(/(?=(\d{3})+(\D))\B/g, ".");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observações */}
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões de ação */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
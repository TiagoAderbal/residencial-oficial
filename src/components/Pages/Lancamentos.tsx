"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  getLancamentos,
  createLancamento,
  updateLancamento,
  deleteLancamento,
} from "@/lib/requests";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LancamentoForm } from "@/components/forms/lancamento-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/authStore";
import { Lancamento } from "@/types/Lancamentos";
import { LancamentoFormValues } from "@/lib/schemas/lancamentoSchema";

export const LancamentosPage = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentLancamento, setCurrentLancamento] = useState<Lancamento | null>(
    null
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [lancamentoToView, setLancamentoToView] = useState<Lancamento | null>(
    null
  );
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const { user } = useAuthStore();

  const fetchLancamentos = async (page = 1) => {
    try {
      setIsLoading(true);
      const { data: response } = await getLancamentos(page);

      const sanitizedResults =
        response?.results.map((item) => ({
          ...item,
          observation: item.observation ?? undefined, // converte null para undefined
        })) || [];

      setLancamentos(sanitizedResults);

      const totalCount = response?.count || 0;
      setPagination({
        count: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / 10), // 10 itens por página
      });
    } catch (error) {
      toast.error("Erro ao carregar lançamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLancamentos(1);
  }, []);

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageNumbers = [];

    // Sempre mostra até 5 números de página
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostra páginas próximas à atual
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleOpenCreate = () => {
    setCurrentLancamento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (lancamento: Lancamento) => {
    setCurrentLancamento(lancamento);
    setOpenDrawer(true);
  };

  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return Number(value.replace(/\./g, "").replace(",", "."));
  };

  const handleSubmit = async (values: LancamentoFormValues) => {
    setIsSubmitting(true);

    const payload = {
      user_id: user?.id,
      supplier_id: values.supplier_id,
      account_id: values.account_id,
      document_id: values.document_id,
      plan_account_id: values.plan_account_id,
      payment_method_id: values.payment_method_id,
      number: values.number,
      situation: values.situation,
      installment: values.installment,
      dueDate: values.dueDate,
      value: parseCurrency(values.value),
      fine: parseCurrency(values.fine),
      discount: parseCurrency(values.discount),
      amount_paid: parseCurrency(values.amount_paid),
      observation: values.observation || null,
    };

    const response = currentLancamento?.id
      ? await updateLancamento(currentLancamento.id, payload)
      : await createLancamento(payload);

    setIsSubmitting(false);

    if (response.error) {
      // Se a API retornou um erro (4xx, 5xx), ele será exibido aqui
      toast.error(response.error.message);
    } else {
      // Se deu tudo certo (2xx)
      toast.success(
        currentLancamento?.id
          ? "Lançamento atualizado com sucesso!"
          : "Lançamento criado com sucesso!"
      );
      fetchLancamentos(pagination.currentPage);
      setOpenDrawer(false);
    }
  };

  const handleOpenView = (lancamento: Lancamento) => {
    setLancamentoToView(lancamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!lancamentoToDelete) return;

    try {
      await deleteLancamento(lancamentoToDelete);
      toast.success("Lançamento excluído com sucesso!");
      setOpenDeleteDialog(false);

      // Verifica se estamos na última página com apenas 1 item
      if (lancamentos.length === 1 && pagination.currentPage > 1) {
        fetchLancamentos(pagination.currentPage - 1);
      } else {
        fetchLancamentos(pagination.currentPage);
      }
    } catch (error) {
      toast.error("Erro ao excluir lançamento");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatLancamentoForForm = (
    lancamento: Lancamento | null
  ): Partial<LancamentoFormValues> | undefined => {
    if (!lancamento) return undefined;

    const formatValue = (value: number) =>
      value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

    return {
      supplier_id: lancamento.supplier?.id,
      account_id: lancamento.account?.id,
      document_id: lancamento.document?.id,
      plan_account_id: lancamento.plan_account?.id,
      payment_method_id: lancamento.payment_method?.id,
      number: lancamento.number,
      situation: lancamento.situation as "0" | "1",
      installment: lancamento.installment,
      dueDate: lancamento.dueDate,
      value: formatValue(lancamento.value),
      fine: formatValue(lancamento.fine),
      discount: formatValue(lancamento.discount),
      amount_paid: formatValue(lancamento.amount_paid),
      observation: lancamento.observation || "",
    };
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lançamentos</CardTitle>
              <CardDescription>
                Gerencie seus lançamentos cadastrados
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-11 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200">
                  <div className="truncate-cell-lanc">Fornecedor</div>
                  <div className="truncate-cell-lanc">Contábil</div>
                  <div className="truncate-cell-lanc">Pagamento</div>
                  <div className="truncate-cell-lanc">Situação</div>
                  <div className="truncate-cell-lanc">Qtd Parcelas</div>
                  <div className="truncate-cell-lanc">Vencimento</div>
                  <div className="truncate-cell-lanc">Valor</div>
                  <div className="truncate-cell-lanc">Multa/Juros</div>
                  <div className="truncate-cell-lanc">Desconto</div>
                  <div className="truncate-cell-lanc">Valor Pago</div>
                  <div className="truncate-cell-lanc">Ações</div>
                </div>
                {lancamentos.map((lancamento) => (
                  <div
                    key={lancamento.id}
                    className="grid grid-cols-11 p-4 border-t items-center text-sm"
                  >
                    <div className="truncate-cell-lanc">
                      {lancamento.supplier?.name}
                    </div>
                    <div className="truncate-cell-lanc">
                      {lancamento.plan_account?.name}
                    </div>
                    <div className="truncate-cell-lanc">
                      {lancamento.payment_method?.name}
                    </div>
                    <div className="truncate-cell-lanc">
                      {lancamento.situation === "0" ? "Pendente" : "Pago"}
                    </div>
                    <div className="truncate-cell-lanc">
                      {lancamento.installment}{" "}
                      {lancamento.installment === 1 ? "Parcela" : "Parcelas"}
                    </div>
                    <div className="truncate-cell-lanc">
                      {formatDate(lancamento.dueDate)}
                    </div>
                    <div className="truncate-cell-lanc">
                      {formatCurrency(lancamento.value)}
                    </div>
                    <div className="truncate-cell-lanc">
                      {formatCurrency(lancamento.fine)}
                    </div>
                    <div className="truncate-cell-lanc">
                      {formatCurrency(lancamento.discount)}
                    </div>
                    <div className="truncate-cell-lanc">
                      {formatCurrency(lancamento.amount_paid)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenView(lancamento)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEdit(lancamento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (lancamento.id) {
                            setLancamentoToDelete(lancamento.id);
                            setOpenDeleteDialog(true);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação simplificada */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Total: {pagination.count} lançamentos • Página{" "}
                  {pagination.currentPage} de {pagination.totalPages}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLancamentos(1)}
                    disabled={pagination.currentPage === 1}
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLancamentos(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Anterior
                  </Button>

                  {getPageNumbers().map((pageNum, index) =>
                    pageNum === "..." ? (
                      <Button
                        key={`ellipsis-${index}`}
                        variant="outline"
                        size="sm"
                        disabled
                        className="cursor-default"
                      >
                        ...
                      </Button>
                    ) : (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.currentPage
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => fetchLancamentos(Number(pageNum))}
                      >
                        {pageNum}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLancamentos(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Próxima
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLancamentos(pagination.totalPages)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    »
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Lançamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do lançamento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {lancamentoToView && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Fornecedor
                      </label>
                      <Input value={lancamentoToView.supplier?.name} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Tipo de Conta
                      </label>
                      <Input
                        value={`${lancamentoToView.account?.name}`}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Lançado por
                      </label>
                      <Input
                        value={`${lancamentoToView.user?.first_name || ""} ${lancamentoToView.user?.last_name || ""
                          }`.trim()}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Número
                      </label>
                      <Input
                        value={lancamentoToView.number || "Não informado"}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Situação
                      </label>
                      <Input
                        value={
                          lancamentoToView.situation === "0"
                            ? "Pendente"
                            : "Pago"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Parcela
                      </label>
                      <Input
                        value={`${lancamentoToView.installment} ${lancamentoToView.installment === 1
                          ? "Parcela"
                          : "Parcelas"
                          }`}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Data de Vencimento
                      </label>
                      <Input
                        value={formatDate(lancamentoToView.dueDate)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Valor Original
                      </label>
                      <Input
                        value={formatCurrency(lancamentoToView.value)}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Multa
                      </label>
                      <Input
                        value={formatCurrency(lancamentoToView.fine)}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Desconto
                      </label>
                      <Input
                        value={formatCurrency(lancamentoToView.discount)}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        Valor Total Pago
                      </label>
                      <Input
                        value={formatCurrency(lancamentoToView.amount_paid)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">
                      Observações
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      value={
                        lancamentoToView.observation ||
                        "Nenhuma observação registrada"
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="destructive">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>
              {currentLancamento ? "Editar Lançamento" : "Novo Lançamento"}
            </DrawerTitle>
            <DrawerDescription>
              {currentLancamento
                ? "Atualize as informações do lançamento"
                : "Preencha os campos para cadastrar um novo lançamento"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <LancamentoForm
              onSubmit={handleSubmit}
              defaultValues={formatLancamentoForForm(currentLancamento)}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lançamento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  getLancamentos,
  createLancamento,
  updateLancamento,
  deleteLancamento
} from "@/lib/requests";
import { estadosBrasileiros } from "@/lib/constants";
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
import { LancamentoFormValues, LancamentoAPI } from "@/lib/schemas/lancamentoSchema";
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

type Lancamento = {
  id: number,
  user: number,
  supplier: number,
  account: number,
  document: number,
  plan_account: number,
  payment_method: number,
  number: string,
  situation: string,
  installment: number,
  dueDate: string,
  value: string,
  fine: string,
  discount: string,
  amount_paid: string,
  observation: string
};

export const LancamentosPage = () => {
  const [Lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentLancamento, setCurrentLancamento] = useState<Lancamento | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [LancamentoToDelete, setLancamentoToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [LancamentoToView, setLancamentoToView] = useState<Lancamento | null>(null);

  const { user, clearUser } = useAuthStore();
  const currentUserId = user?.id;

  // Fetch Lancamentos
  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        const { data: response } = await getLancamentos();
        setLancamentos(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar Lancamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLancamentos();
  }, []);

  const handleOpenCreate = () => {
    setCurrentLancamento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (Lancamento: Lancamento) => {
    setCurrentLancamento(Lancamento);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: LancamentoAPI) => {
    setIsSubmitting(true);
    try {
      if (currentLancamento) {
        const response = await updateLancamento(currentLancamento.id, values);
        if (response.data) {
          setLancamentos(Lancamentos.map(f =>
            f.id === currentLancamento.id ? { ...f, ...response.data } : f
          ));
          toast.success("Lancamento atualizado com sucesso!");
        }
      } else {
        const { data: response } = await createLancamento(values);
        if (response) {
          setLancamentos([...Lancamentos, response]);
          toast.success("Lancamento cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentLancamento ? "atualizar" : "cadastrar"} Lancamento`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (Lancamento: Lancamento) => {
    setLancamentoToView(Lancamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!LancamentoToDelete) return;

    try {
      await deleteLancamento(LancamentoToDelete);
      setLancamentos(Lancamentos.filter(f => f.id !== LancamentoToDelete));
      toast.success("Lancamento excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir Lancamento");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: string) => {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getMonthName = (monthNumber: number): string => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Ajusta para array começar em 1 (janeiro = 1)
    return months[monthNumber - 1] || `Mês ${monthNumber}`;
  };

  const convertToFormValues = (lancamento: Lancamento): Partial<LancamentoFormValues> => {
    return {
      supplier: lancamento.supplier.toString(),
      account: lancamento.account.toString(),
      document: lancamento.document.toString(),
      plan_account: lancamento.plan_account.toString(),
      payment_method: lancamento.payment_method.toString(),
      number: lancamento.number,
      situation: lancamento.situation,
      installment: lancamento.installment.toString(),
      dueDate: new Date(lancamento.dueDate),
      value: lancamento.value,
      fine: lancamento.fine,
      discount: lancamento.discount,
      amount_paid: lancamento.amount_paid,
      observation: lancamento.observation,
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
                Gerencie seus lançamentos financeiros
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
            <div className="border rounded-lg overflow-hidden">
              <div
                className="grid bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200"
                style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                <div className="truncate-cell-lanc">Fornecedor</div>
                <div className="truncate-cell-lanc">Tipo Conta</div>
                <div className="truncate-cell-lanc">Documento</div>
                <div className="truncate-cell-lanc">Contábil</div>
                <div className="truncate-cell-lanc">Pagamento</div>
                <div className="truncate-cell-lanc">Número</div>
                <div className="truncate-cell-lanc">Situação</div>
                <div className="truncate-cell-lanc">Mês Lançamento</div>
                <div className="truncate-cell-lanc">Vencimento</div>
                <div className="truncate-cell-lanc">Valor</div>
                <div className="truncate-cell-lanc">Multa/Juros</div>
                <div className="truncate-cell-lanc">Desconto</div>
                <div className="truncate-cell-lanc">Valor Pago</div>
                <div className="truncate-cell-lanc">Ações</div>
              </div>
              {Lancamentos.map((Lancamento) => (
                <div key={Lancamento.id} className="grid p-4 border-t items-center text-sm" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                  <div className="truncate-cell-lanc">{Lancamento.supplier}</div>
                  <div className="truncate-cell-lanc">{Lancamento.account}</div>
                  <div className="truncate-cell-lanc">{Lancamento.document}</div>
                  <div className="truncate-cell-lanc">{Lancamento.plan_account}</div>
                  <div className="truncate-cell-lanc">{Lancamento.payment_method}</div>
                  <div className="truncate-cell-lanc">{Lancamento.number}</div>
                  <div className="truncate-cell-lanc">{Lancamento.situation}</div>
                  <div className="truncate-cell-lanc">{getMonthName(Lancamento.installment)}</div>
                  <div className="truncate-cell-lanc">{formatDate(Lancamento.dueDate)}</div>
                  <div className="truncate-cell-lanc">{formatCurrency(Lancamento.value)}</div>
                  <div className="truncate-cell-lanc">{formatCurrency(Lancamento.fine)}</div>
                  <div className="truncate-cell-lanc">{formatCurrency(Lancamento.discount)}</div>
                  <div className="truncate-cell-lanc">{formatCurrency(Lancamento.amount_paid)}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(Lancamento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(Lancamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setLancamentoToDelete(Lancamento.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawer para visuzliacao */}
      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Lançamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do Lançamento #{LancamentoToView?.id}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {LancamentoToView && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Fornecedor</label>
                      <Input
                        value={LancamentoToView.supplier}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Tipo de Conta</label>
                      <Input value={`Conta #${LancamentoToView.account}`} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Número</label>
                      <Input value={LancamentoToView.number || "Não informado"} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Situação</label>
                      <Input
                        value={LancamentoToView.situation === "0" ? "Pendente" : "Pago"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>


                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Mês de Lançamento</label>
                      <Input value={getMonthName(LancamentoToView.installment)} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Data de Vencimento</label>
                      <Input value={formatDate(LancamentoToView.dueDate)} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Original</label>
                      <Input value={formatCurrency(LancamentoToView.value)} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Multa</label>
                      <Input value={formatCurrency(LancamentoToView.fine)} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Desconto</label>
                      <Input value={formatCurrency(LancamentoToView.discount)} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Total Pago</label>
                      <Input value={formatCurrency(LancamentoToView.amount_paid)} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Observações</label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      value={LancamentoToView.observation || "Nenhuma observação registrada"}
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

      {/* Drawer para criação/edição */}
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
              defaultValues={currentLancamento ? convertToFormValues(currentLancamento) : undefined}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
              currentUserId={currentUserId} // Passe o user ID
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este Lancamento? Esta ação não pode ser desfeita.
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
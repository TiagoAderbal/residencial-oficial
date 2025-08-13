"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  getLancamentos,
  deleteLancamento,
} from "@/lib/requests";
import { fetchLancamentosCompletos, LancamentoCompleto } from "@/services/lancamentoService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const LancamentosPage = () => {
  const [lancamentos, setLancamentos] = useState<LancamentoCompleto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [lancamentoToView, setLancamentoToView] = useState<LancamentoCompleto | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const lancamentosCompletos = await fetchLancamentosCompletos();
        setLancamentos(lancamentosCompletos);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOpenView = (lancamento: LancamentoCompleto) => {
    setLancamentoToView(lancamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!lancamentoToDelete) return;

    try {
      await deleteLancamento(lancamentoToDelete);
      setLancamentos(lancamentos.filter(f => f.id !== lancamentoToDelete));
      toast.success("Lançamento excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir lançamento");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lançamentos</CardTitle>
              <CardDescription>
                Gerencie seus lançamentos contábeis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                <div className="truncate-cell-lanc">Fornecedor</div>
                <div className="truncate-cell-lanc">Conta</div>
                <div className="truncate-cell-lanc">Documento</div>
                <div className="truncate-cell-lanc">Contábil</div>
                <div className="truncate-cell-lanc">Pagamento</div>
                <div className="truncate-cell-lanc">Número</div>
                <div className="truncate-cell-lanc">Situação</div>
                <div className="truncate-cell-lanc">Data</div>
                <div className="truncate-cell-lanc">Vencimento</div>
                <div className="truncate-cell-lanc">Valor</div>
                <div className="truncate-cell-lanc">Multa</div>
                <div className="truncate-cell-lanc">Desconto</div>
                <div className="truncate-cell-lanc">Valor Pago</div>
                <div className="truncate-cell-lanc">Ações</div>
              </div>
              {lancamentos.map((lancamento) => (
                <div key={lancamento.id} className="grid p-4 border-t items-center text-sm" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                  <div className="truncate-cell-lanc">{lancamento.supplierName}</div>
                  <div className="truncate-cell-lanc">{lancamento.accountName}</div>
                  <div className="truncate-cell-lanc">{lancamento.documentName}</div>
                  <div className="truncate-cell-lanc">{lancamento.planAccountName}</div>
                  <div className="truncate-cell-lanc">{lancamento.paymentMethodName}</div>
                  <div className="truncate-cell-lanc">{lancamento.number}</div>
                  <div className="truncate-cell-lanc">{lancamento.situationName}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedInstallment}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedDueDate}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedValue}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedFine}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedDiscount}</div>
                  <div className="truncate-cell-lanc">{lancamento.formattedAmountPaid}</div>
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setLancamentoToDelete(lancamento.id);
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

      {/* Drawer de visualização */}
      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Lançamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do Lançamento #{lancamentoToView?.id}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {lancamentoToView && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Número</label>
                      <Input value={lancamentoToView.number || "Não informado"} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Situação</label>
                      <Input
                        value={lancamentoToView.situationName}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Fornecedor</label>
                      <Input
                        value={lancamentoToView.supplierName}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Conta</label>
                      <Input value={lancamentoToView.accountName} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Data de Lançamento</label>
                      <Input value={lancamentoToView.formattedInstallment} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Data de Vencimento</label>
                      <Input value={lancamentoToView.formattedDueDate} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Original</label>
                      <Input value={lancamentoToView.formattedValue} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Multa</label>
                      <Input value={lancamentoToView.formattedFine} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Desconto</label>
                      <Input value={lancamentoToView.formattedDiscount} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Pago</label>
                      <Input value={lancamentoToView.formattedAmountPaid} readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Observações</label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      value={lancamentoToView.observation || "Nenhuma observação registrada"}
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

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este Lançamento? Esta ação não pode ser desfeita.
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
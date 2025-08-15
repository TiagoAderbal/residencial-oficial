"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormaPagamentoForm } from "@/components/forms/forma-pagam-form";
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
import {
  getFormaPagamentos,
  createFormaPagamento,
  updateFormaPagamento,
  deleteFormaPagamento
} from "@/lib/requests";

type FormaPagamento = {
  id: number;
  name: string;
  description: string;
};

export const FormaPagamentoPage = () => {
  const [formaPagamentos, setFormaPagamentos] = useState<FormaPagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentFormaPagamento, setCurrentFormaPagamento] = useState<FormaPagamento | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formaPagamentoToDelete, setFormaPagamentoToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [formaPagamentoToView, setFormaPagamentoToView] = useState<FormaPagamento | null>(null);

  // Fetch formas de pagamento
  useEffect(() => {
    const fetchFormaPagamentos = async () => {
      try {
        const { data: response } = await getFormaPagamentos();
        setFormaPagamentos(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar formas de pagamento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormaPagamentos();
  }, []);

  const handleOpenCreate = () => {
    setCurrentFormaPagamento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (formaPagamento: FormaPagamento) => {
    setCurrentFormaPagamento(formaPagamento);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    console.log("clicou salvar")
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        description: values.description || '', // Garante que description sempre será string
      };

      if (currentFormaPagamento) {
        const { data: response } = await updateFormaPagamento(currentFormaPagamento.id, data);
        if (response) {
          setFormaPagamentos(formaPagamentos.map(t =>
            t.id === currentFormaPagamento.id ? { ...t, ...response } : t
          ));
          toast.success("Forma de pagamento atualizada com sucesso!");
        }
      } else {
        const { data: response } = await createFormaPagamento(data);
        if (response) {
          setFormaPagamentos([...formaPagamentos, response]);
          toast.success("Forma de pagamento cadastrada com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentFormaPagamento ? "atualizar" : "cadastrar"} forma de pagamento`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (formaPagamento: FormaPagamento) => {
    setFormaPagamentoToView(formaPagamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!formaPagamentoToDelete) return;

    try {
      await deleteFormaPagamento(formaPagamentoToDelete);
      setFormaPagamentos(formaPagamentos.filter(t => t.id !== formaPagamentoToDelete));
      toast.success("Forma de pagamento excluída com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir forma de pagamento");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Formas de Pagamento</CardTitle>
              <CardDescription>
                Gerencie as formas de pagamento
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Forma de Pagamento
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
              <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <div>ID</div>
                <div>Nome</div>
                <div>Descrição</div>
                <div className="text-left">Ações</div>
              </div>
              {formaPagamentos.map((formaPagamento) => (
                <div key={formaPagamento.id} className="grid grid-cols-4 p-4 border-t items-center text-sm">
                  <div>{formaPagamento.id}</div>
                  <div>{formaPagamento.name}</div>
                  <div>{formaPagamento.description || '-'}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(formaPagamento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(formaPagamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setFormaPagamentoToDelete(formaPagamento.id);
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

      {/* Drawer para visualização */}
      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Forma de Pagamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos da forma de pagamento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {formaPagamentoToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <Input value={formaPagamentoToView.id} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={formaPagamentoToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input
                      value={formaPagamentoToView.description || '-'}
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
              {currentFormaPagamento ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}
            </DrawerTitle>
            <DrawerDescription>
              {currentFormaPagamento
                ? "Atualize as informações da forma de pagamento"
                : "Preencha os campos para cadastrar uma nova forma de pagamento"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <FormaPagamentoForm
              onSubmit={handleSubmit}
              defaultValues={currentFormaPagamento || undefined}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
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
              Tem certeza que deseja excluir esta forma de pagamento? Esta ação não pode ser desfeita.
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
}
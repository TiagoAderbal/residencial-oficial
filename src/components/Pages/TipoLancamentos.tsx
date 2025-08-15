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
import { TipoLancamentosForm } from "@/components/forms/tipo-lancamentos-form";
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
  getTipoLancamentos,
  createTipoLancamento,
  updateTipoLancamento,
  deleteTipoLancamento
} from "@/lib/requests";

type TipoLancamento = {
  id: number;
  name: string;
  description: string;
};

export const TipoLancamentoPage = () => {
  const [tipoLancamentos, setTipoLancamentos] = useState<TipoLancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTipoLancamento, setCurrentTipoLancamento] = useState<TipoLancamento | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tipoLancamentoToDelete, setTipoLancamentoToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [tipoLancamentoToView, setTipoLancamentoToView] = useState<TipoLancamento | null>(null);

  // Fetch tipo de Lancamentos
  useEffect(() => {
    const fetchTipoLancamentos = async () => {
      try {
        const { data: response } = await getTipoLancamentos();
        setTipoLancamentos(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar tipos de Lancamento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoLancamentos();
  }, []);

  const handleOpenCreate = () => {
    setCurrentTipoLancamento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (tipoLancamento: TipoLancamento) => {
    setCurrentTipoLancamento(tipoLancamento);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        description: values.description || '', // Garante que description sempre será string
      };

      if (currentTipoLancamento) {
        const { data: response } = await updateTipoLancamento(currentTipoLancamento.id, data);
        if (response) {
          setTipoLancamentos(tipoLancamentos.map(t =>
            t.id === currentTipoLancamento.id ? { ...t, ...response } : t
          ));
          toast.success("Tipo de Lancamento atualizado com sucesso!");
        }
      } else {
        const { data: response } = await createTipoLancamento(data);
        if (response) {
          setTipoLancamentos([...tipoLancamentos, response]);
          toast.success("Tipo de Lancamento cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentTipoLancamento ? "atualizar" : "cadastrar"} tipo de Lancamento`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (tipoLancamento: TipoLancamento) => {
    setTipoLancamentoToView(tipoLancamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!tipoLancamentoToDelete) return;

    try {
      await deleteTipoLancamento(tipoLancamentoToDelete);
      setTipoLancamentos(tipoLancamentos.filter(t => t.id !== tipoLancamentoToDelete));
      toast.success("Tipo de Lancamento excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir tipo de Lancamento");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Lancamento</CardTitle>
              <CardDescription>
                Gerencie os tipos de Lancamento contábil
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Lancamento
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
              {tipoLancamentos.map((tipoLancamento) => (
                <div key={tipoLancamento.id} className="grid grid-cols-4 p-4 border-t items-center text-sm">
                  <div>{tipoLancamento.id}</div>
                  <div>{tipoLancamento.name}</div>
                  <div>{tipoLancamento.description || '-'}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(tipoLancamento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(tipoLancamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setTipoLancamentoToDelete(tipoLancamento.id);
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
            <DrawerTitle>Visualizar Tipo de Lancamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do tipo de Lancamento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {tipoLancamentoToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <Input value={tipoLancamentoToView.id} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={tipoLancamentoToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input
                      value={tipoLancamentoToView.description || '-'}
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
              {currentTipoLancamento ? "Editar Tipo de Lancamento" : "Novo Tipo de Lancamento"}
            </DrawerTitle>
            <DrawerDescription>
              {currentTipoLancamento
                ? "Atualize as informações do tipo de Lancamento"
                : "Preencha os campos para cadastrar um novo tipo de Lancamento"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <TipoLancamentosForm
              onSubmit={handleSubmit}
              defaultValues={currentTipoLancamento || undefined}
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
              Tem certeza que deseja excluir este tipo de Lancamento? Esta ação não pode ser desfeita.
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
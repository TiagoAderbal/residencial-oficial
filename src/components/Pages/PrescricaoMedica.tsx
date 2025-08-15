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
import { TipoContasForm } from "@/components/forms/tipo-contas-form";
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
  getTipoContas,
  createTipoConta,
  updateTipoConta,
  deleteTipoConta
} from "@/lib/requests";

type TipoConta = {
  id: number;
  name: string;
  description: string;
};

export const PrescricaoPage = () => {
  const [tipoContas, setTipoContas] = useState<TipoConta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTipoConta, setCurrentTipoConta] = useState<TipoConta | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tipoContaToDelete, setTipoContaToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [tipoContaToView, setTipoContaToView] = useState<TipoConta | null>(null);

  // Fetch tipo de contas
  useEffect(() => {
    const fetchTipoContas = async () => {
      try {
        const { data: response } = await getTipoContas();
        setTipoContas(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar tipos de conta");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoContas();
  }, []);

  // const handleOpenCreate = () => {
  //   setCurrentTipoConta(null);
  //   setOpenDrawer(true);
  // };

  // const handleOpenEdit = (tipoConta: TipoConta) => {
  //   setCurrentTipoConta(tipoConta);
  //   setOpenDrawer(true);
  // };

  // const handleSubmit = async (values: { name: string; description?: string }) => {
  //   setIsSubmitting(true);
  //   try {
  //     const data = {
  //       name: values.name,
  //       description: values.description || '', // Garante que description sempre será string
  //     };

  //     if (currentTipoConta) {
  //       const { data: response } = await updateTipoConta(currentTipoConta.id, data);
  //       if (response) {
  //         setTipoContas(tipoContas.map(t =>
  //           t.id === currentTipoConta.id ? { ...t, ...response } : t
  //         ));
  //         toast.success("Tipo de conta atualizado com sucesso!");
  //       }
  //     } else {
  //       const { data: response } = await createTipoConta(data);
  //       if (response) {
  //         setTipoContas([...tipoContas, response]);
  //         toast.success("Tipo de conta cadastrado com sucesso!");
  //       }
  //     }
  //     setOpenDrawer(false);
  //   } catch (error) {
  //     toast.error(`Erro ao ${currentTipoConta ? "atualizar" : "cadastrar"} tipo de conta`);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleOpenView = (tipoConta: TipoConta) => {
    setTipoContaToView(tipoConta);
    setOpenViewDrawer(true);
  };

  // const handleDelete = async () => {
  //   if (!tipoContaToDelete) return;

  //   try {
  //     await deleteTipoConta(tipoContaToDelete);
  //     setTipoContas(tipoContas.filter(t => t.id !== tipoContaToDelete));
  //     toast.success("Tipo de conta excluído com sucesso!");
  //     setOpenDeleteDialog(false);
  //   } catch (error) {
  //     toast.error("Erro ao excluir tipo de conta");
  //   }
  // };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Conta</CardTitle>
              <CardDescription>
                Gerencie os tipos de conta contábil
              </CardDescription>
            </div>
            {/* <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Conta
            </Button> */}
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
              {tipoContas.map((tipoConta) => (
                <div key={tipoConta.id} className="grid grid-cols-4 p-4 border-t items-center text-sm">
                  <div>{tipoConta.id}</div>
                  <div>{tipoConta.name}</div>
                  <div>{tipoConta.description || '-'}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(tipoConta)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                    // onClick={() => handleOpenEdit(tipoConta)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                    // onClick={() => {
                    //   setTipoContaToDelete(tipoConta.id);
                    //   setOpenDeleteDialog(true);
                    // }}
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
            <DrawerTitle>Visualizar Tipo de Conta</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do tipo de conta
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {tipoContaToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <Input value={tipoContaToView.id} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={tipoContaToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input
                      value={tipoContaToView.description || '-'}
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
      {/* <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>
              {currentTipoConta ? "Editar Tipo de Conta" : "Novo Tipo de Conta"}
            </DrawerTitle>
            <DrawerDescription>
              {currentTipoConta
                ? "Atualize as informações do tipo de conta"
                : "Preencha os campos para cadastrar um novo tipo de conta"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <TipoContasForm
              onSubmit={handleSubmit}
              defaultValues={currentTipoConta || undefined}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer> */}

      {/* Dialog de confirmação para exclusão */}
      {/* <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tipo de conta? Esta ação não pode ser desfeita.
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
      </AlertDialog> */}
    </main>
  );
}
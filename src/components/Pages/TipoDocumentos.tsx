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
import { TipoDocumentosForm } from "@/components/forms/tipo-documentos-form";
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
  getTipoDocumentos,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento
} from "@/lib/requests";

type TipoDocumento = {
  id: number;
  name: string;
  description: string;
};

export const TipoDocumentoPage = () => {
  const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTipoDocumento, setCurrentTipoDocumento] = useState<TipoDocumento | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tipoDocumentoToDelete, setTipoDocumentoToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [tipoDocumentoToView, setTipoDocumentoToView] = useState<TipoDocumento | null>(null);

  // Fetch tipo de Documentos
  useEffect(() => {
    const fetchTipoDocumentos = async () => {
      try {
        const { data: response } = await getTipoDocumentos();
        setTipoDocumentos(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar tipos de Documento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoDocumentos();
  }, []);

  const handleOpenCreate = () => {
    setCurrentTipoDocumento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (tipoDocumento: TipoDocumento) => {
    setCurrentTipoDocumento(tipoDocumento);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    setIsSubmitting(true);
    try {
      const data = {
        name: values.name,
        description: values.description || '', // Garante que description sempre será string
      };

      if (currentTipoDocumento) {
        const { data: response } = await updateTipoDocumento(currentTipoDocumento.id, data);
        if (response) {
          setTipoDocumentos(tipoDocumentos.map(t =>
            t.id === currentTipoDocumento.id ? { ...t, ...response } : t
          ));
          toast.success("Tipo de Documento atualizado com sucesso!");
        }
      } else {
        const { data: response } = await createTipoDocumento(data);
        if (response) {
          setTipoDocumentos([...tipoDocumentos, response]);
          toast.success("Tipo de Documento cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentTipoDocumento ? "atualizar" : "cadastrar"} tipo de Documento`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (tipoDocumento: TipoDocumento) => {
    setTipoDocumentoToView(tipoDocumento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!tipoDocumentoToDelete) return;

    try {
      await deleteTipoDocumento(tipoDocumentoToDelete);
      setTipoDocumentos(tipoDocumentos.filter(t => t.id !== tipoDocumentoToDelete));
      toast.success("Tipo de Documento excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir tipo de Documento");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Documento</CardTitle>
              <CardDescription>
                Gerencie os tipos de Documento contábil
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Documento
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
              {tipoDocumentos.map((tipoDocumento) => (
                <div key={tipoDocumento.id} className="grid grid-cols-4 p-4 border-t items-center text-sm">
                  <div>{tipoDocumento.id}</div>
                  <div>{tipoDocumento.name}</div>
                  <div>{tipoDocumento.description || '-'}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(tipoDocumento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(tipoDocumento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setTipoDocumentoToDelete(tipoDocumento.id);
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
            <DrawerTitle>Visualizar Tipo de Documento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do tipo de Documento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {tipoDocumentoToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <Input value={tipoDocumentoToView.id} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={tipoDocumentoToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input
                      value={tipoDocumentoToView.description || '-'}
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
              {currentTipoDocumento ? "Editar Tipo de Documento" : "Novo Tipo de Documento"}
            </DrawerTitle>
            <DrawerDescription>
              {currentTipoDocumento
                ? "Atualize as informações do tipo de Documento"
                : "Preencha os campos para cadastrar um novo tipo de Documento"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <TipoDocumentosForm
              onSubmit={handleSubmit}
              defaultValues={currentTipoDocumento || undefined}
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
              Tem certeza que deseja excluir este tipo de Documento? Esta ação não pode ser desfeita.
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
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
import { MedicamentosForm } from "@/components/forms/medicamentos-form";
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
  getMedicamentos,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento
} from "@/lib/requests";
import { useAuthStore } from "@/store/authStore";

type Medicamento = {
  id: number;
  id_user: number;
  name: string;
  description: string;
  mg: string;
  quantity: number;
};

export const MedicamentosPage = () => {
  const { user } = useAuthStore();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentMedicamento, setCurrentMedicamento] = useState<Medicamento | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [medicamentoToDelete, setMedicamentoToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [medicamentoToView, setMedicamentoToView] = useState<Medicamento | null>(null);

  // Fetch medicamentos
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const { data: response } = await getMedicamentos();
        setMedicamentos(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar medicamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicamentos();
  }, []);

  const handleOpenCreate = () => {
    setCurrentMedicamento(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (medicamento: Medicamento) => {
    setCurrentMedicamento(medicamento);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: {
    name: string;
    description?: string;
    mg: string;
    quantity: number;
  }) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const data = {
        id_user: user.id,
        name: values.name,
        description: values.description || '',
        mg: values.mg,
        quantity: values.quantity
      };

      if (currentMedicamento) {
        const { data: response } = await updateMedicamento(currentMedicamento.id, data);
        if (response) {
          setMedicamentos(medicamentos.map(m =>
            m.id === currentMedicamento.id ? { ...m, ...response } : m
          ));
          toast.success("Medicamento atualizado com sucesso!");
        }
      } else {
        const { data: response } = await createMedicamento(data);
        if (response) {
          setMedicamentos([...medicamentos, response]);
          toast.success("Medicamento cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentMedicamento ? "atualizar" : "cadastrar"} medicamento`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (medicamento: Medicamento) => {
    setMedicamentoToView(medicamento);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!medicamentoToDelete) return;

    try {
      await deleteMedicamento(medicamentoToDelete);
      setMedicamentos(medicamentos.filter(m => m.id !== medicamentoToDelete));
      toast.success("Medicamento excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir medicamento");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Medicamentos</CardTitle>
              <CardDescription>
                Gerencie seus medicamentos
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Medicamento
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
              <div className="grid grid-cols-5 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <div>Nome</div>
                <div>Descrição</div>
                <div>Miligramagem (mg)</div>
                <div>Quantidade</div>
                <div className="text-left">Ações</div>
              </div>
              {medicamentos.map((medicamento) => (
                <div key={medicamento.id} className="grid grid-cols-5 p-4 border-t items-center text-sm">
                  <div className="truncate-cell">{medicamento.name}</div>
                  <div className="truncate-cell">{medicamento.description || '-'}</div>
                  <div className="truncate-cell">{medicamento.mg} mg</div>
                  <div className="truncate-cell">{medicamento.quantity}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(medicamento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(medicamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setMedicamentoToDelete(medicamento.id);
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
            <DrawerTitle>Visualizar Medicamento</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do medicamento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {medicamentoToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={medicamentoToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Miligramagem</label>
                    <Input
                      value={`${medicamentoToView.mg} mg`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantidade</label>
                    <Input
                      value={medicamentoToView.quantity}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input
                      value={medicamentoToView.description || '-'}
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
              {currentMedicamento ? "Editar Medicamento" : "Novo Medicamento"}
            </DrawerTitle>
            <DrawerDescription>
              {currentMedicamento
                ? "Atualize as informações do medicamento"
                : "Preencha os campos para cadastrar um novo medicamento"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <MedicamentosForm
              onSubmit={handleSubmit}
              defaultValues={currentMedicamento || undefined}
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
              Tem certeza que deseja excluir este medicamento? Esta ação não pode ser desfeita.
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
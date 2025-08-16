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
// import { AnotacaoPacienteForm } from "@/components/forms/tipo-contas-form";
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
  getAnotacoesPacientes,
  createAnotacoesPacientes,
  updateAnotacoesPacientes,
  deleteAnotacoesPacientes
} from "@/lib/requests";
import { Textarea } from "../ui/textarea";

type AnotacaoPaciente = {
  id: number;
  id_user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  patient: {
    id: number;
    nome_completo: string;
  };
  ocorrencia: string;
  data_hora: string;
};

export const AnotacoesPage = () => {
  const [AnotacaoPaciente, setAnotacaoPaciente] = useState<AnotacaoPaciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentAnotacaoPaciente, setCurrentAnotacaoPaciente] = useState<AnotacaoPaciente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [AnotacaoPacienteToDelete, setAnotacaoPacienteToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [AnotacaoPacienteToView, setAnotacaoPacienteToView] = useState<AnotacaoPaciente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tipo de contas
  useEffect(() => {
    const fetchAnotacaoPaciente = async () => {
      try {
        const { data: response } = await getAnotacoesPacientes();
        setAnotacaoPaciente(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar Prescrição");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnotacaoPaciente();
  }, []);

  // const handleOpenCreate = () => {
  //   setCurrentAnotacaoPaciente(null);
  //   setOpenDrawer(true);
  // };

  // const handleOpenEdit = (AnotacaoPaciente: AnotacaoPaciente) => {
  //   setCurrentAnotacaoPaciente(AnotacaoPaciente);
  //   setOpenDrawer(true);
  // };

  // const handleSubmit = async (values: { name: string; description?: string }) => {
  //   setIsSubmitting(true);
  //   try {
  //     const data = {
  //       name: values.name,
  //       description: values.description || '', // Garante que description sempre será string
  //     };

  //     if (currentAnotacaoPaciente) {
  //       const { data: response } = await updateAnotacoesPacientes(currentAnotacaoPaciente.id, data);
  //       if (response) {
  //         setAnotacaoPaciente(AnotacaoPaciente.map(t =>
  //           t.id === currentAnotacaoPaciente.id ? { ...t, ...response } : t
  //         ));
  //         toast.success("Tipo de conta atualizado com sucesso!");
  //       }
  //     } else {
  //       const { data: response } = await createAnotacoesPacientes(data);
  //       if (response) {
  //         setAnotacaoPaciente([...AnotacaoPaciente, response]);
  //         toast.success("Tipo de conta cadastrado com sucesso!");
  //       }
  //     }
  //     setOpenDrawer(false);
  //   } catch (error) {
  //     toast.error(`Erro ao ${currentAnotacaoPaciente ? "atualizar" : "cadastrar"} tipo de conta`);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleOpenView = (AnotacaoPaciente: AnotacaoPaciente) => {
    setAnotacaoPacienteToView(AnotacaoPaciente);
    setOpenViewDrawer(true);
  };

  // const handleDelete = async () => {
  //   if (!AnotacaoPacienteToDelete) return;

  //   try {
  //     await deleteAnotacoesPacientes(AnotacaoPacienteToDelete);
  //     setAnotacaoPaciente(AnotacaoPaciente.filter(t => t.id !== AnotacaoPacienteToDelete));
  //     toast.success("Tipo de conta excluído com sucesso!");
  //     setOpenDeleteDialog(false);
  //   } catch (error) {
  //     toast.error("Erro ao excluir tipo de conta");
  //   }
  // };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  const filteredAnotacaoPaciente = AnotacaoPaciente.filter(AnotacaoPaciente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      AnotacaoPaciente.patient?.nome_completo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Anotações dos Pacientes</CardTitle>
              <CardDescription>
                Gerencie as anotações dos pacientes
              </CardDescription>
            </div>
            <Button
            // onClick={handleOpenCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Prescrição Médica
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por paciente, medicamento ou dosagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <div>Nome Paciente</div>
                <div>Ocorrência</div>
                <div>Data e Hora</div>
                <div className="text-left">Ações</div>
              </div>
              {AnotacaoPaciente.map((AnotacaoPaciente) => (
                <div key={AnotacaoPaciente.id} className="grid grid-cols-4 p-4 border-t items-center text-sm">
                  <div className="truncate-cell">{AnotacaoPaciente.patient?.nome_completo}</div>
                  <div className="truncate-cell">{AnotacaoPaciente.ocorrencia}</div>
                  <div className="truncate-cell">{formatDate(AnotacaoPaciente.data_hora)}</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(AnotacaoPaciente)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                    // onClick={() => handleOpenEdit(AnotacaoPaciente)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                    // onClick={() => {
                    //   setAnotacaoPacienteToDelete(AnotacaoPaciente.id);
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
            <DrawerTitle>Visualizar Prescrição Médica</DrawerTitle>
            <DrawerDescription>
              Detalhes completos da prescrição
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {AnotacaoPacienteToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Paciente</label>
                    <Input value={AnotacaoPacienteToView.patient?.nome_completo} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lançado por</label>
                    <Input value={AnotacaoPacienteToView.id_user?.first_name + ' ' + AnotacaoPacienteToView.id_user?.last_name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data e Hora de Lançamento</label>
                    <Input value={formatDate(AnotacaoPacienteToView.data_hora)} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ocorrência</label>
                    <Textarea
                      value={AnotacaoPacienteToView.ocorrencia || '-'}
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
              {currentAnotacaoPaciente ? "Editar Tipo de Conta" : "Novo Tipo de Conta"}
            </DrawerTitle>
            <DrawerDescription>
              {currentAnotacaoPaciente
                ? "Atualize as informações do tipo de conta"
                : "Preencha os campos para cadastrar um novo tipo de conta"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <AnotacaoPacienteForm
              onSubmit={handleSubmit}
              defaultValues={currentAnotacaoPaciente || undefined}
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
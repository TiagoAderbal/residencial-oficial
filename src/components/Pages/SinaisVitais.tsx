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
// import { SinaisVitaisForm } from "@/components/forms/tipo-contas-form";
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
  getSinaisVitais,
  createSinaisVitais,
  updateSinaisVitais,
  deleteSinaisVitais
} from "@/lib/requests";
import { Textarea } from "../ui/textarea";

type SinaisVitais = {
  id: number;
  id_user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  patient: {
    nome_completo: string;
  };
  pressao_arterial_sistolica: number;
  pressao_arterial_diastolica: number;
  frequencia_cardiaca: number;
  frequencia_respiratoria: number;
  temperatura_corporal: string;
  saturacao_oxigenio: number;
  glicemia_capilar: number;
  observacoes: string;
  data_hora: string;
};

export const SinaisVitPage = () => {
  const [SinaisVitais, setSinaisVitais] = useState<SinaisVitais[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentSinaisVitais, setCurrentSinaisVitais] = useState<SinaisVitais | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [SinaisVitaisToDelete, setSinaisVitaisToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [SinaisVitaisToView, setSinaisVitaisToView] = useState<SinaisVitais | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tipo de contas
  useEffect(() => {
    const fetchSinaisVitais = async () => {
      try {
        const { data: response } = await getSinaisVitais();
        setSinaisVitais(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar Sinais vitais");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSinaisVitais();
  }, []);

  // const handleOpenCreate = () => {
  //   setCurrentSinaisVitais(null);
  //   setOpenDrawer(true);
  // };

  // const handleOpenEdit = (SinaisVitais: SinaisVitais) => {
  //   setCurrentSinaisVitais(SinaisVitais);
  //   setOpenDrawer(true);
  // };

  // const handleSubmit = async (values: { name: string; description?: string }) => {
  //   setIsSubmitting(true);
  //   try {
  //     const data = {
  //       name: values.name,
  //       description: values.description || '', // Garante que description sempre será string
  //     };

  //     if (currentSinaisVitais) {
  //       const { data: response } = await updateSinaisVitais(currentSinaisVitais.id, data);
  //       if (response) {
  //         setSinaisVitais(SinaisVitais.map(t =>
  //           t.id === currentSinaisVitais.id ? { ...t, ...response } : t
  //         ));
  //         toast.success("Tipo de conta atualizado com sucesso!");
  //       }
  //     } else {
  //       const { data: response } = await createSinaisVitais(data);
  //       if (response) {
  //         setSinaisVitais([...SinaisVitais, response]);
  //         toast.success("Tipo de conta cadastrado com sucesso!");
  //       }
  //     }
  //     setOpenDrawer(false);
  //   } catch (error) {
  //     toast.error(`Erro ao ${currentSinaisVitais ? "atualizar" : "cadastrar"} tipo de conta`);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleOpenView = (SinaisVitais: SinaisVitais) => {
    setSinaisVitaisToView(SinaisVitais);
    setOpenViewDrawer(true);
  };

  // const handleDelete = async () => {
  //   if (!SinaisVitaisToDelete) return;

  //   try {
  //     await deleteSinaisVitais(SinaisVitaisToDelete);
  //     setSinaisVitais(SinaisVitais.filter(t => t.id !== SinaisVitaisToDelete));
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

  const filteredSinaisVitais = SinaisVitais.filter(SinaisVitais => {
    const searchLower = searchTerm.toLowerCase();
    return (
      SinaisVitais.patient?.nome_completo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sinais Vitais</CardTitle>
              <CardDescription>
                Gerencie os sinais vitais dos pacientes
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
              <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <div>Nome Paciente</div>
                <div>Pressão Arterial</div>
                <div>Frequência Cardíaca</div>
                <div>Frequência Respiratória</div>
                <div>Temperatura</div>
                <div>Glicemia</div>
                <div className="text-left">Ações</div>
              </div>
              {filteredSinaisVitais.map((SinaisVitais) => (
                <div key={SinaisVitais.id} className="grid grid-cols-7 p-4 border-t items-center text-sm">
                  <div className="truncate-cell">{SinaisVitais.patient?.nome_completo}</div>
                  <div className="truncate-cell">{`${SinaisVitais.pressao_arterial_sistolica || '?'} / ${SinaisVitais.pressao_arterial_diastolica || '?'}`}</div>
                  <div className="truncate-cell">{SinaisVitais.frequencia_cardiaca || '-'} BPM</div>
                  <div className="truncate-cell">{SinaisVitais.frequencia_respiratoria || '-'} rpm</div>
                  <div className="truncate-cell">{SinaisVitais.temperatura_corporal || '-'} °C</div>
                  <div className="truncate-cell">{SinaisVitais.glicemia_capilar || '-'} mg/dL</div>
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(SinaisVitais)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                    // onClick={() => handleOpenEdit(SinaisVitais)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                    // onClick={() => {
                    //   setSinaisVitaisToDelete(SinaisVitais.id);
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
            {SinaisVitaisToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Paciente</label>
                    <Input value={SinaisVitaisToView.patient?.nome_completo} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lançado por</label>
                    <Input value={SinaisVitaisToView.id_user?.first_name + ' ' + SinaisVitaisToView.id_user?.last_name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data e Hora de Aferição</label>
                    <Input
                      value={formatDate(SinaisVitaisToView.data_hora) || '?'}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pressão Arterial</label>
                    <Input
                      value={`${SinaisVitaisToView.pressao_arterial_sistolica || '?'} / ${SinaisVitaisToView.pressao_arterial_diastolica || '?'}`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequência Cardíaca</label>
                    <Input
                      value={`${SinaisVitaisToView.frequencia_cardiaca || '?'} BPM`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequência Respiratória</label>
                    <Input
                      value={`${SinaisVitaisToView.frequencia_respiratoria || '?'} rpm`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperatura Corporal</label>
                    <Input
                      value={`${SinaisVitaisToView.temperatura_corporal || '?'} °C`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Glicemia Capilar</label>
                    <Input
                      value={`${SinaisVitaisToView.glicemia_capilar || '?'} mg/dL`}
                      readOnly
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Observações</label>
                    <Textarea
                      value={SinaisVitaisToView.observacoes || '?'}
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
              {currentSinaisVitais ? "Editar Tipo de Conta" : "Novo Tipo de Conta"}
            </DrawerTitle>
            <DrawerDescription>
              {currentSinaisVitais
                ? "Atualize as informações do tipo de conta"
                : "Preencha os campos para cadastrar um novo tipo de conta"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <SinaisVitaisForm
              onSubmit={handleSubmit}
              defaultValues={currentSinaisVitais || undefined}
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
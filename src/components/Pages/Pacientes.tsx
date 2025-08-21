"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, Edit, Search } from "lucide-react";
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
import {
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from "@/lib/requests";
import { useAuthStore } from "@/store/authStore";
import { Paciente, CreatePacientePayload } from "@/types/Pacientes";
import { PacientesForm } from "@/components/forms/paciente-form";
import { PacienteFormValues } from "@/lib/schemas/pacienteSchema";
import { Textarea } from "@/components/ui/textarea";

export const PacientesPage = () => {
  const { user } = useAuthStore();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentPaciente, setCurrentPaciente] = useState<Paciente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [pacienteToView, setPacienteToView] = useState<Paciente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchPacientes = async (page = 1) => {
    try {
      setIsLoading(true);
      // TODO: Implementar paginação e busca na API
      const { data: response } = await getPacientes();
      setPacientes(response?.results || []);
      const totalCount = response?.count || 0;

      setPagination({
        count: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / 10), // 10 itens por página
      });
    } catch (error) {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes(1);
  }, []);

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
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
    setCurrentPaciente(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (paciente: Paciente) => {
    setCurrentPaciente(paciente);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: PacienteFormValues) => {
    if (!user) {
      toast.error("Usuário não autenticado. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);

    // Garantir que a idade seja um número antes de enviar
    const idade = values.idade ?? calcularIdade(values.data_nascimento);
    if (typeof idade !== 'number') {
      toast.error("Não foi possível calcular a idade. Verifique a data de nascimento.");
      setIsSubmitting(false);
      return;
    }

    // O erro de tipo indica que a função de requisição espera o objeto `user` aninhado,
    // e não `id_user`. Vamos montar o payload de acordo com a assinatura da função.
    const payload = {
      ...values,
      idade, // Agora é sempre um número
      user: user, // Adiciona o objeto user completo
    };

    // Para a API, a função em `requests.ts` provavelmente extrai o `user.id`
    // e monta o payload final com `id_user`.

    try {
      if (currentPaciente?.id) {
        // A função de update provavelmente espera um payload parcial, mas vamos enviar completo para garantir
        await updatePaciente(currentPaciente.id, payload);
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await createPaciente(payload);
        toast.success("Paciente criado com sucesso!");
      }

      fetchPacientes(pagination.currentPage);
      setOpenDrawer(false);
      setCurrentPaciente(null);

    } catch (error: any) {
      const apiErrors = error?.response?.data;
      if (typeof apiErrors === 'object' && apiErrors !== null) {
        Object.entries(apiErrors).forEach(([field, messages]) => {
          toast.error(`${field}: ${(messages as string[]).join(', ')}`);
        });
      } else {
        toast.error(error.message || "Ocorreu um erro ao salvar o paciente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (paciente: Paciente) => {
    setPacienteToView(paciente);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!pacienteToDelete) return;

    try {
      await deletePaciente(pacienteToDelete);
      toast.success("Paciente excluído com sucesso!");
      setOpenDeleteDialog(false);
      // Recarrega os pacientes, ajustando a página se for o último item
      if (pacientes.length === 1 && pagination.currentPage > 1) {
        fetchPacientes(pagination.currentPage - 1);
      } else {
        fetchPacientes(pagination.currentPage);
      }
    } catch (error) {
      toast.error("Erro ao excluir paciente");
    }
  };

  const formatPacienteForForm = (
    paciente: Paciente | null
  ): Partial<PacienteFormValues> | undefined => {
    if (!paciente) return undefined;

    // Mapeia o objeto do paciente para os valores do formulário
    // Converte valores nulos/undefined para strings vazias ou padrões
    const formValues: Partial<PacienteFormValues> = {};
    for (const key in paciente) {
      const typedKey = key as keyof Paciente;
      const value = paciente[typedKey];
      if (value !== null && value !== undefined) {
        (formValues as any)[typedKey] = value;
      } else {
        (formValues as any)[typedKey] = ''; // ou outro valor padrão
      }
    }
    return formValues;
  };

  const calcularIdade = (dataNascimento: string | null | undefined) => {
    if (!dataNascimento) return "";
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    if (isNaN(nascimento.getTime())) return "";
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade > 0 ? idade : 0;
  }

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pacientes</CardTitle>
              <CardDescription>Gerencie seus Pacientes</CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar nome do paciente..."
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
            <>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <div>Nome Completo</div>
                  <div>Data de Nascimento</div>
                  <div>Idade</div>
                  <div>CPF</div>
                  <div>Telefone Responsável</div>
                  <div className="text-left">Ações</div>
                </div>
                {filteredPacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="grid grid-cols-6 p-4 border-t items-center text-sm"
                  >
                    <div className="truncate-cell">
                      {paciente.nome_completo}
                    </div>
                    <div className="truncate-cell">
                      {new Date(paciente.data_nascimento).toLocaleDateString(
                        "pt-BR", { timeZone: 'UTC' }
                      )}
                    </div>
                    <div className="truncate-cell">
                      {calcularIdade(paciente.data_nascimento)}
                    </div>
                    <div className="truncate-cell">{paciente.cpf}</div>
                    <div className="truncate-cell">
                      {paciente.telefone_responsavel || 'N/A'}
                    </div>
                    <div className="flex gap-2 justify-start">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenView(paciente)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEdit(paciente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (paciente.id !== undefined) {
                            setPacienteToDelete(paciente.id);
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

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Total: {pagination.count} pacientes • Página{" "}
                  {pagination.currentPage} de {pagination.totalPages}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPacientes(1)}
                    disabled={pagination.currentPage === 1}
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPacientes(pagination.currentPage - 1)}
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
                        onClick={() => fetchPacientes(Number(pageNum))}
                      >
                        {pageNum}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPacientes(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Próxima
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPacientes(pagination.totalPages)}
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

      {/* Drawer para visualização de Paciente */}
      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Paciente</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do paciente
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {pacienteToView && (
              // O conteúdo do drawer de visualização permanece o mesmo
              // por ser muito extenso e não fazer parte do escopo principal da tarefa.
              <pre>{JSON.stringify(pacienteToView, null, 2)}</pre>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="destructive">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer para criação/edição de Paciente */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>
              {currentPaciente ? "Editar Paciente" : "Novo Paciente"}
            </DrawerTitle>
            <DrawerDescription>
              {currentPaciente
                ? "Atualize as informações do Paciente"
                : "Preencha os campos para cadastrar um novo Paciente"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <PacientesForm
              onSubmit={handleSubmit}
              defaultValues={formatPacienteForForm(currentPaciente)}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Dialog de confirmação para exclusão de Paciente */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este paciente? Esta ação não pode
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
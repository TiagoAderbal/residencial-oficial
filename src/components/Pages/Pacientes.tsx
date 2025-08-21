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

  // Helper function to format labels
  const formatLabel = (str: string) => {
    const specialCases: { [key: string]: string } = {
      ajuda_total: 'Ajuda Total',
      // Add other special cases here if needed
    };
    if (specialCases[str]) {
      return specialCases[str];
    }
    return str
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Helper function to render values based on type
  const renderValue = (k: string, v: any) => {
    if (v === null || v === undefined || v === '') {
      return 'Não preenchido';
    }
    if (k.includes('data_') || k.includes('date_')) {
      const date = new Date(v);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }
    }
    if (typeof v === 'boolean') {
      return v ? 'Sim' : 'Não';
    }
    if (k === 'idade') {
      return `${v} anos`;
    }
    // Handle 'observacoes' specifically as it's a Textarea
    if (k === 'observacoes') {
      return (
        <Textarea
          value={v}
          readOnly
          className="mt-1 resize-none"
          rows={5}
        />
      );
    }
    // For all other string values, apply capitalization and underscore-to-space conversion
    if (typeof v === 'string') {
      // First, replace underscores with spaces
      let formattedString = v.replace(/_/g, ' ');
      // Then, capitalize the first letter of each word
      formattedString = formattedString.replace(/\b\w/g, (char) => char.toUpperCase());
      return formattedString;
    }
    return String(v);
  };

  interface DisplayField {
    key: keyof Paciente;
    label?: string;
    render?: (value: any, paciente: Paciente) => React.ReactNode;
    colSpan?: string;
  }

  interface DisplaySection {
    title: string;
    fields: DisplayField[];
  }

  const displayConfig: DisplaySection[] = [
    {
      title: "Informações Pessoais",
      fields: [
        { key: "nome_completo" },
        { key: "data_nascimento", render: (value, paciente) => `${new Date(value).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} (${calcularIdade(paciente.data_nascimento)} anos)` },
        { key: "idade", render: (value) => `${value} anos` },
        { key: "rg" },
        { key: "cpf" },
        { key: "naturalidade" },
        { key: "religiao" },
        { key: "praticante", render: (value) => (value ? "Sim" : "Não") },
        { key: "profissao" },
        { key: "escolaridade" },
        { key: "estado_civil" },
        { key: "orgao_expedidor" },
      ],
    },
    {
      title: "Filiação e Contato",
      fields: [
        { key: "nome_pai" },
        { key: "nome_mae" },
        { key: "responsavel" },
        { key: "telefone_responsavel" },
        { key: "rg_responsavel" },
        { key: "cpf_responsavel" },
        { key: "endereco", colSpan: "md:col-span-2" },
        { key: "contato_emergencia" },
      ],
    },
    {
      title: "Informações de Acolhimento",
      fields: [
        { key: "data_acolhimento" },
        { key: "acolhido_outra_instituicao", render: (value) => (value ? "Sim" : "Não") },
        { key: "tempo_acolhimento_anterior" },
      ],
    },
    {
      title: "Saúde e Convênio",
      fields: [
        { key: "possui_convenio", render: (value) => (value ? "Sim" : "Não") },
        { key: "nome_convenio" },
        { key: "tipo_sanguineo" },
        { key: "receituario_medico", colSpan: "md:col-span-2" },
        { key: "carteira_vacinacao", render: (value) => (value ? "Sim" : "Não") },
        { key: "situacao_vacinal" },
        { key: "vacina_covid_1" },
        { key: "vacina_covid_2" },
        { key: "vacina_covid_3" },
        { key: "vacina_covid_4" },
        { key: "alergias_medicamentosas", render: (value) => (value ? "Sim" : "Não") },
        { key: "quais_alergias", colSpan: "md:col-span-2" },
        { key: "tabagista", render: (value) => (value ? "Sim" : "Não") },
        { key: "etilista", render: (value) => (value ? "Sim" : "Não") },
        { key: "protese_dentaria", render: (value) => (value ? "Sim" : "Não") },
        { key: "utiliza_fraldas", render: (value) => (value ? "Sim" : "Não") },
      ],
    },
    {
      title: "Avaliação Cognitiva e Funcional",
      fields: [
        { key: "orientacao_tempo", render: (value) => (value ? "Sim" : "Não") },
        { key: "orientacao_espaco", render: (value) => (value ? "Sim" : "Não") },
        { key: "medicamentos_uso", colSpan: "md:col-span-2" },
        { key: "grau_dependencia" },
        { key: "banho" },
        { key: "vestir" },
        { key: "banheiro" },
        { key: "transferencia" },
        { key: "continencia" },
        { key: "alimentacao" },
        { key: "preferencias", colSpan: "md:col-span-2" },
        { key: "dificuldade_visual", render: (value) => (value ? "Sim" : "Não") },
        { key: "usa_oculos", render: (value) => (value ? "Sim" : "Não") },
        { key: "demencia", render: (value) => (value ? "Sim" : "Não") },
        { key: "tipo_demencia" },
        { key: "comunicacao_verbal", render: (value) => (value ? "Sim" : "Não") },
        { key: "dificuldade_fala", render: (value) => (value ? "Sim" : "Não") },
        { key: "dificuldade_auditiva", render: (value) => (value ? "Sim" : "Não") },
        { key: "protese_auditiva", render: (value) => (value ? "Sim" : "Não") },
      ],
    },
    {
      title: "Histórico Médico",
      fields: [
        { key: "avc", render: (value) => (value ? "Sim" : "Não") },
        { key: "tce", render: (value) => (value ? "Sim" : "Não") },
        { key: "hipertensao", render: (value) => (value ? "Sim" : "Não") },
        { key: "cardiopatias", render: (value) => (value ? "Sim" : "Não") },
        { key: "quais_cardiopatias", colSpan: "md:col-span-2" },
        { key: "hipotireoidismo", render: (value) => (value ? "Sim" : "Não") },
        { key: "colesterol_alto", render: (value) => (value ? "Sim" : "Não") },
        { key: "artrose", render: (value) => (value ? "Sim" : "Não") },
        { key: "diabetes", render: (value) => (value ? "Sim" : "Não") },
        { key: "tipo_diabetes" },
        { key: "historico_cancer", render: (value) => (value ? "Sim" : "Não") },
        { key: "tipo_cancer" },
        { key: "osteoporose", render: (value) => (value ? "Sim" : "Não") },
        { key: "fraturas", render: (value) => (value ? "Sim" : "Não") },
        { key: "onde_fraturas", colSpan: "md:col-span-2" },
        { key: "cirurgia", render: (value) => (value ? "Sim" : "Não") },
        { key: "onde_cirurgia", colSpan: "md:col-span-2" },
        { key: "depressao", render: (value) => (value ? "Sim" : "Não") },
        { key: "outros_antecedentes", colSpan: "md:col-span-2" },
      ],
    },
    {
      title: "Nutrição e Mobilidade",
      fields: [
        { key: "alimenta_sozinho", render: (value) => (value ? "Sim" : "Não") },
        { key: "tipo_alimentacao" },
        { key: "dificuldade_degluticao", render: (value) => (value ? "Sim" : "Não") },
        { key: "engasgos", render: (value) => (value ? "Sim" : "Não") },
        { key: "uso_sonda", render: (value) => (value ? "Sim" : "Não") },
        { key: "tipo_sonda" },
        { key: "alergia_alimento", render: (value) => (value ? "Sim" : "Não") },
        { key: "qual_alimento" },
        { key: "caminha_sozinho", render: (value) => (value ? "Sim" : "Não") },
        { key: "cadeirante", render: (value) => (value ? "Sim" : "Não") },
        { key: "tempo_cadeirante" },
        { key: "acamado", render: (value) => (value ? "Sim" : "Não") },
        { key: "tempo_acamado" },
        { key: "uso_aparelhos_locomocao", render: (value) => (value ? "Sim" : "Não") },
        { key: "quais_aparelhos", colSpan: "md:col-span-2" },
        { key: "risco_quedas", render: (value) => (value ? "Sim" : "Não") },
      ],
    },
    {
      title: "Comportamento",
      fields: [
        { key: "comunicativa", render: (value) => (value ? "Sim" : "Não") },
        { key: "agressiva", render: (value) => (value ? "Sim" : "Não") },
        { key: "humor_instavel" },
      ],
    },
    {
      title: "Outras Informações",
      fields: [
        {
          key: "observacoes", colSpan: "md:col-span-2", render: (value) => (
            <Textarea
              value={value || 'Nenhuma observação.'}
              readOnly
              className="mt-1 resize-none"
              rows={5}
            />
          )
        },
        { key: "date_joined", label: "Data de Cadastro", render: (value) => new Date(value).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) },
        { key: "updated", label: "Última Atualização", render: (value) => new Date(value).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) },
      ],
    },
  ];

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
              <div className="space-y-6">
                {displayConfig.map((section) => (
                  <div key={section.title} className="border p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => {
                        const value = pacienteToView[field.key];
                        const label = field.label || formatLabel(String(field.key));
                        const renderedValue = field.render
                          ? field.render(value, pacienteToView)
                          : renderValue(String(field.key), value);

                        return (
                          <div key={String(field.key)} className={field.colSpan || ''}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {label}:
                            </p>
                            <p className="text-lg font-semibold">
                              {renderedValue}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
              onSuccess={() => {
                fetchPacientes(pagination.currentPage);
                setOpenDrawer(false);
                setCurrentPaciente(null);
              }}
              defaultValues={currentPaciente || undefined}
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
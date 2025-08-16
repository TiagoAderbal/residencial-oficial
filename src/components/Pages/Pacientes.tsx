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
  deletePaciente
} from "@/lib/requests";
import { useAuthStore } from "@/store/authStore";
import { Paciente } from "@/types/Pacientes";
import { PacientesForm } from "@/components/forms/paciente-form";
import { Textarea } from "@/components/ui/textarea";


export const PacientesPage = () => {
  const { user } = useAuthStore();
  const [Pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentPaciente, setCurrentPaciente] = useState<Paciente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [PacienteToDelete, setPacienteToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [PacienteToView, setPacienteToView] = useState<Paciente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchPacientes = async (page = 1) => {
    try {
      setIsLoading(true);
      const { data: response } = await getPacientes();
      setPacientes(response?.results || []);
      const totalCount = response?.count || 0;

      setPagination({
        count: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / 10), // 10 itens por página
      });
    } catch (error) {
      toast.error("Erro ao carregar Pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Pacientes
  useEffect(() => {
    fetchPacientes(1);
  }, []);

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageNumbers = [];

    // Sempre mostra até 5 números de página
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostra páginas próximas à atual
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
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

  const handleSubmit = async (values: Omit<Paciente, 'id'>) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const data = {
        ...values,
        id_user: user.id,
      };

      if (currentPaciente) {
        try {
          const { data: response } = await updatePaciente(currentPaciente.id, data);
          if (response) {
            setPacientes(prev =>
              prev.map(p => (p.id === currentPaciente.id ? { ...p, ...response } : p))
            );
            toast.success("Paciente atualizado com sucesso!");
          }
        } catch (error: any) {
          toast.error(`Erro ao atualizar Paciente: ${error?.message || error}`);
          console.error(error);
        }
      } else {
        try {
          const { data: response } = await createPaciente(data);
          if (response) {
            setPacientes(prev => [...prev, response]);
            toast.success("Paciente cadastrado com sucesso!");
          }
        } catch (error: any) {
          toast.error(`Erro ao cadastrar Paciente: ${error?.message || error}`);
          console.error(error);
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentPaciente ? "atualizar" : "cadastrar"} Paciente`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (paciente: Paciente) => {
    setPacienteToView(paciente);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!PacienteToDelete) return;

    try {
      await deletePaciente(PacienteToDelete);
      setPacientes(prev => prev.filter(p => p.id !== PacienteToDelete));
      toast.success("Paciente excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir Paciente");
    }
  };

  // Função utilitária para calcular idade
  function calcularIdade(dataNascimento: string) {
    if (!dataNascimento) return "";
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const filteredPacientes = Pacientes.filter(paciente =>
    paciente.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pacientes</CardTitle>
              <CardDescription>
                Gerencie seus Pacientes
              </CardDescription>
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
                  <div key={paciente.id} className="grid grid-cols-6 p-4 border-t items-center text-sm">
                    <div className="truncate-cell">{paciente.nome_completo}</div>
                    <div className="truncate-cell">{new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</div>
                    <div className="truncate-cell">{calcularIdade(paciente.data_nascimento)}</div>
                    <div className="truncate-cell">{paciente.cpf}</div>
                    <div className="truncate-cell">{paciente.telefone_responsavel}</div>
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
                          }
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação simplificada */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Total: {pagination.count} pacientes • Página {pagination.currentPage} de {pagination.totalPages}
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

                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
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
                        variant={pageNum === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchPacientes(Number(pageNum))}
                      >
                        {pageNum}
                      </Button>
                    )
                  ))}

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
            {PacienteToView && (
              <div className="space-y-4">
                {/* Seção 1: Dados Pessoais */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Lançado por</label>
                  <Input value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim()} readOnly />
                </div>
                <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Avaliação</label>
                    <Input value={new Date(PacienteToView.data_avaliacao).toLocaleDateString('pt-BR')} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <Input value={PacienteToView.nome_completo} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                    <Input value={new Date(PacienteToView.data_nascimento).toLocaleDateString('pt-BR')} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Idade</label>
                    <Input value={PacienteToView.idade} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Naturalidade</label>
                    <Input value={PacienteToView.naturalidade} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado Civil</label>
                    <Input value={PacienteToView.estado_civil} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CPF</label>
                    <Input value={PacienteToView.cpf} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">RG</label>
                    <Input value={PacienteToView.rg} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Órgão Expedidor</label>
                    <Input value={PacienteToView.orgao_expedidor} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Pai</label>
                    <Input value={PacienteToView.nome_pai} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Mãe</label>
                    <Input value={PacienteToView.nome_mae} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Religião</label>
                    <Input value={PacienteToView.religiao} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Praticante</label>
                    <Input value={PacienteToView.praticante ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profissão</label>
                    <Input value={PacienteToView.profissao} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Escolaridade</label>
                    <Input value={PacienteToView.escolaridade} readOnly />
                  </div>
                </div>

                {/* Seção 2: Dados de Acolhimento */}
                <h3 className="text-lg font-semibold mt-6">Dados de Acolhimento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Acolhimento</label>
                    <Input value={new Date(PacienteToView.data_acolhimento).toLocaleDateString('pt-BR')} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Responsável</label>
                    <Input value={PacienteToView.responsavel} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone Responsável</label>
                    <Input value={PacienteToView.telefone_responsavel} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Endereço</label>
                    <Input value={PacienteToView.endereco} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contato de Emergência</label>
                    <Input value={PacienteToView.contato_emergencia} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Acolhido em Outra Instituição</label>
                    <Input value={PacienteToView.acolhido_outra_instituicao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.acolhido_outra_instituicao && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tempo de Acolhimento Anterior</label>
                      <Input value={PacienteToView.tempo_acolhimento_anterior} readOnly />
                    </div>
                  )}
                </div>

                {/* Seção 3: Dados do Responsável */}
                <h3 className="text-lg font-semibold mt-6">Dados do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CPF do Responsável</label>
                    <Input value={PacienteToView.cpf_responsavel} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">RG do Responsável</label>
                    <Input value={PacienteToView.rg_responsavel} readOnly />
                  </div>
                </div>

                {/* Seção 4: Informações de Saúde */}
                <h3 className="text-lg font-semibold mt-6">Informações de Saúde</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo Sanguíneo</label>
                    <Input value={PacienteToView.tipo_sanguineo} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Possui Convênio</label>
                    <Input value={PacienteToView.possui_convenio ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.possui_convenio && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome do Convênio</label>
                      <Input value={PacienteToView.nome_convenio} readOnly />
                    </div>
                  )}
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium mb-1">Medicamentos em Uso</label>
                    <Textarea value={PacienteToView.medicamentos_uso} readOnly rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alergias Medicamentosas</label>
                    <Input value={PacienteToView.alergias_medicamentosas ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.alergias_medicamentosas && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Quais Alergias</label>
                      <Input value={PacienteToView.quais_alergias} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Diabetes</label>
                    <Input value={PacienteToView.diabetes ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.diabetes && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Diabetes</label>
                      <Input value={PacienteToView.tipo_diabetes} readOnly />
                    </div>
                  )}
                </div>

                {/* Seção 5: Vacinação e Saúde */}
                <h3 className="text-lg font-semibold mt-6">Vacinação e Saúde</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Receituário Médico</label>
                    <Input value={PacienteToView.receituario_medico} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Carteira de Vacinação</label>
                    <Input value={PacienteToView.carteira_vacinacao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Situação Vacinal</label>
                    <Input value={PacienteToView.situacao_vacinal} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">1ª Dose COVID</label>
                    <Input value={PacienteToView.vacina_covid_1 ? new Date(PacienteToView.vacina_covid_1).toLocaleDateString('pt-BR') : 'Não informado'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">2ª Dose COVID</label>
                    <Input value={PacienteToView.vacina_covid_2 ? new Date(PacienteToView.vacina_covid_2).toLocaleDateString('pt-BR') : 'Não informado'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">3ª Dose COVID</label>
                    <Input value={PacienteToView.vacina_covid_3 ? new Date(PacienteToView.vacina_covid_3).toLocaleDateString('pt-BR') : 'Não informado'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">4ª Dose COVID</label>
                    <Input value={PacienteToView.vacina_covid_4 ? new Date(PacienteToView.vacina_covid_4).toLocaleDateString('pt-BR') : 'Não informado'} readOnly />
                  </div>
                </div>

                {/* Seção 6: Mobilidade e Atividades */}
                <h3 className="text-lg font-semibold mt-6">Mobilidade e Atividades</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Grau de Dependência</label>
                    <Input value={PacienteToView.grau_dependencia} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cadeirante</label>
                    <Input value={PacienteToView.cadeirante ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.cadeirante && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tempo como Cadeirante</label>
                      <Input value={PacienteToView.tempo_cadeirante} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Usa Aparelhos de Locomoção</label>
                    <Input value={PacienteToView.uso_aparelhos_locomocao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.uso_aparelhos_locomocao && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Quais Aparelhos</label>
                      <Input value={PacienteToView.quais_aparelhos} readOnly />
                    </div>
                  )}
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium mb-1">Preferências e Interesses</label>
                    <Textarea value={PacienteToView.preferencias} readOnly rows={3} />
                  </div>
                </div>

                {/* Seção 7: Hábitos e Condições */}
                <h3 className="text-lg font-semibold mt-6">Hábitos e Condições</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tabagista</label>
                    <Input value={PacienteToView.tabagista ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Etilista</label>
                    <Input value={PacienteToView.etilista ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prótese Dentária</label>
                    <Input value={PacienteToView.protese_dentaria ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Utiliza Fraldas</label>
                    <Input value={PacienteToView.utiliza_fraldas ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Orientação no Tempo</label>
                    <Input value={PacienteToView.orientacao_tempo ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Orientação no Espaço</label>
                    <Input value={PacienteToView.orientacao_espaco ? 'Sim' : 'Não'} readOnly />
                  </div>
                </div>

                {/* Seção 8: Atividades da Vida Diária (AVDs) */}
                <h3 className="text-lg font-semibold mt-6">Atividades da Vida Diária</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Banho</label>
                    <Input value={PacienteToView.banho} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vestir</label>
                    <Input value={PacienteToView.vestir} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Banheiro</label>
                    <Input value={PacienteToView.banheiro} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transferência</label>
                    <Input value={PacienteToView.transferencia} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Continência</label>
                    <Input value={PacienteToView.continencia} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alimentação</label>
                    <Input value={PacienteToView.alimentacao} readOnly />
                  </div>
                </div>

                {/* Seção 9: Condições Clínicas e Funcionais */}
                <h3 className="text-lg font-semibold mt-6">Condições Clínicas e Funcionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Dificuldade Visual</label>
                    <Input value={PacienteToView.dificuldade_visual ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Usa Óculos</label>
                    <Input value={PacienteToView.usa_oculos ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Demência</label>
                    <Input value={PacienteToView.demencia ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.demencia && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Demência</label>
                      <Input value={PacienteToView.tipo_demencia} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Comunicação Verbal</label>
                    <Input value={PacienteToView.comunicacao_verbal ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dificuldade de Fala</label>
                    <Input value={PacienteToView.dificuldade_fala ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dificuldade Auditiva</label>
                    <Input value={PacienteToView.dificuldade_auditiva ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prótese Auditiva</label>
                    <Input value={PacienteToView.protese_auditiva ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">AVC</label>
                    <Input value={PacienteToView.avc ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">TCE</label>
                    <Input value={PacienteToView.tce ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hipertensão</label>
                    <Input value={PacienteToView.hipertensao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardiopatias</label>
                    <Input value={PacienteToView.cardiopatias ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.cardiopatias && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Quais Cardiopatias</label>
                      <Input value={PacienteToView.quais_cardiopatias} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Hipotireoidismo</label>
                    <Input value={PacienteToView.hipotireoidismo ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Colesterol Alto</label>
                    <Input value={PacienteToView.colesterol_alto ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Artrose</label>
                    <Input value={PacienteToView.artrose ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Histórico de Câncer</label>
                    <Input value={PacienteToView.historico_cancer ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.historico_cancer && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Câncer</label>
                      <Input value={PacienteToView.tipo_cancer} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Osteoporose</label>
                    <Input value={PacienteToView.osteoporose ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fraturas</label>
                    <Input value={PacienteToView.fraturas ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.fraturas && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Onde Fraturas</label>
                      <Input value={PacienteToView.onde_fraturas} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Cirurgia</label>
                    <Input value={PacienteToView.cirurgia ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.cirurgia && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Onde Cirurgia</label>
                      <Input value={PacienteToView.onde_cirurgia} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Depressão</label>
                    <Input value={PacienteToView.depressao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Outros Antecedentes</label>
                    <Input value={PacienteToView.outros_antecedentes} readOnly />
                  </div>
                </div>

                {/* Seção 10: Alimentação */}
                <h3 className="text-lg font-semibold mt-6">Alimentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Alimenta-se Sozinho</label>
                    <Input value={PacienteToView.alimenta_sozinho ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Alimentação</label>
                    <Input value={PacienteToView.tipo_alimentacao} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dificuldade de Deglutição</label>
                    <Input value={PacienteToView.dificuldade_degluticao ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Engasgos</label>
                    <Input value={PacienteToView.engasgos ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Uso de Sonda</label>
                    <Input value={PacienteToView.uso_sonda ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.uso_sonda && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Sonda</label>
                      <Input value={PacienteToView.tipo_sonda} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Alergia Alimentar</label>
                    <Input value={PacienteToView.alergia_alimento ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.alergia_alimento && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Qual Alimento</label>
                      <Input value={PacienteToView.qual_alimento} readOnly />
                    </div>
                  )}
                </div>

                {/* Seção 11: Mobilidade */}
                <h3 className="text-lg font-semibold mt-6">Mobilidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Caminha Sozinho</label>
                    <Input value={PacienteToView.caminha_sozinho ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Acamado</label>
                    <Input value={PacienteToView.acamado ? 'Sim' : 'Não'} readOnly />
                  </div>
                  {PacienteToView.acamado && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tempo Acamado</label>
                      <Input value={PacienteToView.tempo_acamado} readOnly />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Risco de Quedas</label>
                    <Input value={PacienteToView.risco_quedas ? 'Sim' : 'Não'} readOnly />
                  </div>
                </div>

                {/* Seção 12: Comportamento */}
                <h3 className="text-lg font-semibold mt-6">Comportamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Comunicativa</label>
                    <Input value={PacienteToView.comunicativa ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Agressiva</label>
                    <Input value={PacienteToView.agressiva ? 'Sim' : 'Não'} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Humor Instável</label>
                    <Input value={PacienteToView.humor_instavel} readOnly />
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
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
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
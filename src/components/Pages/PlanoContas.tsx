"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import {
  getPlanoDeContas,
  createPlanoConta,
  updatePlanoConta,
  deletePlanoConta
} from "@/lib/requests";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlanoContaForm } from "@/components/forms/plano-contas-form";
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

type PlanoConta = {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'a' | 's';
  father: number | null;
  subMenus?: PlanoConta[];
};

export const PlanoDeContasPage = () => {
  const [planosConta, setPlanosConta] = useState<PlanoConta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentPlanoConta, setCurrentPlanoConta] = useState<PlanoConta | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [planoContaToDelete, setPlanoContaToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [planoContaToView, setPlanoContaToView] = useState<PlanoConta | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);

  // Fetch planos de conta
  useEffect(() => {
    const fetchPlanosConta = async () => {
      try {
        const { data: response } = await getPlanoDeContas();
        setPlanosConta(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar planos de conta");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanosConta();
  }, []);

  const handleOpenCreate = () => {
    setCurrentPlanoConta(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (planoConta: PlanoConta) => {
    setCurrentPlanoConta(planoConta);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Garante que o código está no formato correto
      const formattedValues = {
        ...values,
        father: values.father ? Number(values.father) : null
      };

      if (currentPlanoConta) {
        const response = await updatePlanoConta(currentPlanoConta.id, formattedValues);
        if (response.data) {
          setPlanosConta(planosConta.map(p =>
            p.id === currentPlanoConta.id ? { ...p, ...response.data } : p
          ));
          toast.success("Plano de conta atualizado com sucesso!");
        }
      } else {
        const { data: response } = await createPlanoConta(formattedValues);
        if (response) {
          setPlanosConta([...planosConta, response]);
          toast.success("Plano de conta cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentPlanoConta ? "atualizar" : "cadastrar"} plano de conta`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (planoConta: PlanoConta) => {
    setPlanoContaToView(planoConta);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!planoContaToDelete) return;

    try {
      await deletePlanoConta(planoContaToDelete);
      setPlanosConta(planosConta.filter(p => p.id !== planoContaToDelete));
      toast.success("Plano de conta excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir plano de conta");
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const formatCode = (code: string) => {
    if (!code) return '';

    // Se já estiver no formato correto, retorna como está
    if (code.match(/^\d\.\d{2}\.\d{2}$/)) return code;

    // Remove todos os pontos existentes para evitar duplicação
    const cleanCode = code.replace(/\./g, '');

    // Completa com zeros à direita se necessário
    const paddedCode = cleanCode.padEnd(5, '0').slice(0, 5);

    // Insere os pontos nas posições corretas
    return `${paddedCode.charAt(0)}.${paddedCode.slice(1, 3)}.${paddedCode.slice(3, 5)}`;
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Plano de Contas</CardTitle>
              <CardDescription>
                Gerencie seu plano de contas contábil
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
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
                <div>Código</div>
                <div>Nome da Conta</div>
                <div>Descrição</div>
                <div>Tipo</div>
                <div className="text-left">Ações</div>
              </div>
              {planosConta.map((conta) => (
                <div key={conta.id} className="space-y-0">
                  <div className={`grid grid-cols-5 p-4 border-t items-center text-sm ${conta.type === 's' ? 'bg-slate-100 dark:bg-slate-800 font-medium' : ''}`}>
                    <div className="flex items-center">
                      {formatCode(conta.code)}
                    </div>
                    <div>{conta.name}</div>
                    <div>{conta.description}</div>
                    <div>{conta.type === 's' ? 'Sintética' : 'Analítica'}</div>
                    <div className="flex gap-2 justify-start">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenView(conta)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEdit(conta)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setPlanoContaToDelete(conta.id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {conta.subMenus && conta.subMenus.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleExpand(conta.id)}
                        >
                          {expanded.includes(conta.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {expanded.includes(conta.id) && conta.subMenus && conta.subMenus.map((subConta) => (
                    <div key={subConta.id} className="grid grid-cols-5 p-4 border-t items-center text-sm pl-8">
                      <div className="flex items-center">
                        {formatCode(subConta.code)}
                      </div>
                      <div>{subConta.name}</div>
                      <div>{subConta.description}</div>
                      <div>{subConta.type === 's' ? 'Sintética' : 'Analítica'}</div>
                      <div className="flex gap-2 justify-start">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenView(subConta)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(subConta)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setPlanoContaToDelete(subConta.id);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
            <DrawerTitle>Visualizar Conta</DrawerTitle>
            <DrawerDescription>
              Detalhes completos da conta contábil
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {planoContaToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Código</label>
                    <Input value={formatCode(planoContaToView.code)} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={planoContaToView.name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input value={planoContaToView.description} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <Input
                      value={planoContaToView.type === 's' ? 'Sintética' : 'Analítica'}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Conta Pai</label>
                    <Input
                      value={planoContaToView.father ?
                        planosConta.find(p => p.id === planoContaToView.father)?.name || 'N/A' :
                        'Nenhuma'}
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
              {currentPlanoConta ? "Editar Conta" : "Nova Conta"}
            </DrawerTitle>
            <DrawerDescription>
              {currentPlanoConta
                ? "Atualize as informações da conta"
                : "Preencha os campos para cadastrar uma nova conta"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <PlanoContaForm
              onSubmit={handleSubmit}
              defaultValues={currentPlanoConta || undefined}
              loading={isSubmitting}
              onCancel={() => setOpenDrawer(false)}
              planosConta={planosConta}
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
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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
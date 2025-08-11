"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  getFornecedores,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor
} from "@/lib/requests";
import { estadosBrasileiros } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FornecedorForm } from "@/components/forms/fornecedor-form";
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

type Fornecedor = {
  id: number;
  name: string;
  taxId: string;
  description: string;
  address: string;
  number: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  mobile: string;
};

export const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentFornecedor, setCurrentFornecedor] = useState<Fornecedor | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fornecedorToDelete, setFornecedorToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [fornecedorToView, setFornecedorToView] = useState<Fornecedor | null>(null);

  // Fetch fornecedores
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const { data: response } = await getFornecedores();
        setFornecedores(response?.results || []);
      } catch (error) {
        toast.error("Erro ao carregar fornecedores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  // Fetch países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const data = await response.json();
        setCountries(
          data.map((country: any) => ({
            code: country.cca2,
            name: country.name.common,
          }))
        );
      } catch (error) {
        toast.error("Erro ao carregar países");
      }
    };

    fetchCountries();
  }, []);

  const handleOpenCreate = () => {
    setCurrentFornecedor(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (fornecedor: Fornecedor) => {
    setCurrentFornecedor(fornecedor);
    setOpenDrawer(true);
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (currentFornecedor) {
        // Edição
        const response = await updateFornecedor(currentFornecedor.id, values);
        if (response.data) {
          setFornecedores(fornecedores.map(f =>
            f.id === currentFornecedor.id ? { ...f, ...response.data } : f
          ));
          toast.success("Fornecedor atualizado com sucesso!");
        }
      } else {
        // Criação
        const { data: response } = await createFornecedor(values);
        if (response) {
          setFornecedores([...fornecedores, response]);
          toast.success("Fornecedor cadastrado com sucesso!");
        }
      }
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`Erro ao ${currentFornecedor ? "atualizar" : "cadastrar"} fornecedor`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenView = (fornecedor: Fornecedor) => {
    setFornecedorToView(fornecedor);
    setOpenViewDrawer(true);
  };

  const handleDelete = async () => {
    if (!fornecedorToDelete) return;

    try {
      await deleteFornecedor(fornecedorToDelete);
      setFornecedores(fornecedores.filter(f => f.id !== fornecedorToDelete));
      toast.success("Fornecedor excluído com sucesso!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Erro ao excluir fornecedor");
    }
  };

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fornecedores</CardTitle>
              <CardDescription>
                Gerencie seus fornecedores cadastrados
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
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
              <div className="grid grid-cols-10 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200">
                <div>Nome</div>
                <div>Documento</div>
                <div>Descrição</div>
                <div>Endereço</div>
                <div>Cidade/UF</div>
                <div>País</div>
                <div>Telefone</div>
                <div>Celular</div>
                <div>Identificador</div>
                <div>Ações</div>
              </div>
              {fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="grid grid-cols-10 p-4 border-t items-center text-sm">
                  <div className="truncate-cell">{fornecedor.name}</div>
                  <div className="truncate-cell">{fornecedor.taxId}</div>
                  <div className="truncate-cell">{fornecedor.description}</div>
                  <div className="truncate-cell">{`${fornecedor.address} - ${fornecedor.number}`}</div>
                  <div className="truncate-cell">{`${fornecedor.city}/${fornecedor.state}`}</div>
                  <div className="truncate-cell">{fornecedor.country}</div>
                  <div className="truncate-cell">{fornecedor.phone}</div>
                  <div className="truncate-cell">{fornecedor.mobile}</div>
                  <div className="truncate-cell">{fornecedor.id}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenView(fornecedor)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(fornecedor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setFornecedorToDelete(fornecedor.id);
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

      {/* Drawer para visuzliacao */}
      <Drawer open={openViewDrawer} onOpenChange={setOpenViewDrawer}>
        <DrawerContent className="max-h-[90vh] p-8">
          <DrawerHeader>
            <DrawerTitle>Visualizar Fornecedor</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do fornecedor
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {fornecedorToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={fornecedorToView.name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Documento</label>
                    <Input value={fornecedorToView.taxId} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input value={fornecedorToView.description} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Endereço</label>
                    <Input value={fornecedorToView.address} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número</label>
                    <Input value={fornecedorToView.number} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <Input value={fornecedorToView.city} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <Input value={fornecedorToView.state} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">País</label>
                    <Input value={fornecedorToView.country} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <Input value={fornecedorToView.phone} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Celular</label>
                    <Input value={fornecedorToView.mobile} readOnly />
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
              {currentFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
            </DrawerTitle>
            <DrawerDescription>
              {currentFornecedor
                ? "Atualize as informações do fornecedor"
                : "Preencha os campos para cadastrar um novo fornecedor"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <FornecedorForm
              onSubmit={handleSubmit}
              defaultValues={currentFornecedor || undefined}
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
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
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
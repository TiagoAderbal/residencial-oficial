"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Save } from "lucide-react";
import { estadosBrasileiros } from "@/lib/constants";
import {
  getFornecedores,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor
} from "@/lib/requests";
import { MaskedInput } from "@/components/ui/masked-input";

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
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Fornecedor>>({});
  const [documentMask, setDocumentMask] = useState("999.999.999-99");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    taxId: "",
    description: "",
    address: "",
    number: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    mobile: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "taxId") {
      const numericValue = value.replace(/\D/g, "");
      setDocumentMask(
        numericValue.slice(9, 11) === "00"
          ? "99.999.999/9999-99"
          : "999.999.999-99"
      );
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    if (editingId === fornecedor.id) {
      handleSave(fornecedor.id);
    } else {
      setEditingId(fornecedor.id);
      setEditForm(fornecedor);
    }
  };

  const handleSave = async (id: number) => {
    try {
      const response = await updateFornecedor(id, editForm);
      if (response.data) {
        setFornecedores(fornecedores.map(f =>
          f.id === id ? { ...f, ...response.data } : f
        ));
        toast.success("Fornecedor atualizado com sucesso!");
        setEditingId(null);
      }
    } catch (error) {
      toast.error("Erro ao atualizar fornecedor");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: response } = await createFornecedor(form);
      if (response) {
        setFornecedores([...fornecedores, response]);
      }
      toast.success("Fornecedor cadastrado com sucesso!");
      setIsCreating(false);
      setForm({
        name: "",
        taxId: "",
        description: "",
        address: "",
        number: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        mobile: "",
      });
    } catch (error) {
      toast.error("Erro ao cadastrar fornecedor");
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        await deleteFornecedor(id);
        setFornecedores(fornecedores.filter(f => f.id !== id));
        toast.success("Fornecedor excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir fornecedor");
      }
    }
  }

  return (
    <main className="h-app p-6 overflow-auto">
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fornecedores</CardTitle>
            </div>
            <Button onClick={() => setIsCreating(!isCreating)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nome
                      </label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Documento
                      </label>
                      <Input
                        name="taxId"
                        value={form.taxId}
                        onChange={handleInputChange}
                        required
                        placeholder={documentMask === "999.999.999-99" ? "000.000.000-00" : "00.000.000/0000-00"}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Descrição
                      </label>
                      <Input
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Endereço
                      </label>
                      <Input
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Número
                      </label>
                      <Input
                        name="number"
                        value={form.number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Cidade
                      </label>
                      <Input
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Estado
                      </label>
                      <select
                        className="w-full p-2 border rounded"
                        name="state"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                      >
                        <option value="">Selecione</option>
                        {estadosBrasileiros.map((estado) => (
                          <option key={estado.sigla} value={estado.sigla}>
                            {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        País
                      </label>
                      <select
                        className="w-full p-2 border rounded"
                        name="country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      >
                        <option value="">Selecione</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Telefone
                      </label>
                      <Input
                        name="phone"
                        value={form.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Celular
                      </label>
                      <Input
                        name="mobile"
                        value={form.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Cadastrar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-10 bg-slate-100 dark:bg-slate-800 p-4 font-medium text-slate-800 dark:text-slate-200">
                <div>ID</div>
                <div>Nome</div>
                <div>Documento</div>
                <div>Descrição</div>
                <div>Endereço</div>
                <div>Cidade/UF</div>
                <div>País</div>
                <div>Telefone</div>
                <div>Celular</div>
                <div>Ações</div>
              </div>
              {fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="grid grid-cols-10 p-4 border-t items-center text-sm">
                  <div>{fornecedor.id}</div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <Input
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      fornecedor.name
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <Input
                        name="taxId"
                        value={editForm.taxId || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      fornecedor.taxId
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <Input
                        name="description"
                        value={editForm.description || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      fornecedor.description
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <div className="flex gap-2">
                        <Input
                          name="address"
                          value={editForm.address || ""}
                          onChange={handleEditChange}
                          className="flex-1"
                        />
                        <Input
                          name="number"
                          value={editForm.number || ""}
                          onChange={handleEditChange}
                          className="w-20"
                        />
                      </div>
                    ) : (
                      `${fornecedor.address} - ${fornecedor.number}`
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <div className="flex gap-2">
                        <Input
                          name="city"
                          value={editForm.city || ""}
                          onChange={handleEditChange}
                          className="flex-1"
                        />
                        <select
                          className="w-24 p-2 border rounded"
                          name="state"
                          value={editForm.state || ""}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        >
                          <option value="">UF</option>
                          {estadosBrasileiros.map((estado) => (
                            <option key={estado.sigla} value={estado.sigla}>
                              {estado.sigla}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      `${fornecedor.city}/${fornecedor.state}`
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        name="country"
                        value={editForm.country || ""}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      >
                        <option value="">País</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      fornecedor.country
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <Input
                        name="phone"
                        value={editForm.phone || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      fornecedor.phone
                    )}
                  </div>
                  <div>
                    {editingId === fornecedor.id ? (
                      <Input
                        name="mobile"
                        value={editForm.mobile || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                      fornecedor.mobile
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(fornecedor)}
                    >
                      {editingId === fornecedor.id ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(fornecedor.id)}
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
    </main>
  );
};
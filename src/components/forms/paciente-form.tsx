"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pacienteSchema, PacienteFormValues } from "@/lib/schemas/pacienteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";

// Função utilitária para calcular idade (agora sempre retorna número)
function calcularIdade(dataNascimento: string): number {
  if (!dataNascimento) return 0;
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export const PacientesForm = ({
  onSubmit,
  defaultValues,
  loading,
  onCancel,
}: {
  onSubmit: (values: PacienteFormValues) => void;
  defaultValues?: Partial<PacienteFormValues>;
  loading?: boolean;
  onCancel: () => void;
}) => {
  const { user } = useAuthStore();

  // Valores padrão completos
  const defaultFormValues: Partial<PacienteFormValues> = {
    id_user: user?.id || 0,
    data_avaliacao: new Date().toISOString().split('T')[0],
    nome_completo: "",
    data_nascimento: "",
    idade: 0,
    naturalidade: "",
    religiao: "",
    praticante: false,
    profissao: "",
    escolaridade: "",
    estado_civil: "",
    cpf: "",
    rg: "",
    orgao_expedidor: "",
    nome_pai: "",
    nome_mae: "",
    data_acolhimento: new Date().toISOString().split('T')[0],
    responsavel: "",
    telefone_responsavel: "",
    rg_responsavel: "",
    cpf_responsavel: "",
    endereco: "",
    contato_emergencia: "",
    acolhido_outra_instituicao: false,
    tempo_acolhimento_anterior: "",
    possui_convenio: false,
    nome_convenio: "",
    tipo_sanguineo: "",
    receituario_medico: "",
    carteira_vacinacao: false,
    situacao_vacinal: "",
    alergias_medicamentosas: false,
    tabagista: false,
    etilista: false,
    protese_dentaria: false,
    utiliza_fraldas: false,
    orientacao_tempo: true,
    orientacao_espaco: true,
    grau_dependencia: null,
    dificuldade_visual: false,
    usa_oculos: false,
    demencia: false,
    comunicacao_verbal: true,
    dificuldade_fala: false,
    dificuldade_auditiva: false,
    protese_auditiva: false,
    avc: false,
    tce: false,
    hipertensao: false,
    cardiopatias: false,
    hipotireoidismo: false,
    colesterol_alto: false,
    artrose: false,
    diabetes: false,
    historico_cancer: false,
    osteoporose: false,
    fraturas: false,
    cirurgia: false,
    depressao: false,
    outros_antecedentes: "",
    alimenta_sozinho: true,
    dificuldade_degluticao: false,
    engasgos: false,
    uso_sonda: false,
    alergia_alimento: false,
    caminha_sozinho: true,
    cadeirante: false,
    acamado: false,
    uso_aparelhos_locomocao: false,
    risco_quedas: false,
    comunicativa: true,
    agressiva: false,
  };

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      ...defaultFormValues,
      ...(defaultValues || {}), // Sobrescreve com os defaultValues se fornecidos
    },
  });

  // Campos com máscara dinâmica
  const cpfValue = form.watch("cpf");
  const telefoneValue = form.watch("telefone_responsavel");
  const dataNascimento = form.watch("data_nascimento");
  const formValues = form.watch();

  // Atualiza idade quando data_nascimento muda
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "data_nascimento") {
        const idade = calcularIdade(value.data_nascimento || "");
        form.setValue("idade", idade, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Garante que id_user está sempre atualizado
  useEffect(() => {
    if (user?.id) {
      form.setValue('id_user', user.id);
    }
  }, [user?.id, form]);

  const handleSubmit = (values: PacienteFormValues) => {
    // Filtra campos vazios (exceto booleanos, números e null)
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (typeof value === "boolean" || typeof value === "number" || value === null) {
          return true;
        }
        return value !== "" && value !== undefined;
      })
    ) as PacienteFormValues;

    onSubmit(filteredValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => {
        console.log(values); // Veja os dados do formulário aqui
        onSubmit(values);
      })} className="space-y-8">
        {/* Bloco para depuração dos valores do formulário */}
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(formValues, null, 2)}</code>
        </pre>
        {/* Seção 1: Dados Pessoais */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="data_avaliacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Avaliação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly tabIndex={-1} value={field.value || 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naturalidade</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado_civil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Civil</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteira">Solteiro(a)</SelectItem>
                        <SelectItem value="casada">Casado(a)</SelectItem>
                        <SelectItem value="divorciada">Divorciado(a)</SelectItem>
                        <SelectItem value="viúva">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                          .replace(/(-\d{2})\d+?$/, '$1'));
                      }}
                      placeholder="000.000.000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orgao_expedidor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Expedidor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_pai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pai</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_mae"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Mãe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos adicionais em Dados Pessoais */}
            <FormField
              control={form.control}
              name="religiao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religião</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="praticante"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Praticante?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="escolaridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção 2: Dados de Acolhimento */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Dados de Acolhimento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="data_acolhimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Acolhimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone Responsável</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const cleaned = value.replace(/\D/g, '');

                        if (cleaned.length <= 10) {
                          field.onChange(value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '($1) $2')
                            .replace(/(\d{4})(\d)/, '$1-$2')
                            .replace(/(-\d{4})\d+?$/, '$1'));
                        } else {
                          field.onChange(value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '($1) $2')
                            .replace(/(\d{5})(\d)/, '$1-$2')
                            .replace(/(-\d{4})\d+?$/, '$1'));
                        }
                      }}
                      placeholder="(00) 00000-0000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato_emergencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato de Emergência</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acolhido_outra_instituicao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Acolhido em outra instituição?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("acolhido_outra_instituicao") && (
                <FormField
                  control={form.control}
                  name="tempo_acolhimento_anterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Acolhimento Anterior</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* --- DADOS DO RESPONSÁVEL --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Dados do Responsável</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cpf_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Responsável</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value
                          .replace(/\D/g, '')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                          .replace(/(-\d{2})\d+?$/, '$1'));
                      }}
                      placeholder="000.000.000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rg_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG do Responsável</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção 3: Saúde */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Informações de Saúde</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="tipo_sanguineo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Sanguíneo</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="possui_convenio"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Possui convênio médico?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("possui_convenio") && (
                <FormField
                  control={form.control}
                  name="nome_convenio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Convênio</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="medicamentos_uso"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-3">
                  <FormLabel>Medicamentos em Uso</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="alergias_medicamentosas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Alergias medicamentosas?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("alergias_medicamentosas") && (
                  <FormField
                    control={form.control}
                    name="quais_alergias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais alergias?</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="diabetes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Diabetes?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("diabetes") && (
                  <FormField
                    control={form.control}
                    name="tipo_diabetes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Diabetes</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tipo 1">Tipo 1</SelectItem>
                              <SelectItem value="Tipo 2">Tipo 2</SelectItem>
                              <SelectItem value="Gestacional">Gestacional</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- VACINAÇÃO E SAÚDE --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Vacinação e Saúde</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="receituario_medico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receituário Médico</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="parcial">Parcial</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carteira_vacinacao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Carteira de Vacinação</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="situacao_vacinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situação Vacinal</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="em_dia">Em Dia</SelectItem>
                        <SelectItem value="programada">Programada</SelectItem>
                        <SelectItem value="em_atraso">Em Atraso</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vacina_covid_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1ª Dose COVID</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vacina_covid_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2ª Dose COVID</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vacina_covid_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3ª Dose COVID</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vacina_covid_4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4ª Dose COVID</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção 4: Mobilidade e Atividades */}
        <div className="p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Mobilidade e Atividades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="grau_dependencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grau de Dependência</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "null" ? null : Number(value))
                      }
                      value={field.value === null ? "null" : field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Nenhuma dependência</SelectItem>
                        <SelectItem value="1">Leve dependência</SelectItem>
                        <SelectItem value="2">Moderada dependência</SelectItem>
                        <SelectItem value="3">Alta dependência</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cadeirante"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cadeirante?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("cadeirante") && (
                  <FormField
                    control={form.control}
                    name="tempo_cadeirante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo como cadeirante</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="uso_aparelhos_locomocao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Usa aparelhos de locomoção?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("uso_aparelhos_locomocao") && (
                  <FormField
                    control={form.control}
                    name="quais_aparelhos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais aparelhos?</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="preferencias"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-3">
                  <FormLabel>Preferências e Interesses</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- HÁBITOS E CONDIÇÕES --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hábitos e Condições</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="tabagista"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tabagista</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="etilista"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Etilista</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protese_dentaria"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Prótese Dentária</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="utiliza_fraldas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Utiliza Fraldas</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientacao_tempo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Orientação no Tempo</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientacao_espaco"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Orientação no Espaço</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- ATIVIDADES DA VIDA DIÁRIA (AVDs) --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Atividades da Vida Diária</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="banho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banho</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vestir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vestir</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banheiro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banheiro</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transferencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transferência</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="continencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Continência</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alimentacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alimentação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                        <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                        <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- CONDIÇÕES CLÍNICAS E FUNCIONAIS --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Condições Clínicas e Funcionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dificuldade_visual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dificuldade Visual</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usa_oculos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Usa Óculos</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demencia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Demência</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("demencia") && (
              <FormField
                control={form.control}
                name="tipo_demencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Demência</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="comunicacao_verbal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Comunicação Verbal</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dificuldade_fala"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dificuldade de Fala</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dificuldade_auditiva"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dificuldade Auditiva</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protese_auditiva"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Prótese Auditiva</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avc"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>AVC</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tce"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>TCE</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hipertensao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hipertensão</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardiopatias"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cardiopatias</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("cardiopatias") && (
              <FormField
                control={form.control}
                name="quais_cardiopatias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quais cardiopatias?</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="hipotireoidismo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hipotireoidismo</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colesterol_alto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Colesterol Alto</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artrose"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Artrose</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historico_cancer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Histórico de Câncer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("historico_cancer") && (
              <FormField
                control={form.control}
                name="tipo_cancer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Câncer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="osteoporose"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Osteoporose</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fraturas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Fraturas</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("fraturas") && (
              <FormField
                control={form.control}
                name="onde_fraturas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onde?</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="cirurgia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cirurgia</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("cirurgia") && (
              <FormField
                control={form.control}
                name="onde_cirurgia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onde?</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="depressao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Depressão</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outros_antecedentes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outros Antecedentes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- ALIMENTAÇÃO --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Alimentação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="alimenta_sozinho"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Alimenta-se Sozinho</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_alimentacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Alimentação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="pastosa">Pastosa</SelectItem>
                        <SelectItem value="líquida">Líquida</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dificuldade_degluticao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dificuldade de Deglutição</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="engasgos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Engasgos</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uso_sonda"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Uso de Sonda</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("uso_sonda") && (
              <FormField
                control={form.control}
                name="tipo_sonda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Sonda</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="alergia_alimento"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Alergia Alimentar</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("alergia_alimento") && (
              <FormField
                control={form.control}
                name="qual_alimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual alimento?</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* --- MOBILIDADE --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Mobilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="caminha_sozinho"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Caminha Sozinho</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acamado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Acamado</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("acamado") && (
              <FormField
                control={form.control}
                name="tempo_acamado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Acamado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="risco_quedas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Risco de Quedas</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- COMPORTAMENTO --- */}
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Comportamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="comunicativa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Comunicativa</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agressiva"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Agressiva</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humor_instavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Humor Instável</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="as_vezes">Às vezes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
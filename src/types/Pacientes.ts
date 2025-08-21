import { User } from './User';

// Estrutura do Paciente como recebido da API
export interface Paciente {
  id: number;
  user: User;
  nome_completo: string;
  rg: string;
  cpf: string;
  data_nascimento: string;
  idade: number;
  data_avaliacao?: string | null;
  naturalidade?: string | null;
  religiao?: string | null;
  praticante?: boolean | null;
  profissao?: string | null;
  escolaridade?: string | null;
  estado_civil?: string | null;
  orgao_expedidor?: string | null;
  nome_pai?: string | null;
  nome_mae?: string | null;
  data_acolhimento?: string | null;
  responsavel?: string | null;
  telefone_responsavel?: string | null;
  rg_responsavel?: string | null;
  cpf_responsavel?: string | null;
  endereco?: string | null;
  contato_emergencia?: string | null;
  acolhido_outra_instituicao?: boolean | null;
  tempo_acolhimento_anterior?: string | null;
  possui_convenio?: boolean | null;
  nome_convenio?: string | null;
  tipo_sanguineo?: string | null;
  receituario_medico?: string | null;
  carteira_vacinacao?: boolean | null;
  situacao_vacinal?: string | null;
  vacina_covid_1?: string | null;
  vacina_covid_2?: string | null;
  vacina_covid_3?: string | null;
  vacina_covid_4?: string | null;
  alergias_medicamentosas?: boolean | null;
  quais_alergias?: string | null;
  tabagista?: boolean | null;
  etilista?: boolean | null;
  protese_dentaria?: boolean | null;
  utiliza_fraldas?: boolean | null;
  orientacao_tempo?: boolean | null;
  orientacao_espaco?: boolean | null;
  medicamentos_uso?: string | null;
  grau_dependencia?: number | null;
  banho?: string | null;
  vestir?: string | null;
  banheiro?: string | null;
  transferencia?: string | null;
  continencia?: string | null;
  alimentacao?: string | null;
  preferencias?: string | null;
  dificuldade_visual?: boolean | null;
  usa_oculos?: boolean | null;
  demencia?: boolean | null;
  tipo_demencia?: string | null;
  comunicacao_verbal?: boolean | null;
  dificuldade_fala?: boolean | null;
  dificuldade_auditiva?: boolean | null;
  protese_auditiva?: boolean | null;
  avc?: boolean | null;
  tce?: boolean | null;
  hipertensao?: boolean | null;
  cardiopatias?: boolean | null;
  quais_cardiopatias?: string | null;
  hipotireoidismo?: boolean | null;
  colesterol_alto?: boolean | null;
  artrose?: boolean | null;
  diabetes?: boolean | null;
  tipo_diabetes?: string | null;
  historico_cancer?: boolean | null;
  tipo_cancer?: string | null;
  osteoporose?: boolean | null;
  fraturas?: boolean | null;
  onde_fraturas?: string | null;
  cirurgia?: boolean | null;
  onde_cirurgia?: string | null;
  depressao?: boolean | null;
  outros_antecedentes?: string | null;
  alimenta_sozinho?: boolean | null;
  tipo_alimentacao?: string | null;
  dificuldade_degluticao?: boolean | null;
  engasgos?: boolean | null;
  uso_sonda?: boolean | null;
  tipo_sonda?: string | null;
  alergia_alimento?: boolean | null;
  qual_alimento?: string | null;
  caminha_sozinho?: boolean | null;
  cadeirante?: boolean | null;
  tempo_cadeirante?: string | null;
  acamado?: boolean | null;
  tempo_acamado?: string | null;
  uso_aparelhos_locomocao?: boolean | null;
  quais_aparelhos?: string | null;
  risco_quedas?: boolean | null;
  comunicativa?: boolean | null;
  agressiva?: boolean | null;
  humor_instavel?: string | null;
  observacoes?: string | null;
  date_joined?: string | null;
  updated?: string | null;
}

// Payload para criar/atualizar um Paciente via API
export type CreatePacientePayload = Omit<Partial<Paciente>, 'id' | 'user'> & {
  id_user: number;
  nome_completo: string;
  rg: string;
  cpf: string;
  data_nascimento: string;
  idade: number;
};

// Tipos para respostas da API
export type APIGetPacientes = {
  results: Paciente[];
  count: number;
};

export type APICreatePaciente = Paciente;
export type APIUpdatePaciente = Paciente;
export type APIDeletePaciente = {
  message: string;
};

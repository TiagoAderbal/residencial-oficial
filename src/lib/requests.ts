import { SignInData, SignUpData } from "@/lib/schemas/authSchema";
import { api } from "./api";
import { APISignIn, APISignUp } from "@/types/Auth";
import { APIUpdateUser } from "@/types/User";
import { Fornecedor, APIGetFornecedores, APIGetDetailFornecedor, APICreateFornecedor, APIUpdateFornecedor, APIDeleteFornecedor } from "@/types/Fornecedor";
import { PlanoConta, APIGetPlanosConta, APIGetDetailPlanoConta, APICreatePlanoConta, APIUpdatePlanoConta, APIDeletePlanoConta } from "@/types/PlanoContas";
import { TipoConta, APIGetTipoContas, APIGetDetailTipoConta, APICreateTipoConta, APIUpdateTipoConta, APIDeleteTipoConta } from "@/types/TipoContas";
import { TipoDocumento, APIGetTipoDocumentos, APIGetDetailTipoDocumento, APICreateTipoDocumento, APIUpdateTipoDocumento, APIDeleteTipoDocumento } from "@/types/TipoDocumentos";
import { FormaPagamento, APIGetFormaPagamentos, APIGetDetailFormaPagamento, APICreateFormaPagamento, APIUpdateFormaPagamento, APIDeleteFormaPagamento } from "@/types/FormaPagamento";
import { TipoLancamento, APIGetTipoLancamentos, APICreateTipoLancamento, APIUpdateTipoLancamento, APIDeleteTipoLancamento } from "@/types/TipoLancamentos";
import { Medicamento, APIGetMedicamentos, APICreateMedicamento, APIUpdateMedicamento, APIDeleteMedicamento } from "@/types/Medicamentos";
import { Lancamento, APIGetLancamentos, APICreateLancamento, APIUpdateLancamento, APIDeleteLancamento } from "@/types/Lancamentos";
import { Paciente, APIGetPacientes, APICreatePaciente, APIUpdatePaciente, APIDeletePaciente } from "@/types/Pacientes";

/** Auth / User */
export const signIn = async (data: SignInData) => {
  return await api<APISignIn>({
    endpoint: '/authentication/login/',
    method: 'POST',
    withAuth: false,
    data
  })
}

export const signUp = async (data: SignUpData) => {
  return await api<APISignUp>({
    endpoint: 'accounts/signup',
    method: 'POST',
    withAuth: false,
    data
  })
}

export const updateUser = async (data: FormData) => {
  return await api<APIUpdateUser>({
    endpoint: 'accounts/me',
    method: 'PUT',
    data,
    withAttachment: true
  })
}

// Fornecedores
export const getFornecedores = async () => {
  return await api<APIGetFornecedores>({
    endpoint: 'fornecedores/',
    method: 'GET'
  })
}

export const getDetailFornecedor = async (id: number) => {
  return await api<APIGetDetailFornecedor>({
    endpoint: `fornecedor/${id}/`,
    method: 'GET'
  })
}

export const createFornecedor = async (data: Omit<Fornecedor, 'id'>) => {
  return await api<APICreateFornecedor>({
    endpoint: 'fornecedores/',
    method: 'POST',
    data
  })
}

export const updateFornecedor = async (id: number, data: Partial<Fornecedor>) => {
  return await api<APIUpdateFornecedor>({
    endpoint: `fornecedor/${id}/`,
    method: 'PUT',
    data
  })
}

export const deleteFornecedor = async (id: number) => {
  return await api<APIDeleteFornecedor>({
    endpoint: `fornecedor/${id}/`,
    method: 'DELETE'
  })
}

// Plano de Contas
export const getPlanoDeContas = async () => {
  return await api<APIGetPlanosConta>({
    endpoint: 'plano-de-contas/',
    method: 'GET'
  });
}

export const getDetailPlanoDeConta = async (id: number) => {
  return await api<APIGetDetailPlanoConta>({
    endpoint: `plano-de-conta/${id}/`,
    method: 'GET'
  });
}

export const createPlanoConta = async (data: Omit<PlanoConta, 'id' | 'subMenus'>) => {
  return await api<APICreatePlanoConta>({
    endpoint: 'plano-de-contas/',
    method: 'POST',
    data
  });
}

export const updatePlanoConta = async (id: number, data: Partial<PlanoConta>) => {
  return await api<APIUpdatePlanoConta>({
    endpoint: `plano-de-conta/${id}/`,
    method: 'PUT',
    data
  });
}

export const deletePlanoConta = async (id: number) => {
  return await api<APIDeletePlanoConta>({
    endpoint: `plano-de-conta/${id}/`,
    method: 'DELETE'
  });
}

// Tipo de Contas
export const getTipoContas = async () => {
  return await api<APIGetTipoContas>({
    endpoint: 'tipo-de-contas/',
    method: 'GET'
  });
}

export const getDetailTipoConta = async (id: number) => {
  return await api<APIGetDetailTipoConta>({
    endpoint: `tipo-de-conta/${id}/`,
    method: 'GET'
  });
}

export const createTipoConta = async (data: Omit<TipoConta, 'id'>) => {
  return await api<APICreateTipoConta>({
    endpoint: 'tipo-de-contas/',
    method: 'POST',
    data
  });
}

export const updateTipoConta = async (id: number, data: Partial<TipoConta>) => {
  return await api<APIUpdateTipoConta>({
    endpoint: `tipo-de-conta/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteTipoConta = async (id: number) => {
  return await api<APIDeleteTipoConta>({
    endpoint: `tipo-de-conta/${id}/`,
    method: 'DELETE'
  });
}

// Tipo de Documentos
export const getTipoDocumentos = async () => {
  return await api<APIGetTipoDocumentos>({
    endpoint: 'tipo-de-documentos/',
    method: 'GET'
  });
}

export const getDetailTipoDocumento = async (id: number) => {
  return await api<APIGetDetailTipoDocumento>({
    endpoint: `tipo-de-documento/${id}/`,
    method: 'GET'
  });
}

export const createTipoDocumento = async (data: Omit<TipoDocumento, 'id'>) => {
  return await api<APICreateTipoDocumento>({
    endpoint: 'tipo-de-documentos/',
    method: 'POST',
    data
  });
}

export const updateTipoDocumento = async (id: number, data: Partial<TipoDocumento>) => {
  return await api<APIUpdateTipoDocumento>({
    endpoint: `tipo-de-documento/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteTipoDocumento = async (id: number) => {
  return await api<APIDeleteTipoDocumento>({
    endpoint: `tipo-de-documento/${id}/`,
    method: 'DELETE'
  });
}

// Forma de pagamentos
export const getFormaPagamentos = async () => {
  return await api<APIGetFormaPagamentos>({
    endpoint: 'forma-de-pagamentos/',
    method: 'GET'
  });
}

export const getDetailFormaPagamento = async (id: number) => {
  return await api<APIGetDetailFormaPagamento>({
    endpoint: `forma-de-pagamento/${id}/`,
    method: 'GET'
  });
}

export const createFormaPagamento = async (data: Omit<FormaPagamento, 'id'>) => {
  return await api<APICreateFormaPagamento>({
    endpoint: 'forma-de-pagamentos/',
    method: 'POST',
    data
  });
}

export const updateFormaPagamento = async (id: number, data: Partial<FormaPagamento>) => {
  return await api<APIUpdateFormaPagamento>({
    endpoint: `forma-de-pagamento/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteFormaPagamento = async (id: number) => {
  return await api<APIDeleteFormaPagamento>({
    endpoint: `forma-de-pagamento/${id}/`,
    method: 'DELETE'
  });
}

// Tipo de Lancamentos
export const getTipoLancamentos = async () => {
  return await api<APIGetTipoLancamentos>({
    endpoint: 'tipo-de-lancamentos/',
    method: 'GET'
  });
}

export const createTipoLancamento = async (data: Omit<TipoLancamento, 'id'>) => {
  return await api<APICreateTipoLancamento>({
    endpoint: 'tipo-de-lancamentos/',
    method: 'POST',
    data
  });
}

export const updateTipoLancamento = async (id: number, data: Partial<TipoLancamento>) => {
  return await api<APIUpdateTipoLancamento>({
    endpoint: `tipo-de-lancamento/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteTipoLancamento = async (id: number) => {
  return await api<APIDeleteTipoLancamento>({
    endpoint: `tipo-de-lancamento/${id}/`,
    method: 'DELETE'
  });
}

// Lancamentos
export const getLancamentos = async (page = 1) => {
  return await api<APIGetLancamentos>({
    endpoint: `lancamentos/?page=${page}`,
    method: 'GET'
  });
};

export const createLancamento = async (data: Omit<Lancamento, 'id'>) => {
  return await api<APICreateLancamento>({
    endpoint: 'lancamentos/',
    method: 'POST',
    data
  });
}

export const updateLancamento = async (id: number, data: Partial<Lancamento>) => {
  return await api<APIUpdateLancamento>({
    endpoint: `lancamento/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteLancamento = async (id: number) => {
  return await api<APIDeleteLancamento>({
    endpoint: `lancamento/${id}/`,
    method: 'DELETE'
  });
}

// Medicamentos
export const getMedicamentos = async () => {
  return await api<APIGetMedicamentos>({
    endpoint: 'medicamentos/',
    method: 'GET'
  });
}

export const createMedicamento = async (data: Omit<Medicamento, 'id'>) => {
  return await api<APICreateMedicamento>({
    endpoint: 'medicamentos/',
    method: 'POST',
    data
  });
}

export const updateMedicamento = async (id: number, data: Partial<Medicamento>) => {
  return await api<APIUpdateMedicamento>({
    endpoint: `medicamento/${id}/`,
    method: 'PUT',
    data
  });
}

export const deleteMedicamento = async (id: number) => {
  return await api<APIDeleteMedicamento>({
    endpoint: `medicamento/${id}/`,
    method: 'DELETE'
  });
}

// Pacientes
export const getPacientes = async (page = 1) => {
  return await api<APIGetPacientes>({
    endpoint: `pacientes/?page=${page}`,
    method: 'GET'
  });
};

export const createPaciente = async (data: Omit<Paciente, 'id'>) => {
  return await api<APICreatePaciente>({
    endpoint: 'pacientes/',
    method: 'POST',
    data
  });
}

export const updatePaciente = async (id: number, data: Partial<Paciente>) => {
  return await api<APIUpdatePaciente>({
    endpoint: `paciente/${id}/`,
    method: 'PUT',
    data
  });
}

export const deletePaciente = async (id: number) => {
  return await api<APIDeletePaciente>({
    endpoint: `paciente/${id}/`,
    method: 'DELETE'
  });
}
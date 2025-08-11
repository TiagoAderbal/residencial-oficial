import { SignInData, SignUpData } from "@/lib/schemas/authSchema";
import { api } from "./api";
import { APISignIn, APISignUp } from "@/types/Auth";
import { APIUpdateUser } from "@/types/User";
import { Fornecedor, APIGetFornecedores, APICreateFornecedor, APIUpdateFornecedor, APIDeleteFornecedor } from "@/types/Fornecedor";
import { PlanoConta, APIGetPlanosConta, APICreatePlanoConta, APIUpdatePlanoConta, APIDeletePlanoConta } from "@/types/PlanoContas";

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
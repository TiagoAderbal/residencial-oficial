import { SignInData, SignUpData } from "@/lib/schemas/authSchema";
import { api } from "./api";
import { APISignIn, APISignUp } from "@/types/Auth";
import { APIUpdateUser } from "@/types/User";
import { Fornecedor, APIGetFornecedores, APICreateFornecedor, APIUpdateFornecedor, APIDeleteFornecedor } from "@/types/Fornecedor";

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

/** Fornecedores */export const getFornecedores = async () => {
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
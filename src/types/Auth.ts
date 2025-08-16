import { User } from './User'

export type APISignIn = {
    user: User,
    access: string
}

export type APISignUp = {
    user: User,
    access: string
}
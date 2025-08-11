export type User = {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    is_superuser: boolean,
    is_staff: boolean,
    is_active: boolean,
    groups: [],
    user_permissions: []
}

export type APIUpdateUser = {
    user: User
}
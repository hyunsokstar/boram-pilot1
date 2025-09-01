export interface User {
    id: string;
    name: string;
    email?: string;
    department: string;
    role: string;
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
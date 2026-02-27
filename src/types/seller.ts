export interface Seller {
    id: string;
    name: string;
    cpf: string;
    email: string;
    phone?: string;
    active: boolean;
    role: string;
}

export interface CreateSellerData {
    name: string;
    cpf: string;
    email: string;
    phone?: string;
    password?: string;
    role: string;
}
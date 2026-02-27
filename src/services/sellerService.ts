import api from './api';
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
export interface UpdateSellerData extends Partial<CreateSellerData> {
    active?: boolean;
}
export const sellerService = {
    getAll: async (): Promise<Seller[]> => {
        const response = await api.get<Seller[]>('/Seller');
        return response.data;
    },
    getById: async (id: string): Promise<Seller> => {
        const response = await api.get<Seller>(`/Seller/${id}`);
        return response.data;
    },
    create: async (data: CreateSellerData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/Seller', data);
        return response.data;
    },
    update: async (id: string, data: UpdateSellerData): Promise<void> => {
        await api.put(`/Seller/${id}`, data);
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/Seller/${id}`);
    }
};
import api from './api';

export interface Address {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

export interface Customer {
    id: string;
    companyName: string;
    cnpj: string;
    address: Address;
    latitude: number;
    longitude: number;
    active: boolean;
}

export interface CreateCustomerData {
    companyName: string;
    cnpj: string;
    address: Address;
    latitude: number;
    longitude: number;
}

export const customerService = {
    getAll: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/Customer');
        return response.data;
    },
    getById: async (id: string): Promise<Customer> => {
        const response = await api.get<Customer>(`/Customer/${id}`);
        return response.data;
    },
    create: async (data: CreateCustomerData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/Customer', {
            ...data,
            cnpj: data.cnpj.replace(/\D/g, '')
        });
        return response.data;
    },
    update: async (id: string, data: Partial<CreateCustomerData> & { active?: boolean }): Promise<void> => {
        await api.put(`/Customer/${id}`, data);
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/Customer/${id}`);
    }
};
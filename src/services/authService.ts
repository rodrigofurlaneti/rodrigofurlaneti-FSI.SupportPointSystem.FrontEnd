import api from './api';
export interface LoginResponse {
    token: string;
    sellerId: string;
    name: string;
    role: string;
}

export interface LoginCredentials {
    cpf: string;
    password?: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/Auth/login', {
            cpf: credentials.cpf,
            password: credentials.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    },

    logout: () => {
        localStorage.clear();
        window.location.href = '/';
    }
};
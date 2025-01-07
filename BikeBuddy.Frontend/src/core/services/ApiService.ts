import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from 'process';

type ApiResponse<T> = {
    data: T;
    status: number;
    message?: string;
}

type ApiError = {
    message: string;
    status: number;
}

export class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => this.handleError(error)
        )

        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }               
                return config;
            },
            (error) => Promise.reject(error)
        )
    }

    private handleError(error: AxiosError): Promise<never> {
        const apiError: ApiError = {
            message: 'Произошла ошибка',
            status: error.response?.status || 500
        };

        if (error.response) {
            const response = error.response.data as any;

            // Проверяем различные возможные форматы сообщения об ошибке
            apiError.message = response?.error?.message ||
                               response?.error ||
                               response?.message ||
                               response || 'Произошла ошибка при выполнении запроса';

            if (error.response?.status === 401) {
                // Можно добавить логику для обновления токена или выхода пользователя
            }
        } else if (error.request) {
            apiError.message = 'Сервер не отвечает';
        } else {
            apiError.message = error.message || 'Ошибка при выполнении запроса';
        }

        return Promise.reject(apiError);
    }

    // Остальные методы остаются без изменений...
    private async get<T>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.get(url);
        return {
            data: response.data,
            status: response.status,
        };
    }

    async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.post(url, data);
        return {
            data: response.data,
            status: response.status,
        };
    }

    private async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.put(url, data);
        return {
            data: response.data,
            status: response.status,
        };
    }

    private async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.delete(url);
        return {
            data: response.data,
            status: response.status,
        };
    }
}

export const apiService = new ApiService("https://localhost:7187/");
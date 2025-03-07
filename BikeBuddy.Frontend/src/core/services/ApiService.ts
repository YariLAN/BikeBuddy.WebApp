import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import JwtService from './JwtService';
import { AuthResponse } from '@/stores/auth';
import { LOCAL_BASE_URL } from '../constants';

export type ApiResponse<T> = {
    data?: T;
    status: number;
    error?: string;
}

type ApiError = {
    message: string;
    status: number;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    retry? : boolean
}

export class ApiService {
    private api: AxiosInstance;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomInternalAxiosRequestConfig;

                if (error.response?.status === 401 && originalRequest && !originalRequest.retry) {
                    if (this.isRefreshing) {
                        return new Promise(resolve => {
                            this.subscribeTokenRefresh(token => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                resolve(this.api(originalRequest));
                            });
                        });
                    }

                    originalRequest.retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.onRefreshed(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return this.handleError(error)
            }
        )

        this.api.interceptors.request.use(
            async (config) => {
                const token = JwtService.getToken();
                if (token && config.headers) {
                    if (JwtService.isTokenExpired(token) && config.url !== '/auth/refresh') {
                        try {
                            const newToken = await this.refreshToken()
                            config.headers.Authorization = `Bearer ${newToken}`;
                        }
                        catch (error) {
                            return Promise.reject(error);
                        }
                    } else {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }               
                return config;
            },
            (error) => Promise.reject(error)
        )
    }

    private onRefreshed(token: string) {
        this.refreshSubscribers.forEach(callback => callback(token));
        this.refreshSubscribers = [];
    }

    private subscribeTokenRefresh(callback: (token: string) => void) {
        this.refreshSubscribers.push(callback);
    }

    private async refreshToken(): Promise<string> {
        try {
            const response = await this.api.post<AuthResponse>('/auth/refresh', {}, { withCredentials: true });
            const newToken = response.data.accessToken;
            JwtService.saveToken(newToken);
            return newToken;
        } catch (error) {
            JwtService.destroyToken();
            window.location.href = '/';
            return Promise.reject(error);
        }
    }
    
    private async handleError(error: AxiosError): Promise<never> {
        console.error("Ошибка: ", error)

        const apiError: ApiError = {
            message: 'Произошла ошибка',
            status: error.response?.status || 500
        };

        if (error.response) {
            const response = error.response.data as ApiError;

            apiError.message = (response.message.length <= 250) ? response.message : 'Произошла ошибка при выполнении запроса';
        } else if (error.request) {
            apiError.message = 'Сервер не отвечает';
        } else {
            apiError.message = 'Ошибка при выполнении запроса';
        }
        return Promise.reject(apiError);
    }

    // Остальные методы остаются без изменений...
    async get<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse = await this.api.get(url);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (err : any) {
            return {error: err.message, status: err.status } 
        }
    }

    async post<T>(url: string, data: any = null, withCredentials: boolean = false): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.post(url, data, { withCredentials: withCredentials });
        return response as ApiResponse<T>
    }

    async file_post<T>(
        url: string, 
        data: any = null, 
        withCredentials: boolean = false, 
        contentType: string = 'multipart/form-data'): Promise<ApiResponse<T>> 
    {
        try {
            const response: AxiosResponse = await this.api.post(url, data, { 
                withCredentials: withCredentials,
                headers: {
                    'Content-Type' : contentType
                }
            });
            return {
                data: response.data,
                status: response.status,
            };
        }
        catch (err : any) {
            return {error: err.message, status: err.status }
        }
    }

    async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse = await this.api.put(url, data);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (err : any) {
            return {error: err.message, status: err.status } 
        }
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse = await this.api.delete(url);
        return {
            data: response.data,
            status: response.status,
        };
    }
}

export const apiService = new ApiService(LOCAL_BASE_URL);
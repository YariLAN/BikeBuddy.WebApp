'use client'

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/stores/auth";
import {  CheckCircle, Mail, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function EmailVerifycationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    
    const [verificationResult, setVerificationResult] = useState<boolean>();
    const [error, setError] = useState<string | null>(null);
    const hasExecuted = useRef(false)

    const authStore = useAuthStore();

    const verifyEmail = async () => {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        if (hasExecuted.current) return

        if (!userId || !token) {
            setError("Неверная ссылка");
            return
        }

        hasExecuted.current = true

        const result = await authStore.verify(userId, token);

        if (result.error) {
            setError(result.error);
            return
        } else if (result.data) {
            setVerificationResult(result.data);
        }
    }

    useEffect(() => {
        verifyEmail();
    }, [])

    const handleGoToLogin = () => {
        navigate("/")
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Подтверждение почты</CardTitle>
                <CardDescription>Проверяем действительность ссылки подтверждения</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {verificationResult && (
                    <div className="space-y-4">
                        {verificationResult ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Почта подтверждена!</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Теперь вы можете войти в свой аккаунт.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Ошибка подтверждения</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col space-y-3">
                    {verificationResult && (
                        <Button onClick={handleGoToLogin} className="w-full">
                            На главную страницу
                        </Button>
                    )}
                </div>

            </CardContent>
        </Card>
      </div>
    )
}
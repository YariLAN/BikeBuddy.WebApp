import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Warning() {
    return (
      <Alert variant="destructive" className="p-5">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Данных профиля нет</AlertTitle>
        <AlertDescription>Пожалуйста, заполните все необходимые поля профиля</AlertDescription>
      </Alert>
    )
  }
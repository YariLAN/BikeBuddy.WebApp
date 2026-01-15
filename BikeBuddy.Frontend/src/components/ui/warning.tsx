import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

 interface WarningProps {
    title: string
    description?: string
  }

export function Warning({ title, description } : WarningProps) {
    return (
      <Alert variant="destructive" className="p-5">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    )
}
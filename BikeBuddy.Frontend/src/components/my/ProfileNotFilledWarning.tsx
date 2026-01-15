import { Warning } from "../ui/warning";

  export function ProfileNotFilledWarning() {
    return <Warning title="Данных профиля нет" 
      description="Пожалуйста, заполните все необходимые поля профиля" 
    />
  }
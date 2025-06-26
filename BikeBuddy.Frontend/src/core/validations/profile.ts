import * as yup from "yup"

export const profileSchema = yup.object({
  // Account Data
  email: yup.string().email("Неверный формат email").required("Email обязателен"),
  username: yup
    .string()
    .required("Имя пользователя обязательно")
    .min(3, "Минимум 3 символа")
    .max(20, "Максимум 20 символов"),
  
  // Profile Data
  lastName: yup
    .string()
    .required("Фамилия обязательна")
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов"),
  firstName: yup
    .string()
    .required("Имя обязательно")
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов"),
  middleName: yup
    .string()
    .max(50, "Максимум 50 символов")
    .nullable(),
  birthDate: yup
    .date()
    .required("Дата рождения обязательна")
    .max(new Date(), "Дата не может быть в будущем"),
  address: yup
    .string()
    .required()
    .max(200, "Максимум 200 символов")
    .nullable(),
})

export type ProfileFormData = yup.InferType<typeof profileSchema>
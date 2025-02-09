import * as yup from "yup"

export const eventSchema = yup.object({
  title: yup
    .string()
    .min(5, "Минимум 5 символов")
    .max(100, "Максимум 100 символов")
    .required("Название обязательно"),
  description: yup
    .string()
    .min(20, "Минимум 20 символов")
    .max(2000, "Максимум 2000 символов")
    .required("Описание обязательно"),
  startAddress: yup
    .string()
    .required("Адрес старта обязателен"),
  endAddress: yup
    .string()
    .required("Адрес финиша обязателен"),
  startDateTime: yup
    .date()
    .min(new Date(), "Дата не может быть в прошлом")
    .required("Дата и время начала обязательны"),
  endDateTime: yup
    .date()
    .min(yup.ref('startDateTime'), "Время окончания должно быть после времени начала")
    .required("Дата и время окончания обязательны"),
  distance: yup
    .number()
    .min(1, "Минимальная дистанция 1 км")
    .required("Дистанция обязательна"),
  bikeType: yup
    .string()
    .oneOf(['road', 'mtb', 'hybrid', 'any'], "Некорректный тип велосипеда")
    .required("Тип велосипеда обязателен"),
  images: yup
    .array()
    .of(yup.string())
    .max(5, "Максимум 5 изображений")
})

export type EventFormData = yup.InferType<typeof eventSchema>
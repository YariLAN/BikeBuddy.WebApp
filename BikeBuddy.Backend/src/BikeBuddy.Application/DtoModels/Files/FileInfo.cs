namespace BikeBuddy.Application.DtoModels.Files;

/// <summary>
/// Информация о файле
/// </summary>
/// <param name="FileName">Наименование файла</param>
/// <param name="Url">Прямая ссылка на файл</param>
/// <param name="Size">Размер файла</param>
/// <param name="UploadedAt">Дата загрузки</param>
public record FileInfo(
    string FileName,
    string Url,
    ulong Size,
    DateTime? UploadedAt);

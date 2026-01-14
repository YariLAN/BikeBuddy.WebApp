using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Common;

public sealed record FileItem(string FileName, string Url, ulong Size, DateTime? UploadedAt);

public interface IFileProvider
{
    Task<Result<string, Error>> UploadFileAsync(byte[] fileData, string bucketName, string objectName, string mimeType,
        CancellationToken cancellationToken);
    
    Task<Result<string, Error>> UploadFileAsync(IFormFile file, string bucketName, string objectName, string mimeType,
        CancellationToken cancellationToken);

    Task<Result<string, Error>> GetFileByFileNamesAsync(string fileName, string bucketName,
        CancellationToken cancellationToken);

    Task<Result<IReadOnlyList<FileItem>, Error>> GetAllByObjectAsync(string bucketName, string prefix, 
        CancellationToken ct = default);

    Task<Result<string, Error>> UploadFilesAsync(
        List<IFormFile> files, 
        string bucketName, 
        string folderName,
        CancellationToken cancellationToken = default);

    Task<Result<string, Error>> GetPermanentFileUrlAsync(string fileName, string bucketName,
        CancellationToken cancellationToken);
}

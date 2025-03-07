using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Common;

public interface IFileProvider
{
    Task<Result<string, Error>> UploadFileAsync(byte[] fileData, string bucketName, string objectName, CancellationToken cancellationToken);

    Task<Result<string, Error>> UploadFileAsync(string dataUrl, string bucketName, string objectName, CancellationToken cancellationToken);

    Task<List<string>> UploadFilesAsync(List<(byte[] fileData, string objectName)> files, string bucketName);
}

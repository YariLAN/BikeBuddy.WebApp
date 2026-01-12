using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using BikeBuddy.Infrastructure.Extensions;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using System.Threading;

namespace BikeBuddy.Infrastructure.Services.Common;

internal sealed record FileInfo(byte[] fileData, string bucketName, string objectName, string mimeType);

public class MinioProvider : IFileProvider
{
    private readonly IMinioClient _minioClient;

    public MinioProvider(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    public async Task<Result<string, Error>> UploadFileAsync(byte[] fileData, string bucketName, string objectName, string mimeType, CancellationToken cancellationToken)
    {
        await IfBucketsNotExistCreateBucket([bucketName], cancellationToken);

        var result = await PutObject(fileData, bucketName, objectName, mimeType, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        return result.Value;
    }

    public async Task<Result<string, Error>> UploadFileAsync(string dataUrl, string bucketName, string objectName, string mimeType, CancellationToken cancellationToken)
    {
        var fileBytesResult = DataUrlToBytes(dataUrl);

        if (fileBytesResult.IsFailure)
            return fileBytesResult.Error;

        return await UploadFileAsync(fileBytesResult.Value, bucketName, objectName, mimeType, cancellationToken);
    }


    public async Task<Result<string, Error>> UploadFileAsync(IFormFile file, string bucketName, string objectName, string mimeType, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return Error.Validation("File is empty");

        var fileData = await file.ToByteArrayAsync();

        return await UploadFileAsync(fileData, bucketName, objectName, mimeType, cancellationToken);
    }

    public async Task<Result<string, Error>> UploadFilesAsync(List<IFormFile> files, string bucketName,
        string folderName, CancellationToken cancellationToken)
    {
        if (files.Count <= 0)
            return "";
        
        List<FileInfo> fileInfos = [];
        
        foreach (var file in files)
        {
            if (file.Length == 0)
                return Error.Validation("File is empty");

            var fileData = await file.ToByteArrayAsync();

            fileInfos.Add(new FileInfo(fileData, bucketName, $"{folderName}/{file.FileName}", Path.GetExtension(file.FileName)));
        }

        var result = await PutMultipleObjects(fileInfos, cancellationToken);
        
        if (result.IsFailure)
            return result.Error;

        return result.Value;
    }

    public async Task<Result<string, Error>> GetFileByFileNamesAsync(string fileName, string bucketName, CancellationToken cancellationToken)
    {
        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName);

            try
            {
                await _minioClient.StatObjectAsync(statObjectArgs, cancellationToken);
            }
            catch (MinioException)
            {
                return string.Empty;
            }

            var presignedUrl = await _minioClient.PresignedGetObjectAsync(
                new PresignedGetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(fileName)
                    .WithExpiry(1800));

            return presignedUrl;
        }
        catch (Exception ex)
        {
            return Error.Failure($"Failed to get image by file name: {ex.Message}");
        }
    }
    
    private async Task<Result<string, Error>> PutObject(
        byte[] fileData,
        string bucketName,
        string objectName,
        string mimeType,
        CancellationToken cancellationToken)
    {
        var putObjectArgs = new PutObjectArgs()
           .WithBucket(bucketName)
           .WithStreamData(new MemoryStream(fileData))
           .WithObjectSize(fileData.Length)
           .WithObject(objectName)
           .WithContentType(mimeType);

        try
        {
            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);
            return objectName;
        }
        catch (Exception ex)
        {
            return Error.Failure("Fail to upload file in minio");
        }
    }

    private async Task<Result<string, Error>> PutMultipleObjects(
        List<FileInfo> files,
        CancellationToken cancellationToken)
    {
        var putObjectsArgs = files.Select(f =>
            new PutObjectArgs()
                .WithBucket(f.bucketName)
                .WithStreamData(new MemoryStream(f.fileData))
                .WithObjectSize(f.fileData.Length)
                .WithObject(f.objectName)
                .WithContentType(f.mimeType)
        );

        var uploadTasks = putObjectsArgs
            .Select(args => _minioClient.PutObjectAsync(args, cancellationToken))
            .ToList();
        
        try
        {
            var results = await Task.WhenAll(uploadTasks);
            return files.First().objectName;
        }
        catch (Exception ex)
        {
            return Error.Failure($"Failed to upload files: {ex.Message}");
        }
    }

    private Result<byte[], Error> DataUrlToBytes(string dataUrl)
    {
        if (!dataUrl.StartsWith("data:image/png;base64"))
        {
            return Error.Failure("Fail convert data Url to bytes");
        }

        string base64Data = dataUrl.Split(',')[1];

        return Convert.FromBase64String(base64Data);
    }

    private async Task IfBucketsNotExistCreateBucket(IEnumerable<string> buckets, CancellationToken cancellationToken)
    {
        HashSet<string> bucketNames = [.. buckets];

        foreach (var bucketName in bucketNames)
        {
            var bucketExistArgs = new BucketExistsArgs().WithBucket(bucketName);

            var isExist = await _minioClient.BucketExistsAsync(bucketExistArgs, cancellationToken);

            if (!isExist)
            {
                var makeBucketArgs = new MakeBucketArgs().WithBucket(bucketName);

                await _minioClient.MakeBucketAsync(makeBucketArgs, cancellationToken);
            }
        }
    }

    public async Task<Result<string, Error>> GetPermanentFileUrlAsync(string fileName, string bucketName, CancellationToken cancellationToken)
    {
        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName);

            try
            {
                await _minioClient.StatObjectAsync(statObjectArgs, cancellationToken);
            }
            catch (MinioException)
            {
                return string.Empty;
            }

            return $"{_minioClient.Config.Endpoint}/{bucketName}/{Uri.EscapeDataString(fileName)}";
        }
        catch (Exception ex)
        {
            return Error.Failure($"Ошибка получения URL файла {fileName}: {ex.Message}");
        }
    }
}

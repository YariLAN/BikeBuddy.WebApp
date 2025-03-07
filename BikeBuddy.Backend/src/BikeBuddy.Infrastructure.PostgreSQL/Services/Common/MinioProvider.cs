using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using BikeBuddy.Infrastructure.Extensions;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;

namespace BikeBuddy.Infrastructure.Services.Common;

public class MinioProvider : IFileProvider
{
    private readonly IMinioClient _minioClient;

    public MinioProvider(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    public async Task<Result<string, Error>> UploadFileAsync(byte[] fileData, string bucketName, string objectName, CancellationToken cancellationToken)
    {
        
        await IfBucketsNotExistCreateBucket([bucketName], cancellationToken);

         var result = await PutObject(fileData, bucketName, objectName, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        return result.Value;
    }

    public async Task<Result<string, Error>> UploadFileAsync(string dataUrl, string bucketName, string objectName, CancellationToken cancellationToken)
    {
        var fileBytesResult = DataUrlToBytes(dataUrl);

        if (fileBytesResult.IsFailure)
            return fileBytesResult.Error;

        return await UploadFileAsync(fileBytesResult.Value, bucketName, objectName, cancellationToken);
    }

    public async Task<Result<string, Error>> UploadFileAsync(IFormFile file, string bucketName, string objectName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return Error.Validation("File is empty");

        var fileData = await file.ToByteArrayAsync();

        return await UploadFileAsync(fileData, bucketName, objectName, cancellationToken);
    }

    public Task<List<string>> UploadFilesAsync(List<(byte[] fileData, string objectName)> files, string bucketName)
    {
        throw new NotImplementedException();
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

    private async Task<Result<string, Error>> PutObject(
        byte[] fileData,
        string bucketName,
        string objectName,
        CancellationToken cancellationToken)
    {
        var putObjectAtgs = new PutObjectArgs()
           .WithBucket(bucketName)
           .WithStreamData(new MemoryStream(fileData))
           .WithObjectSize(fileData.Length)
           .WithObject(objectName)
           .WithContentType("image/png");

        try
        {
            await _minioClient.PutObjectAsync(putObjectAtgs, cancellationToken);

            return objectName;
        }
        catch (Exception ex)
        {
            return Error.Failure("Fail to upload file in minio");
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
}

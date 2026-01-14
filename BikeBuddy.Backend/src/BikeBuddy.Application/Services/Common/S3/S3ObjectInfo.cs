namespace BikeBuddy.Application.Services.Common.S3;

public sealed record S3ObjectInfo(
    string FileName, 
    string Url, 
    ulong Size, 
    DateTime? UploadedAt);
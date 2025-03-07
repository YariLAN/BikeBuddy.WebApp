using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Infrastructure.Extensions;

public static class FileExtensions
{
    public static async Task<byte[]> ToByteArrayAsync(this IFormFile file)
    {
        using var memoryStream = new MemoryStream();

        await file.CopyToAsync(memoryStream);

        return memoryStream.ToArray();
    } 
}

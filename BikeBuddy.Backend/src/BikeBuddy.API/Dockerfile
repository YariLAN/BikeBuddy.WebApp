# См. статью по ссылке https://aka.ms/customizecontainer, чтобы узнать как настроить контейнер отладки и как Visual Studio использует этот Dockerfile для создания образов для ускорения отладки.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Этот этап используется для сборки проекта службы
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/BikeBuddy.API/BikeBuddy.API.csproj", "src/BikeBuddy.API/"]
COPY ["src/BikeBuddy.Infrastructure.PostgreSQL/BikeBuddy.Infrastructure.csproj", "src/BikeBuddy.Infrastructure.PostgreSQL/"]
RUN dotnet restore "./src/BikeBuddy.API/BikeBuddy.API.csproj"
COPY . .
WORKDIR "/src/src/BikeBuddy.API"
RUN dotnet build "./BikeBuddy.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Этот этап используется для публикации проекта службы, который будет скопирован на последний этап
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BikeBuddy.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Этот этап используется в рабочей среде или при запуске из VS в обычном режиме (по умолчанию, когда конфигурация отладки не используется)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BikeBuddy.API.dll"]
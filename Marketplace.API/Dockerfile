FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the project file from the Marketplace.API folder
COPY Marketplace.API/*.csproj ./Marketplace.API/
RUN dotnet restore ./Marketplace.API/Marketplace.API.csproj

# Copy the entire solution and build
COPY . .
WORKDIR /app/Marketplace.API
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published application
COPY --from=build /app/Marketplace.API/out ./

# ✅ Copy static files (wwwroot) so product images are served
COPY --from=build /app/Marketplace.API/wwwroot ./wwwroot

# Disable file watching to prevent inotify limit errors
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false

ENTRYPOINT ["dotnet", "Marketplace.API.dll"]
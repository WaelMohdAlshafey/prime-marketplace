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
COPY --from=build /app/Marketplace.API/out ./
ENTRYPOINT ["dotnet", "Marketplace.API.dll"]

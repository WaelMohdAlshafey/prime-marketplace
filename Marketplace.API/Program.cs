using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Marketplace.Infrastructure.Data;
using Marketplace.Application.Interfaces;
using Marketplace.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ============================================================
// CORS (Allows React/Next.js frontend to call the API)
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddMemoryCache();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Prime Marketplace API",
        Version = "v1",
        Description = "Prime Marketplace Backend API"
    });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Register Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// ============================================================
// DATABASE: AUTO-DETECT SQLite or PostgreSQL
// ============================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"📌 Raw Connection String: '{connectionString}'");

if (!string.IsNullOrEmpty(connectionString) && connectionString.Contains("Host="))
{
    // PostgreSQL (Render)
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString,
            npgsqlOptions => npgsqlOptions.EnableRetryOnFailure())); // Add retry for transient errors
    Console.WriteLine("✅ Using PostgreSQL Database");
}
else
{
    // SQLite (Local)
    var sqliteConnection = connectionString ?? "Data Source=Marketplace.db";
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(sqliteConnection));
    Console.WriteLine("✅ Using SQLite Database (Local)");
}

// JWT Authentication
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "ThisIsASuperSecretKeyWithAtLeast32CharactersLongForJWT!");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// ============================================================
// SWAGGER: ENABLED FOR ALL ENVIRONMENTS (FIXES 404)
// ============================================================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Prime Marketplace API V1");
    c.RoutePrefix = "swagger";
});

// ============================================================
// DISABLE HTTPS REDIRECTION ON PRODUCTION (Render)
// ============================================================
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ============================================================
// AUTO-MIGRATION: Creates/Updates the database on startup
// ============================================================
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
        Console.WriteLine("✅ Database migrations applied successfully.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Database migration failed: {ex.Message}");
    Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
    // Log full stack trace for debugging
    Console.WriteLine($"Stack Trace: {ex.StackTrace}");
}

// ============================================================
// BIND TO PORT PROVIDED BY RENDER
// ============================================================
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Marketplace.Infrastructure.Data;
using Marketplace.Application.Interfaces;
using Marketplace.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// 1. Add Controllers
// ============================================================
builder.Services.AddControllers();

// ============================================================
// 2. CORS – Allow Any Origin
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// ============================================================
// 3. Memory Cache
// ============================================================
builder.Services.AddMemoryCache();

// ============================================================
// 4. Swagger / OpenAPI (JWT enabled)
// ============================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
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

// ============================================================
// 5. Register Services (DI)
// ============================================================
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IStoreSettingService, StoreSettingService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IChatService, ChatService>();

// ============================================================
// 6. Database Context (SQLite local / PostgreSQL on Render)
// ============================================================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (builder.Environment.IsDevelopment() && connectionString?.Contains("Data Source") == true)
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

// ============================================================
// 7. JWT Authentication
// ============================================================
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

// ============================================================
// 8. Build the App
// ============================================================
var app = builder.Build();

// ============================================================
// 9. Development Middleware (Swagger)
// ============================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ============================================================
// 10. Security & Routing
// ============================================================
app.UseHttpsRedirection();

// ============================================================
// 11. Manual OPTIONS handling (fixes preflight CORS)
// ============================================================
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        // Using indexer instead of Add to avoid duplicate key warnings
        context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
        context.Response.Headers["Access-Control-Max-Age"] = "86400";
        context.Response.StatusCode = 204;
        return;
    }
    await next();
});

// ============================================================
// 12. Enable CORS
// ============================================================
app.UseCors("AllowAll");

// ============================================================
// 13. Authentication & Authorization
// ============================================================
app.UseAuthentication();
app.UseAuthorization();

// ============================================================
// 14. Map Controllers
// ============================================================
app.MapControllers();

// ============================================================
// 15. Database Migration – BULLETPROOF HANDLER
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // ============================================================
        // Step 1: Check if the 'Orders' table exists
        // ============================================================
        var ordersTableExists = dbContext.Database.ExecuteSqlRaw(
            "SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Orders');") > 0;

        if (ordersTableExists)
        {
            Console.WriteLine("✅ Existing database detected. Preparing migrations...");

            // ============================================================
            // Step 2: Create the migration history table if it doesn't exist
            // ============================================================
            dbContext.Database.ExecuteSqlRaw(
                @"CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
                    ""MigrationId"" TEXT NOT NULL,
                    ""ProductVersion"" TEXT NOT NULL,
                    CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY (""MigrationId"")
                );");

            // ============================================================
            // Step 3: Check if the initial migration is already recorded
            // ============================================================
            var initialMigrationId = "20260720092925_InitialCreate";
            var historyRecordExists = dbContext.Database.ExecuteSqlRaw(
                $"SELECT EXISTS (SELECT 1 FROM \"__EFMigrationsHistory\" WHERE \"MigrationId\" = '{initialMigrationId}');") > 0;

            if (!historyRecordExists)
            {
                Console.WriteLine($"⚠️ Initial migration '{initialMigrationId}' not recorded. Inserting now...");

                // Insert the migration record using raw SQL (this is guaranteed to work)
                dbContext.Database.ExecuteSqlRaw(
                    $"INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ('{initialMigrationId}', '8.0.0');");

                Console.WriteLine("✅ Initial migration marked as applied.");
            }
            else
            {
                Console.WriteLine("✅ Initial migration already recorded.");
            }
        }
        else
        {
            Console.WriteLine("🆕 Fresh database. Migrations will be applied normally.");
        }

        // ============================================================
        // Step 4: Apply all pending migrations
        // ============================================================
        dbContext.Database.Migrate();
        Console.WriteLine("✅ All migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database migration error: {ex.Message}");
        throw;
    }
}

// ============================================================
// 16. Run the App
// ============================================================
app.Run();
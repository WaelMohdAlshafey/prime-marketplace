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
// 15. Database Migration – SELF-HEALING (No Shell Needed)
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var connection = dbContext.Database.GetDbConnection();

    try
    {
        connection.Open();

        // ------------------------------------------------------------
        // Step 1: Check if Orders table exists
        // ------------------------------------------------------------
        using (var command1 = connection.CreateCommand())
        {
            command1.CommandText = "SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Orders');";
            var result = command1.ExecuteScalar();
            var ordersTableExists = result != null && (bool)result;

            if (ordersTableExists)
            {
                Console.WriteLine("✅ Existing database detected. Checking for missing columns...");

                // ------------------------------------------------------------
                // Step 2: Add missing columns (if they don't exist)
                // ------------------------------------------------------------

                // 2a. Check and add CurrentStatus
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'CurrentStatus');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'CurrentStatus' column to Orders...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Orders\" ADD COLUMN \"CurrentStatus\" TEXT DEFAULT 'Pending';";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'CurrentStatus' column added.");
                    }
                }

                // 2b. Check and add TrackingNumber
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'TrackingNumber');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'TrackingNumber' column to Orders...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Orders\" ADD COLUMN \"TrackingNumber\" TEXT;";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'TrackingNumber' column added.");
                    }
                }

                // 2c. Check and add ShippingCarrier
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'ShippingCarrier');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'ShippingCarrier' column to Orders...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Orders\" ADD COLUMN \"ShippingCarrier\" TEXT;";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'ShippingCarrier' column added.");
                    }
                }

                // 2d. Check and add ShippedAt
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'ShippedAt');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'ShippedAt' column to Orders...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Orders\" ADD COLUMN \"ShippedAt\" TIMESTAMP;";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'ShippedAt' column added.");
                    }
                }

                // 2e. Check and add DeliveredAt
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'DeliveredAt');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'DeliveredAt' column to Orders...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Orders\" ADD COLUMN \"DeliveredAt\" TIMESTAMP;";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'DeliveredAt' column added.");
                    }
                }

                // 2f. Check and add Rating to Products (if missing)
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'Rating');";
                    var columnExists = commandCheck.ExecuteScalar();
                    if (columnExists == null || !(bool)columnExists)
                    {
                        Console.WriteLine("⚠️ Adding 'Rating' column to Products...");
                        using (var commandAdd = connection.CreateCommand())
                        {
                            commandAdd.CommandText = "ALTER TABLE \"Products\" ADD COLUMN \"Rating\" DOUBLE PRECISION;";
                            commandAdd.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ 'Rating' column added.");
                    }
                }

                // ------------------------------------------------------------
                // Step 3: Ensure __EFMigrationsHistory table exists
                // ------------------------------------------------------------
                using (var commandHistory = connection.CreateCommand())
                {
                    commandHistory.CommandText = @"
                        CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
                            ""MigrationId"" TEXT NOT NULL,
                            ""ProductVersion"" TEXT NOT NULL,
                            CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY (""MigrationId"")
                        );";
                    commandHistory.ExecuteNonQuery();
                }

                // ------------------------------------------------------------
                // Step 4: Mark the initial migration as applied if not already
                // ------------------------------------------------------------
                using (var commandCheck = connection.CreateCommand())
                {
                    commandCheck.CommandText = "SELECT EXISTS (SELECT 1 FROM \"__EFMigrationsHistory\" WHERE \"MigrationId\" = '20260720092925_InitialCreate');";
                    var historyExists = commandCheck.ExecuteScalar();
                    if (historyExists == null || !(bool)historyExists)
                    {
                        Console.WriteLine("⚠️ Initial migration not recorded. Inserting...");
                        using (var commandInsert = connection.CreateCommand())
                        {
                            commandInsert.CommandText = "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ('20260720092925_InitialCreate', '8.0.0');";
                            commandInsert.ExecuteNonQuery();
                        }
                        Console.WriteLine("✅ Initial migration marked as applied.");
                    }
                    else
                    {
                        Console.WriteLine("✅ Initial migration already recorded.");
                    }
                }

                Console.WriteLine("✅ All columns verified and added if needed.");
            }
            else
            {
                Console.WriteLine("🆕 Fresh database. Migrations will be applied normally.");
            }
        }

        // ------------------------------------------------------------
        // Step 6: Now run Migrate() – it should only apply what's needed
        // ------------------------------------------------------------
        dbContext.Database.Migrate();
        Console.WriteLine("✅ All migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database migration error: {ex.Message}");
        throw;
    }
    finally
    {
        if (connection.State == System.Data.ConnectionState.Open)
            connection.Close();
        connection.Dispose();
    }
}

// ============================================================
// 16. Run the App
// ============================================================
app.Run();
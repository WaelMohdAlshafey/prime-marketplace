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
// 2. Add CORS (official middleware)
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// ============================================================
// 3. Add Memory Cache
// ============================================================
builder.Services.AddMemoryCache();

// ============================================================
// 4. Add Swagger/OpenAPI (with JWT support)
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
// 5. Register Application Services (Dependency Injection)
// ============================================================
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IStoreSettingService, StoreSettingService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IProductSuggestionService, ProductSuggestionService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<IGoldenLinkService, GoldenLinkService>();

// ============================================================
// 6. Database Context – with Retry & Detailed Logging
// ============================================================
builder.Services.AddDbContext<AppDbContext>((serviceProvider, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (!string.IsNullOrEmpty(connectionString))
    {
        var masked = System.Text.RegularExpressions.Regex.Replace(connectionString, "Password=([^;]+)", "Password=***");
        Console.WriteLine($"🔌 Database connection string (masked): {masked}");
    }
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null);
    });
    options.EnableSensitiveDataLogging();
    options.EnableDetailedErrors();
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
// 10. Security & Routing – Conditional HTTPS Redirection
// ============================================================
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// ============================================================
// 11. CORS – MUST BE BEFORE AUTH
// ============================================================
app.UseCors("AllowAll");

// ============================================================
// 12. FALLBACK CORS MIDDLEWARE – Sets headers for every request
// ============================================================
app.Use(async (context, next) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin";

    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 204;
        return;
    }

    await next();
});

// ============================================================
// 13. Request Logging Middleware (helps debug)
// ============================================================
app.Use(async (context, next) =>
{
    Console.WriteLine($"📝 {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"📝 Response: {context.Response.StatusCode}");
});

// ============================================================
// 14. Serve static files (product images, etc.)
// ============================================================
app.UseStaticFiles();

// ============================================================
// 15. Authentication & Authorization
// ============================================================
app.UseAuthentication();
app.UseAuthorization();

// ============================================================
// 16. Map Controllers
// ============================================================
app.MapControllers();

// ============================================================
// 17. Additional Endpoints
// ============================================================
app.MapGet("/db-test", async (AppDbContext dbContext) =>
{
    try
    {
        var result = await dbContext.Database.ExecuteSqlRawAsync("SELECT 1");
        return Results.Ok(new { connected = true, result });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { connected = false, error = ex.Message });
    }
});

app.MapGet("/", () => "Prime Marketplace API is running!");
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// ============================================================
// 18. Database Migration – Apply pending migrations
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("✅ Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database migration error: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

// ============================================================
// 19. Run the App
// ============================================================
app.Run();
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
// 2. Add CORS – Allow Any Origin (For Vercel and local testing)
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
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
// 6. Database Context (SQLite locally, PostgreSQL on Render/Supabase)
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
// 10. Security & Routing – Conditional HTTPS Redirection
// ============================================================
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
// In production (Render), HTTPS is terminated at the load balancer,
// so we skip UseHttpsRedirection to avoid the warning.

// ============================================================
// 11. Custom Middleware: Force CORS Headers on Every Response
//     (This guarantees headers even if the request fails early)
// ============================================================
app.Use(async (context, next) =>
{
    // Set headers unconditionally
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";

    // For preflight requests, return 204 immediately
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 204;
        return;
    }

    await next();
});

// ============================================================
// 12. Enable CORS Middleware (handles the rest, but we already set headers)
// ============================================================
app.UseCors("AllowAll");

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
// 14. Authentication & Authorization
// ============================================================
app.UseAuthentication();
app.UseAuthorization();

// ============================================================
// 15. Map Controllers
// ============================================================
app.MapControllers();

// ============================================================
// 16. Root Route – Fixes 404 on "/"
// ============================================================
app.MapGet("/", () => "Prime Marketplace API is running!");

// ============================================================
// 17. Health Check Endpoint (for Render monitoring)
// ============================================================
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
        // Don't throw - allow app to start even if migration fails
    }
}

// ============================================================
// 19. Run the App
// ============================================================
app.Run();
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
builder.Services.AddScoped<IStoreSettingService, StoreSettingService>(); // <-- ADDED THIS

// ============================================================
// 6. Database Context (SQLite locally, PostgreSQL on Render)
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
// 11. Enable CORS (MUST be placed between UseHttpsRedirection and UseAuthentication)
// ============================================================
app.UseCors("AllowAll");

// ============================================================
// 12. Authentication & Authorization
// ============================================================
app.UseAuthentication();
app.UseAuthorization();

// ============================================================
// 13. Map Controllers
// ============================================================
app.MapControllers();

// ============================================================
// 14. Database Initialisation – EnsureCreated (safe for existing DB)
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        var created = dbContext.Database.EnsureCreated();
        if (created)
        {
            Console.WriteLine("✅ Database created successfully.");
        }
        else
        {
            Console.WriteLine("✅ Database already exists. Skipping migrations.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database initialisation error: {ex.Message}");
        throw;
    }
}

// ============================================================
// 15. Run the App
// ============================================================
app.Run();
using Microsoft.EntityFrameworkCore;
using ModuleRegistryApi.Data;
using ModuleRegistryApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");


// GET ALL ACTIVE MODULES
app.MapGet("/api/modules", async (ApplicationDbContext db) =>
{
    // Return ONLY active modules for security (so we don't expose manifest URLs of disabled modules)
    return await db.Modules
        .Where(x => x.IsActive)
        .OrderBy(x => x.DisplayOrder)
        .ToListAsync();
});

// GET ALL MODULES (INCLUDING INACTIVE - FOR MAINTENANCE)
app.MapGet("/api/modules/all", async (ApplicationDbContext db) =>
{
    return await db.Modules
        .OrderBy(x => x.DisplayOrder)
        .ToListAsync();
});


// GET MODULE BY ID
app.MapGet("/api/modules/{id:guid}", async (Guid id, ApplicationDbContext db) =>
{
    var module = await db.Modules.FindAsync(id);

    return module is null
        ? Results.NotFound()
        : Results.Ok(module);
});


// CREATE MODULE
app.MapPost("/api/modules", async (Module module, ApplicationDbContext db) =>
{
    module.Id = Guid.NewGuid();
    module.CreatedAt = DateTime.UtcNow;
    module.UpdatedAt = DateTime.UtcNow;

    db.Modules.Add(module);

    await db.SaveChangesAsync();

    return Results.Created($"/api/modules/{module.Id}", module);
});


// UPDATE MODULE
app.MapPut("/api/modules/{id:guid}", async (
    Guid id,
    Module updatedModule,
    ApplicationDbContext db) =>
{
    var module = await db.Modules.FindAsync(id);

    if (module is null)
        return Results.NotFound();

    module.Name = updatedModule.Name;
    module.DisplayName = updatedModule.DisplayName;
    module.Description = updatedModule.Description;
    module.Route = updatedModule.Route;
    module.ManifestUrl = updatedModule.ManifestUrl;
    module.ExposedModule = updatedModule.ExposedModule;
    module.Icon = updatedModule.Icon;
    module.IsActive = updatedModule.IsActive;
    module.DisplayOrder = updatedModule.DisplayOrder;
    module.MaintenanceMessage = updatedModule.MaintenanceMessage;
    module.PermissionName = updatedModule.PermissionName;
    module.IsLocal = updatedModule.IsLocal;
    module.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(module);
});


// ENABLE / DISABLE MODULE
app.MapPatch("/api/modules/{id:guid}/status", async (
    Guid id,
    ModuleStatusUpdate update,
    ApplicationDbContext db) =>
{
    var module = await db.Modules.FindAsync(id);

    if (module is null)
        return Results.NotFound();

    module.IsActive = update.IsActive;
    module.MaintenanceMessage = update.MaintenanceMessage;
    module.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(module);
});


// DELETE MODULE
app.MapDelete("/api/modules/{id:guid}", async (
    Guid id,
    ApplicationDbContext db) =>
{
    var module = await db.Modules.FindAsync(id);

    if (module is null)
        return Results.NotFound();

    db.Modules.Remove(module);

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

public record ModuleStatusUpdate(bool IsActive, string MaintenanceMessage);
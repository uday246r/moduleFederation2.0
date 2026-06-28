namespace ModuleRegistryApi.Models;

public class Module
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;
    
    public string DisplayName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Route { get; set; } = string.Empty;

    public string ManifestUrl { get; set; } = string.Empty;

    public string ExposedModule { get; set; } = "./App";

    public string Icon { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string MaintenanceMessage { get; set; } = string.Empty;

    public string PermissionName { get; set; } = string.Empty;

    public bool IsLocal { get; set; } = false;
}
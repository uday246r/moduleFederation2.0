const modules = [
    { name: "employee_mf", displayName: "Employees", description: "Employee Management Module", route: "/employees", manifestUrl: "http://localhost:5001/remoteEntry.js", exposedModule: "./EmployeeApp", icon: "users", isActive: true, displayOrder: 2, permissionName: "EmployeeModule", isLocal: false },
    { name: "inventory", displayName: "Inventory", description: "Inventory Management Module", route: "/inventory", manifestUrl: "http://localhost:5002/remoteEntry.js", exposedModule: "./AppRoutes", icon: "inventory", isActive: true, displayOrder: 3, permissionName: "InventoryModule", isLocal: false },
    { name: "asset_management", displayName: "Assets", description: "Asset Management Module", route: "/assets", manifestUrl: "http://localhost:5003/remoteEntry.js", exposedModule: "./AssetApp", icon: "assets", isActive: true, displayOrder: 4, permissionName: "AssetModule", isLocal: false },
    { name: "helpdesk", displayName: "Helpdesk", description: "Helpdesk Module", route: "/helpdesk", manifestUrl: "http://localhost:5004/remoteEntry.js", exposedModule: "./HelpdeskApp", icon: "helpdesk", isActive: true, displayOrder: 5, permissionName: "HelpdeskModule", isLocal: false }
];

async function seed() {
    for (const m of modules) {
        try {
            const res = await fetch("http://localhost:5137/api/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(m)
            });
            console.log(`Seeded ${m.name}: ${res.status}`);
        } catch (e) {
            console.error(`Error seeding ${m.name}:`, e);
        }
    }
}
seed();

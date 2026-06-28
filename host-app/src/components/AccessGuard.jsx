import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function AccessGuard({ moduleName, permissionName, remoteModule, children }) {
    const [loading, setLoading] = useState(true);
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [maintenanceMsg, setMaintenanceMsg] = useState("");
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        setLoading(true);
        setIsMaintenance(false);
        setHasAccess(false);
        setMaintenanceMsg("");

        const checkAccess = async () => {
            try {
                const targetPermName = permissionName || moduleName;

                // 1. Check Module Status
                let isModuleActive = true;
                let msg = "";

                if (remoteModule) {
                    isModuleActive = remoteModule.isActive;
                    msg = remoteModule.maintenanceMessage;
                } else {
                    // Fallback: Check registry API directly for real-time status if no object passed
                    const registryRes = await fetch("http://localhost:5137/api/modules/all");
                    if (registryRes.ok) {
                        const modules = await registryRes.json();
                        const mod = modules.find(m => m.name.toLowerCase() === moduleName.toLowerCase());
                        if (mod) {
                            isModuleActive = mod.isActive;
                            msg = mod.maintenanceMessage;
                        }
                    }
                }

                if (!isModuleActive) {
                    setIsMaintenance(true);
                    setMaintenanceMsg(msg || "This module is currently disabled by the registry.");
                    setLoading(false);
                    return;
                }
                // 2. Check Permissions
                const user = await getCurrentUser();
                if (!user) {
                    setHasAccess(false);
                    setLoading(false);
                    return;
                }
                const userId = user.id;
                const permRes = await fetch(`http://localhost:5005/api/access/userpermissions/${userId}`);
                if (permRes.ok) {
                    const permissions = await permRes.json();
                    // Must have a 'View' (or '*') action for the target module (or '*')
                    const hasPerm = permissions.some(p => 
                        (p.moduleName.toLowerCase() === targetPermName.toLowerCase() || p.moduleName === "*") &&
                        (p.action.toLowerCase() === "view" || p.action === "*")
                    );

                    setHasAccess(hasPerm);
                } else {
                    setHasAccess(false);
                }
            } catch (err) {
                console.error("Access Check Failed:", err);
                // On error, fail safe to deny access
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [moduleName, permissionName, remoteModule]);

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading access rights...</div>;
    }

    if (isMaintenance) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                <h2>Module Under Maintenance</h2>
                <p>{maintenanceMsg}</p>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access the <strong>{moduleName}</strong> module.</p>
            </div>
        );
    }

    return children;
}

export default AccessGuard;

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import { removeToken, getCurrentUser } from "../utils/auth";
import { getModules } from "../services/moduleRegistry";

const iconMap = {
    users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    assets: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    helpdesk: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    default: "M4 6h16M4 12h16M4 18h16"
};

function Sidebar() {
  const location = useLocation();
  const [permissions, setPermissions] = useState([]);

  const [navItemsData, setNavItemsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const userId = user.id;

        const permRes = await fetch(`http://localhost:5005/api/access/userpermissions/${userId}`);
        if (permRes.ok) {
          const data = await permRes.json();
          setPermissions(data);
        }

        const modules = await getModules();
        const mappedModules = modules.map(m => ({
          name: m.displayName || m.name,
          path: m.route,
          icon: iconMap[m.icon] || iconMap.default,
          moduleName: m.permissionName || m.exposedModule.replace('./', '')
        }));
        setNavItemsData(mappedModules);

      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    removeToken();
    window.location.href = "/";
  };

  // Filter items based on fetched permissions
  const navItems = navItemsData.filter(item => {
    // Everyone sees Dashboard for now unless you want it protected too
    if (item.name === "Dashboard") return true;
    
    // Check if the current user has the 'View' (or '*') permission mapped to this moduleName
    return permissions.some(p => 
      (p.moduleName.toLowerCase() === item.moduleName.toLowerCase() || p.moduleName === "*") &&
      (p.action.toLowerCase() === "view" || p.action === "*")
    );
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">E</div>
        <h2>Enterprise</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname.startsWith(item.path) ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon}></path>
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
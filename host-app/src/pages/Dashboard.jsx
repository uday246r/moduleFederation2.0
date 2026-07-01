import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const iconMap = {
  users:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",

  inventory:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

  assets:
    "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",

  helpdesk:
    "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
};

function Dashboard() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);



  async function fetchModules() {
    try {
      const { data } = await axios.get(
        "http://localhost:5137/api/modules"
      );

      const sorted = data.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );

      setApps(sorted);
    } catch (err) {
      console.error("Unable to fetch modules", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchModules();
  }, []);

  if (loading) {
    return <h2>Loading Modules...</h2>;
  }

  return (
    <div className="dashboard-container">
      <div className="modules-section">
        <div className="section-title">
          <h2>Enterprise Modules</h2>
          <p>Access your integrated applications below</p>
        </div>

        <div className="dashboard-grid">
          {apps.map((app) => (
            <div
              key={app.name}
              className={`dashboard-card ${
                app.isActive ? "active-card" : "inactive-card"
              }`}
              onClick={() => app.isActive && navigate(app.route)}
            >
              <div className="card-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconMap[app.icon]} />
                </svg>
              </div>

              <div className="card-content">
                <h2>{app.displayName}</h2>
                <p>{app.description}</p>
              </div>

              {!app.isActive && (
                <span className="coming-soon">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
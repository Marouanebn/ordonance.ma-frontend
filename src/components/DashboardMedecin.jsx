import React, { useEffect, useState } from "react";
import SidebarMedecin from "./SidebarMedecin.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import "./topbar.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Package, Archive, Users, UserCheck } from "lucide-react";
import Footer from "./Footer.jsx"; // adjust path if needed
import api from "../lib/api";

const DashboardMedecin = () => {
  const [roleMessage, setRoleMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const msg = localStorage.getItem("roleMessage");
    if (msg) {
      setRoleMessage(msg);
      localStorage.removeItem("roleMessage");
    }
    setLoadingStats(true);
    api.get("/stats/medecin").then(res => {
      setStats(res.data);
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, []);

  const lineData = [
    { name: "May", value: 5 },
    { name: "Jun", value: 20 },
    { name: "Jul", value: 28 },
    { name: "Aug", value: 32 },
    { name: "Sep", value: 45 },
    { name: "Oct", value: 45 },
    { name: "Nov", value: 55 },
  ];

  const pieData = [
    { name: "Lab 1", value: 15 },
    { name: "Lab 2", value: 33 },
    { name: "Lab 3", value: 20 },
    { name: "Lab 4", value: 32 },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#0ea5e9", "#f59e0b"];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarMedecin
        onMenuSelect={(key) => setShowSettings(key === "settings")}
        onNavigate={() => setShowSettings(false)}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
        <Topbar title="Tableau de bord Médecin" />

        <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
          {showSettings ? (
            <SettingsPage />
          ) : (
            <>
              {roleMessage && (
                <div style={{ marginBottom: 20, fontWeight: "bold", color: "#2563eb", fontSize: 22 }}>
                  {roleMessage}
                </div>
              )}

              {/* ✅ Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ marginBottom: 10 }}><Package size={24} color="#22c55e" /></div>
                  <p>Total ordonnances</p>
                  <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.totalOrdonnances ?? '-'}</h2>
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ marginBottom: 10 }}><Archive size={24} color="#ef4444" /></div>
                  <p>Ordonnances archivées</p>
                  <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.archivedOrdonnances ?? '-'}</h2>
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ marginBottom: 10 }}><Users size={24} color="#22c55e" /></div>
                  <p>Nombre de patients</p>
                  <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.nombrePatients ?? '-'}</h2>
                </div>
              </div>
              {/* 📊 Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                {/* Line Chart */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ marginBottom: 20 }}>Ordonnances par mois</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats?.charts?.ordonnancesByMonth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ marginBottom: 20 }}>Genre des patients</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats?.charts?.repartition || []}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      />
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />

      </div>
    </div>
  );
};

export default DashboardMedecin;

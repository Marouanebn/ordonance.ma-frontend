import React, { useEffect, useState } from "react";
import SidebarPatient from "./SidebarPatient.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import MesOrdonnancesPatientPage from "./patient/MesOrdonnancesPatientPage.jsx";
import "./topbar.css";
import Footer from "./Footer.jsx";
import api from "../lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const DashboardPatient = () => {
    const [roleMessage, setRoleMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showOrdonnances, setShowOrdonnances] = useState(false);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    useEffect(() => {
        const msg = localStorage.getItem("roleMessage");
        if (msg) {
            setRoleMessage(msg);
            localStorage.removeItem("roleMessage");
        }
        setLoadingStats(true);
        api.get("/stats/patient").then(res => {
            setStats(res.data);
            setLoadingStats(false);
        }).catch(() => setLoadingStats(false));
    }, []);
    const handleMenuSelect = (key) => {
        setShowSettings(key === 'settings');
        setShowOrdonnances(key === 'ordonnances');
    };
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SidebarPatient onMenuSelect={handleMenuSelect} onNavigate={() => { setShowSettings(false); setShowOrdonnances(false); }} activeKey={showSettings ? 'settings' : showOrdonnances ? 'ordonnances' : 'dashboard'} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
                <Topbar title="Tableau de bord Patient" />
                <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
                    {showSettings ? (
                        <SettingsPage />
                    ) : showOrdonnances ? (
                        <MesOrdonnancesPatientPage />
                    ) : (
                        <>
                            {roleMessage && (
                                <div style={{ marginBottom: 20, fontWeight: 'bold', color: '#2563eb', fontSize: 22 }}>
                                    {roleMessage}
                                </div>
                            )}

                            {/* ✅ Summary Cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="ordonnance">📄</span></div>
                                    <p>Total ordonnances</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.totalOrdonnances ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>+2 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="archive">🗄️</span></div>
                                    <p>Ordonnances archivées</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.archivedOrdonnances ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#ef4444" }}>-1 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="medecin">🧑‍⚕️</span></div>
                                    <p>Médecins consultés</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.medecinsConsultes ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>+1 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="pharmacie">🏥</span></div>
                                    <p>Pharmacies visitées</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.pharmaciesVisitees ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>Stable</span>
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
                                    <h3 style={{ marginBottom: 20 }}>Répartition par médecin</h3>
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
export default DashboardPatient; 
import React, { useEffect, useState } from "react";
import SidebarPharmacien from "./SidebarPharmacien.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import OrdonnanceValidationPharmacienPage from "./pharmacien/OrdonnanceValidationPharmacienPage.jsx";
import "./topbar.css";
import api from "../lib/api";
import Footer from "./Footer.jsx"; // adjust path if needed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";


const DashboardPharmacien = () => {
    const [roleMessage, setRoleMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showValider, setShowValider] = useState(false);
    const [showValidated, setShowValidated] = useState(false);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    useEffect(() => {
        const msg = localStorage.getItem("roleMessage");
        if (msg) {
            setRoleMessage(msg);
            localStorage.removeItem("roleMessage");
        }
        setLoadingStats(true);
        api.get("/stats/pharmacien").then(res => {
            setStats(res.data);
            setLoadingStats(false);
        }).catch(() => setLoadingStats(false));
    }, []);

    // Inline component for displaying validated ordonnances
    const ValidatedOrdonnancesPharmacienPage = () => {
        const [ordonnances, setOrdonnances] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        useEffect(() => {
            setLoading(true);
            setError("");
            api.get("/pharmacien/ordonnances/validated")
                .then(res => {
                    setOrdonnances(res.data.data || []);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erreur lors du chargement des ordonnances.");
                    setLoading(false);
                });
        }, []);
        return (
            <div style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
                <h2 style={{ textAlign: "center", marginBottom: 24 }}>Ordonnances validées</h2>
                {loading && <div>Chargement...</div>}
                {error && <div style={{ color: "#dc3545" }}>{error}</div>}
                {!loading && ordonnances.length === 0 && <div>Aucune ordonnance validée trouvée.</div>}
                {!loading && ordonnances.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
                        <thead>
                            <tr style={{ background: "#f5f5f5" }}>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Date</th>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Patient</th>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Médecin</th>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Médicaments</th>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Détail</th>
                                <th style={{ padding: 10, border: "1px solid #eee" }}>Validé par</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordonnances.map(ord => (
                                <tr key={ord.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: 10 }}>{new Date(ord.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: 10 }}>{ord.patient?.user?.name || ord.patient?.nom_complet || '-'}</td>
                                    <td style={{ padding: 10 }}>{ord.medecin?.user?.name || "-"}</td>
                                    <td style={{ padding: 10 }}>
                                        {ord.medicaments && ord.medicaments.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {ord.medicaments.map(med => (
                                                    <li key={med.id}>{med.nom} {med.pivot?.quantite ? `(x${med.pivot.quantite})` : ''}</li>
                                                ))}
                                            </ul>
                                        ) : "-"}
                                    </td>
                                    <td style={{ padding: 10 }}>{ord.detail || ord.remarques || "-"}</td>
                                    <td style={{ padding: 10 }}>{ord.validatedByPharmacie?.nom_pharmacie || ord.validatedByPharmacie?.user?.name || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SidebarPharmacien
                onMenuSelect={key => { setShowSettings(key === 'settings'); setShowValider(key === 'valider'); setShowValidated(key === 'validated'); }}
                activeKey={showSettings ? 'settings' : showValider ? 'valider' : showValidated ? 'validated' : 'dashboard'}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 260 }}>
                <Topbar title="Tableau de bord Pharmacien" />
                <div style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9" }}>
                    {showSettings ? (
                        <SettingsPage />
                    ) : showValider ? (
                        <OrdonnanceValidationPharmacienPage />
                    ) : showValidated ? (
                        <ValidatedOrdonnancesPharmacienPage />
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
                                    <p>Total ordonnances traitées</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.totalOrdonnancesTraitees ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>+10 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="validee">✅</span></div>
                                    <p>Ordonnances validées</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.ordonnancesValidees ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>+5 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="patient">🧑‍🤝‍🧑</span></div>
                                    <p>Patients servis</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.patientsServis ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>+2 ce mois</span>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ marginBottom: 10 }}><span role="img" aria-label="pharmacie">🏥</span></div>
                                    <p>Pharmacies partenaires</p>
                                    <h2 style={{ margin: "10px 0" }}>{loadingStats ? '...' : stats?.pharmaciesPartenaires ?? '-'}</h2>
                                    <span style={{ fontSize: 12, color: "#22c55e" }}>Stable</span>
                                </div>
                            </div>

                            {/* 📊 Charts */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                                {/* Line Chart */}
                                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <h3 style={{ marginBottom: 20 }}>Ordonnances traitées par mois</h3>
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
                                    <h3 style={{ marginBottom: 20 }}>Répartition par patient</h3>
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
export default DashboardPharmacien; 
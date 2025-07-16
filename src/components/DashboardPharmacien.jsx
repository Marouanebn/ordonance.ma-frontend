import React, { useEffect, useState } from "react";
import SidebarPharmacien from "./SidebarPharmacien.jsx";
import Topbar from "./Topbar.jsx";
import SettingsPage from "./common/SettingsPage.jsx";
import OrdonnanceValidationPharmacienPage from "./pharmacien/OrdonnanceValidationPharmacienPage.jsx";
import "./topbar.css";
import api from "../lib/api";

const DashboardPharmacien = () => {
    const [roleMessage, setRoleMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showValider, setShowValider] = useState(false);
    const [showValidated, setShowValidated] = useState(false);
    useEffect(() => {
        const msg = localStorage.getItem("roleMessage");
        if (msg) {
            setRoleMessage(msg);
            localStorage.removeItem("roleMessage");
        }
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
            <SidebarPharmacien onMenuSelect={key => { setShowSettings(key === 'settings'); setShowValider(key === 'valider'); setShowValidated(key === 'validated'); }} />
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
                            <h1>Bienvenue Pharmacien</h1>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DashboardPharmacien; 
import React, { useEffect, useState } from "react";
import api from "../../lib/api";

const MesOrdonnancesPatientPage = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/patient/ordonnances")
            .then(res => {
                setOrdonnances(res.data.data?.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors du chargement des ordonnances.");
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
            <h2 style={{ textAlign: "center", marginBottom: 24 }}>Mes Ordonnances</h2>
            {loading && <div>Chargement...</div>}
            {error && <div style={{ color: "#dc3545" }}>{error}</div>}
            {!loading && !error && ordonnances.length === 0 && <div>Aucune ordonnance trouvée.</div>}
            {!loading && !error && ordonnances.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                            <th style={{ padding: 10, border: "1px solid #eee" }}>Date</th>
                            <th style={{ padding: 10, border: "1px solid #eee" }}>Statut</th>
                            <th style={{ padding: 10, border: "1px solid #eee" }}>Médecin</th>
                            <th style={{ padding: 10, border: "1px solid #eee" }}>Médicaments</th>
                            <th style={{ padding: 10, border: "1px solid #eee" }}>Détail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordonnances.map(ord => (
                            <tr key={ord.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: 10 }}>{new Date(ord.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: 10 }}>{ord.status || '-'}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MesOrdonnancesPatientPage; 
import React, { useState } from "react";
import api from "../../lib/api";

const OrdonnanceValidationPharmacienPage = () => {
    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [ordonnances, setOrdonnances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validatingId, setValidatingId] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setSelectedPatient(null);
        setOrdonnances([]);
        try {
            const res = await api.get(`/pharmacien/patients/search?query=${encodeURIComponent(query)}`);
            setPatients(res.data.data.data || []);
        } catch (err) {
            setError("Aucun patient trouvé.");
            setPatients([]);
        }
        setLoading(false);
    };

    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        setOrdonnances([]);
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await api.get(`/pharmacien/patients/${patient.id}/ordonnances`);
            setOrdonnances(res.data.data.data || []);
        } catch (err) {
            setError("Erreur lors du chargement des ordonnances.");
        }
        setLoading(false);
    };

    const handleValidate = async (ordonnanceId) => {
        setValidatingId(ordonnanceId);
        setError("");
        setSuccess("");
        try {
            await api.put(`/pharmacien/ordonnances/${ordonnanceId}/status`, { status: "validated" });
            setSuccess("Ordonnance validée avec succès.");
            // Refresh ordonnances
            if (selectedPatient) {
                const res = await api.get(`/pharmacien/patients/${selectedPatient.id}/ordonnances`);
                setOrdonnances(res.data.data.data || []);
            }
        } catch (err) {
            setError("Erreur lors de la validation de l'ordonnance.");
        }
        setValidatingId(null);
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
            <h2 style={{ textAlign: "center", marginBottom: 24 }}>Validation des Ordonnances</h2>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <input
                    type="text"
                    placeholder="Nom ou ID du patient"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 300 }}
                />
                <button type="submit" className="btn btn-primary">Rechercher</button>
            </form>
            {loading && <div>Chargement...</div>}
            {error && <div style={{ color: "#dc3545" }}>{error}</div>}
            {success && <div style={{ color: "#198754" }}>{success}</div>}
            {!loading && patients.length > 0 && !selectedPatient && (
                <div style={{ marginBottom: 24 }}>
                    <h5>Résultats :</h5>
                    <ul>
                        {patients.map(p => (
                            <li key={p.id} style={{ marginBottom: 8 }}>
                                <button className="btn btn-link" onClick={() => handleSelectPatient(p)}>
                                    {p.user?.name || p.nom_complet} (ID: {p.id})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedPatient && (
                <div>
                    <h4>Ordonnances actives de {selectedPatient.user?.name || selectedPatient.nom_complet} (ID: {selectedPatient.id})</h4>
                    {ordonnances.length === 0 ? (
                        <div>Aucune ordonnance active trouvée.</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
                            <thead>
                                <tr style={{ background: "#f5f5f5" }}>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Date</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Statut</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Médecin</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Médicaments</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Détail</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Validé par</th>
                                    <th style={{ padding: 10, border: "1px solid #eee" }}>Action</th>
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
                                        <td style={{ padding: 10 }}>{ord.validatedByPharmacie?.nom_pharmacie || '-'}</td>
                                        <td style={{ padding: 10 }}>
                                            {ord.status === 'active' && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleValidate(ord.id)}
                                                    disabled={validatingId === ord.id}
                                                >
                                                    {validatingId === ord.id ? 'Validation...' : 'Valider'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <button className="btn btn-secondary mt-3" onClick={() => { setSelectedPatient(null); setOrdonnances([]); setSuccess(""); setError(""); }}>Retour</button>
                </div>
            )}
        </div>
    );
};

export default OrdonnanceValidationPharmacienPage; 
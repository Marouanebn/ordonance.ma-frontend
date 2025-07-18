import React, { useState } from "react";
import api from "../../lib/api";
import { CheckCircle, Loader2, Download } from "lucide-react";
import "./ordonnance-pharmacien.css";


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
        <div className="ordonnance-container">
            <h2 className="ordonnance-title">Validation des Ordonnances</h2>

            <form onSubmit={handleSearch} className="ordonnance-search-form">
                <input
                    type="text"
                    placeholder="Nom ou ID du patient"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="form-control"
                />
                <button type="submit" className="btn btn-primary">Rechercher</button>
            </form>

            {loading && <div>Chargement...</div>}
            {error && <div className="ordonnance-error">{error}</div>}
            {success && <div className="ordonnance-success">{success}</div>}

            {!loading && patients.length > 0 && !selectedPatient && (
                <div className="ordonnance-result">
                    <h5>Résultats :</h5>
                    <ul>
                        {patients.map(p => (
                            <li key={p.id}>
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
                    <h4 className="ordonnance-subtitle">
                        Ordonnances actives de {selectedPatient.user?.name || selectedPatient.nom_complet} (ID: {selectedPatient.id})
                    </h4>

                    {ordonnances.length === 0 ? (
                        <div>Aucune ordonnance active trouvée.</div>
                    ) : (
                        <table className="ordonnance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Médecin</th>
                                    <th>Médicaments</th>
                                    <th>Détail</th>
                                    <th>Validé par</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordonnances.map(ord => (
                                    <tr key={ord.id}>
                                        <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                                        <td>{ord.status || '-'}</td>
                                        <td>{ord.medecin?.user?.name || "-"}</td>
                                        <td>
                                            {ord.medicaments && ord.medicaments.length > 0 ? (
                                                <ul>
                                                    {ord.medicaments.map(med => (
                                                        <li key={med.id}>
                                                            {med.nom} {med.pivot?.quantite ? `(x${med.pivot.quantite})` : ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : "-"}
                                        </td>
                                        <td>{ord.detail || ord.remarques || "-"}</td>
                                        <td>{ord.validatedByPharmacie?.nom_pharmacie || '-'}</td>
                                        <td>
                                            {ord.status === 'active' && (
                                                <button
                                                    className="ordonnance-icon-button"
                                                    onClick={() => handleValidate(ord.id)}
                                                    disabled={validatingId === ord.id}
                                                    title="Valider"
                                                >
                                                    {validatingId === ord.id ? (
                                                        <Loader2 className="loading-spinner" />
                                                    ) : (
                                                        <CheckCircle />
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => {
                            setSelectedPatient(null);
                            setOrdonnances([]);
                            setSuccess("");
                            setError("");
                        }}
                    >
                        Retour
                    </button>
                </div>
            )}

        </div>
    );
};

export default OrdonnanceValidationPharmacienPage;

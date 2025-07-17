import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import './create-ordonance-page.css';

const CreateOrdonancePage = () => {
    const [patients, setPatients] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [form, setForm] = useState({
        patient_id: '',
        medicaments: [],
        date_prescription: '',
        detail: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [patRes, medRes] = await Promise.all([
                api.get('/patients'),
                api.get('/medicaments'),
            ]);
            setPatients(Array.isArray(patRes.data.data) ? patRes.data.data : []);
            setMedicaments(Array.isArray(medRes.data.data?.data) ? medRes.data.data.data : []);
        } catch (err) {
            setError('Erreur lors du chargement des données.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleMedicamentChange = (idx, field, value) => {
        setForm((prev) => {
            const meds = [...prev.medicaments];
            meds[idx][field] = value;
            return { ...prev, medicaments: meds };
        });
    };

    const addMedicament = () => {
        setForm((prev) => ({
            ...prev,
            medicaments: [...prev.medicaments, { medicament_id: '', quantite: 1 }],
        }));
    };

    const removeMedicament = (idx) => {
        setForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/medecin/ordonnances', {
                patient_id: form.patient_id,
                medicaments: form.medicaments.map(m => ({
                    medicament_id: m.medicament_id,
                    quantite: Number(m.quantite),
                })),
                date_prescription: form.date_prescription,
                detail: form.detail,
            });
            navigate('/medecin/ordonance');
        } catch (err) {
            setError('Erreur lors de la création.');
        }
        setSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarMedecin />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
                <Topbar title="Créer une ordonnance" />
                <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f4f4' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <button
                            className="btn btn-outline-secondary mb-3"
                            onClick={() => navigate('/medecin/ordonance')}
                        >
                            ← Retour
                        </button>
                        <h2 className="mb-4">Créer une ordonnance</h2>
                        {loading ? (
                            <div>Chargement...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                                <div className="mb-3">
                                    <label className="form-label">Patient</label>
                                    <select
                                        name="patient_id"
                                        className="form-control"
                                        value={form.patient_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner un patient</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.user?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Médicaments</label>
                                    {form.medicaments.map((m, idx) => (
                                        <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                                            <select
                                                className="form-control"
                                                value={m.medicament_id}
                                                onChange={e => handleMedicamentChange(idx, 'medicament_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Choisir</option>
                                                {medicaments.map(md => (
                                                    <option key={md.id} value={md.id}>
                                                        {md.nom}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                style={{ maxWidth: '100px' }}
                                                value={m.quantite}
                                                onChange={e => handleMedicamentChange(idx, 'quantite', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeMedicament(idx)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-outline-purple btn-sm mt-2"
                                        onClick={addMedicament}
                                    >
                                        + Ajouter médicament
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Date de prescription</label>
                                    <input
                                        type="date"
                                        name="date_prescription"
                                        className="form-control"
                                        value={form.date_prescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Détail</label>
                                    <textarea
                                        name="detail"
                                        className="form-control"
                                        placeholder="Ex: Prendre 2 comprimés par jour pendant 7 jours"
                                        rows="4"
                                        value={form.detail}
                                        onChange={handleChange}
                                        maxLength={500}
                                    />
                                </div>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrdonancePage;

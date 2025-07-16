import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';

const CreateOrdonancePage = () => {
    const [patients, setPatients] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [form, setForm] = useState({
        patient_id: '',
        medicaments: [], // [{ medicament_id, quantite }]
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
            setPatients([]);
            setMedicaments([]);
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
                <div style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>
                    <h2>Créer une ordonnance</h2>
                    <button className="btn btn-secondary mb-3" onClick={() => navigate('/medecin/ordonance')}>Retour</button>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
                            <div className="mb-2">
                                <label>Patient</label>
                                <select name="patient_id" className="form-control" value={form.patient_id} onChange={handleChange} required>
                                    <option value="">Sélectionner un patient</option>
                                    {Array.isArray(patients) && patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.user?.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label>Médicaments</label>
                                {form.medicaments.map((m, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                        <select className="form-control" value={m.medicament_id} onChange={e => handleMedicamentChange(idx, 'medicament_id', e.target.value)} required>
                                            <option value="">Choisir</option>
                                            {Array.isArray(medicaments) && medicaments.map(md => (
                                                <option key={md.id} value={md.id}>{md.nom}</option>
                                            ))}
                                        </select>
                                        <input type="number" min="1" className="form-control" style={{ width: 80 }} value={m.quantite} onChange={e => handleMedicamentChange(idx, 'quantite', e.target.value)} required />
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMedicament(idx)}>✖</button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-secondary btn-sm" onClick={addMedicament}>+ Ajouter médicament</button>
                            </div>
                            <div className="mb-2">
                                <label>Date de prescription</label>
                                <input type="date" name="date_prescription" className="form-control" value={form.date_prescription} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <label>Détail</label>
                                <textarea name="detail" className="form-control" value={form.detail} onChange={handleChange} maxLength={500} />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateOrdonancePage; 
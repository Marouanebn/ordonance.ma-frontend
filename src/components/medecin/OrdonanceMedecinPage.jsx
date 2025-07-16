import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import { useNavigate } from 'react-router-dom';

const OrdonanceMedecinPage = () => {
    const [ordonnances, setOrdonnances] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        patient_id: '',
        medicaments: [], // [{ medicament_id, quantite }]
        date_prescription: '',
        detail: '',
    });
    const [createError, setCreateError] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ patient_id: '', medicaments: [], date_prescription: '', detail: '' });
    const [editError, setEditError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordRes, patRes, medRes] = await Promise.all([
                api.get('/medecin/ordonnances'),
                api.get('/medecin/patients'),
                api.get('/medicaments'),
            ]);
            setOrdonnances(ordRes.data.data.data || []); // paginated
            setPatients(patRes.data.data || []);
            setMedicaments(medRes.data.data.data || []);
        } catch (err) {
            // handle error
        }
        setLoading(false);
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleMedicamentChange = (idx, field, value) => {
        setCreateForm((prev) => {
            const meds = [...prev.medicaments];
            meds[idx][field] = value;
            return { ...prev, medicaments: meds };
        });
    };

    const addMedicament = () => {
        setCreateForm((prev) => ({
            ...prev,
            medicaments: [...prev.medicaments, { medicament_id: '', quantite: 1 }],
        }));
    };

    const removeMedicament = (idx) => {
        setCreateForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.filter((_, i) => i !== idx),
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError('');
        try {
            await api.post('/medecin/ordonnances', {
                patient_id: createForm.patient_id,
                medicaments: createForm.medicaments.map(m => ({
                    medicament_id: m.medicament_id,
                    quantite: Number(m.quantite),
                })),
                date_prescription: createForm.date_prescription,
                detail: createForm.detail,
            });
            setShowCreateModal(false);
            setCreateForm({ patient_id: '', medicaments: [], date_prescription: '', detail: '' });
            fetchData();
        } catch (err) {
            setCreateError('Erreur lors de la création.');
        }
        setCreateLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        setDeleteError('');
        try {
            await api.delete(`/medecin/ordonnances/${deleteId}`);
            setDeleteId(null);
            fetchData();
        } catch (err) {
            setDeleteError('Erreur lors de la suppression.');
        }
        setDeleteLoading(false);
    };

    const openEditModal = (ord) => {
        setEditId(ord.id);
        setEditForm({
            patient_id: ord.patient?.id || '',
            medicaments: ord.medicaments?.map(m => ({ medicament_id: m.id, quantite: m.pivot?.quantite || 1 })) || [],
            date_prescription: ord.date_prescription || '',
            detail: ord.detail || '',
        });
        setEditError('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditMedicamentChange = (idx, field, value) => {
        setEditForm((prev) => {
            const meds = [...prev.medicaments];
            meds[idx][field] = value;
            return { ...prev, medicaments: meds };
        });
    };

    const addEditMedicament = () => {
        setEditForm((prev) => ({
            ...prev,
            medicaments: [...prev.medicaments, { medicament_id: '', quantite: 1 }],
        }));
    };

    const removeEditMedicament = (idx) => {
        setEditForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.filter((_, i) => i !== idx),
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError('');
        try {
            await api.put(`/medecin/ordonnances/${editId}`, {
                medicaments: editForm.medicaments.map(m => ({
                    medicament_id: m.medicament_id,
                    quantite: Number(m.quantite),
                })),
                date_prescription: editForm.date_prescription,
                detail: editForm.detail,
            });
            setEditId(null);
            fetchData();
        } catch (err) {
            setEditError('Erreur lors de la modification.');
        }
        setEditLoading(false);
    };

    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarMedecin />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
                <Topbar title="Gestion des Ordonnances" />
                <div style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>
                    <h2>Gestion des Ordonnances</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/medecin/ordonance/creer')}>
                        Créer Ordonance
                    </button>
                    {/* Remove modal code here */}
                    <hr />
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Médicaments</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Détail</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordonnances.map((ord) => (
                                    <tr key={ord.id}>
                                        <td>{ord.patient?.user?.name || ''}</td>
                                        <td>
                                            {ord.medicaments?.map(m => `${m.nom} (x${m.pivot?.quantite || 1})`).join(', ')}
                                        </td>
                                        <td>{ord.date_prescription || ord.created_at}</td>
                                        <td>{ord.status || '-'}</td>
                                        <td>{ord.detail || '-'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning" onClick={() => openEditModal(ord)}>✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(ord.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {/* Delete confirmation modal */}
                    {deleteId && (
                        <div className="modal" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 400, margin: '40px auto', boxShadow: '0 2px 8px #0002' }}>
                            <h5>Confirmer la suppression</h5>
                            <p>Voulez-vous vraiment supprimer cette ordonnance ?</p>
                            {deleteError && <div className="alert alert-danger">{deleteError}</div>}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Annuler</button>
                                <button className="btn btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                                    {deleteLoading ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Edit modal */}
                    {editId && (
                        <div className="modal" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 500, margin: '40px auto', boxShadow: '0 2px 8px #0002' }}>
                            <h4>Modifier l'ordonnance</h4>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-2">
                                    <label>Patient</label>
                                    <select name="patient_id" className="form-control" value={editForm.patient_id} disabled>
                                        <option value="">Sélectionner un patient</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.user?.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label>Médicaments</label>
                                    {editForm.medicaments.map((m, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                            <select className="form-control" value={m.medicament_id} onChange={e => handleEditMedicamentChange(idx, 'medicament_id', e.target.value)} required>
                                                <option value="">Choisir</option>
                                                {medicaments.map(md => (
                                                    <option key={md.id} value={md.id}>{md.nom}</option>
                                                ))}
                                            </select>
                                            <input type="number" min="1" className="form-control" style={{ width: 80 }} value={m.quantite} onChange={e => handleEditMedicamentChange(idx, 'quantite', e.target.value)} required />
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEditMedicament(idx)}>✖</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={addEditMedicament}>+ Ajouter médicament</button>
                                </div>
                                <div className="mb-2">
                                    <label>Date de prescription</label>
                                    <input type="date" name="date_prescription" className="form-control" value={editForm.date_prescription} onChange={handleEditChange} required />
                                </div>
                                <div className="mb-2">
                                    <label>Détail</label>
                                    <textarea name="detail" className="form-control" value={editForm.detail} onChange={handleEditChange} maxLength={500} />
                                </div>
                                {editError && <div className="alert alert-danger">{editError}</div>}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary" disabled={editLoading}>{editLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdonanceMedecinPage; 
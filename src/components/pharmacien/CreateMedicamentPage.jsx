import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import SidebarPharmacien from '../SidebarPharmacien';
import Topbar from '../Topbar';
import './ordonnance-pharmacien.css';


const PharmacienMedicamentForm = ({ isEdit }) => {
    const { id } = useParams();
    const [form, setForm] = useState({ nom: '', quantite: 1, disponible: true });
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit && id) {
            fetchData();
        }
    }, [isEdit, id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/medicaments/${id}`);
            const medicament = res.data.data;
            setForm({
                nom: medicament.nom || '',
                quantite: medicament.quantite || 1,
                disponible: medicament.disponible ?? true,
            });
        } catch (err) {
            setError('Erreur lors du chargement du médicament.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            if (isEdit && id) {
                await api.put(`/medicaments/${id}`, {
                    nom: form.nom,
                    quantite: Number(form.quantite),
                    disponible: form.disponible,
                });
            } else {
                await api.post('/medicaments', {
                    nom: form.nom,
                    quantite: Number(form.quantite),
                    disponible: form.disponible,
                });
            }
            navigate('/pharmacien/medicaments');
        } catch (err) {
            setError('Erreur lors de la sauvegarde.');
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce médicament ?')) return;
        setSubmitting(true);
        setError('');
        try {
            await api.delete(`/medicaments/${id}`);
            navigate('/pharmacien/medicaments');
        } catch (err) {
            setError('Erreur lors de la suppression.');
        }
        setSubmitting(false);
    };

    return (
        <div className="page-container">
            <SidebarPharmacien />
            <div className="page-content">
                <Topbar title={isEdit ? 'Modifier un médicament' : 'Créer un médicament'} />
                <div className="content-inner">
                    <div className="header-section">
                        <button className="btn-back-icon" onClick={() => navigate('/pharmacien/medicaments')}>
                            ← Retour
                        </button>
                        <h2 className="page-title">{isEdit ? 'Modifier un médicament' : 'Créer un médicament'}</h2>
                    </div>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="medicament-form">
                            <div className="mb-2">
                                <label htmlFor="nom">Nom</label>
                                <input
                                    id="nom"
                                    type="text"
                                    name="nom"
                                    className="form-control"
                                    value={form.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="quantite">Quantité</label>
                                <input
                                    id="quantite"
                                    type="number"
                                    name="quantite"
                                    min="1"
                                    className="form-control"
                                    value={form.quantite}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="disponible"
                                        checked={form.disponible}
                                        onChange={handleChange}
                                    />{' '}
                                    Disponible
                                </label>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/pharmacien/medicaments')}>
                                    Annuler
                                </button>
                                {isEdit && (
                                    <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
                                        Supprimer
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default function CreateMedicamentPage() {
    const { id } = useParams();
    return <PharmacienMedicamentForm isEdit={!!id} />;
} 
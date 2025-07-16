import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import SidebarMedecin from '../SidebarMedecin';
import Topbar from '../Topbar';
import { useNavigate } from 'react-router-dom';

const MedicamentsMedecinPage = () => {
    const navigate = useNavigate();
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ nom: '', quantite: 1, disponible: true });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMedicaments();
    }, []);

    const fetchMedicaments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/medicaments');
            setMedicaments(Array.isArray(res.data.data?.data) ? res.data.data.data : []);
        } catch (err) {
            setError('Erreur lors du chargement des médicaments.');
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

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/medicaments', {
                nom: form.nom,
                quantite: Number(form.quantite),
                disponible: form.disponible,
            });
            setSuccess('Médicament créé avec succès.');
            setForm({ nom: '', quantite: 1, disponible: true });
            setShowCreate(false);
            fetchMedicaments();
        } catch (err) {
            setError('Erreur lors de la création.');
        }
        setSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarMedecin />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
                <Topbar title="Gestion des Médicaments" />
                <div style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>
                    <h2>Médicaments</h2>
                    <button className="btn btn-primary mb-3" onClick={() => navigate('/medecin/medicaments/creer')}>
                        Créer un médicament
                    </button>
                    {/* Remove modal code here */}
                    <hr />
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicaments.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.nom}</td>
                                        <td>{m.quantite}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicamentsMedecinPage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import SidebarPharmacien from '../SidebarPharmacien';
import Topbar from '../Topbar';
import { MedicamentForm } from '../medecin/CreateMedicamentPage';

const CreateMedicamentPage = () => {
    const navigate = useNavigate();
    const handleSuccess = async (form) => {
        await api.post('/medicaments', {
            nom: form.nom,
            quantite: Number(form.quantite),
            disponible: form.disponible,
        });
        navigate('/pharmacien/medicaments');
    };
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarPharmacien />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
                <Topbar title="Créer un médicament" />
                <div style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>
                    <h2>Créer un médicament</h2>
                    <button className="btn btn-secondary mb-3" onClick={() => navigate('/pharmacien/medicaments')}>Retour</button>
                    <MedicamentForm onSuccess={handleSuccess} onCancel={() => navigate('/pharmacien/medicaments')} />
                </div>
            </div>
        </div>
    );
};

export default CreateMedicamentPage; 
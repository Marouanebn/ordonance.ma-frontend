import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Download } from "lucide-react";
import "./MesOrdonnancesPatientPage.css";

const MesOrdonnancesPatientPage = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDownloading, setBulkDownloading] = useState(false);

  useEffect(() => {
    api
      .get("/patient/ordonnances")
      .then((res) => {
        setOrdonnances(res.data.data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des ordonnances.");
        setLoading(false);
      });
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === ordonnances.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ordonnances.map((ord) => ord.id));
    }
  };

  const handleDownload = async (ordonnanceId) => {
    try {
      const response = await api.get(`/ordonnances/${ordonnanceId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordonnance_${ordonnanceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement de l\'ordonnance.');
    }
  };

  const handleBulkDownload = async () => {
    if (selectedIds.length === 0) return;
    setBulkDownloading(true);
    try {
      const response = await api.post(
        '/ordonnances/bulk-download',
        { ordonnance_ids: selectedIds },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ordonnances_selection.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors du téléchargement groupé.");
    } finally {
      setBulkDownloading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Ordonnances archivées</h2>
        <button
          className="download-button"
          onClick={handleBulkDownload}
          disabled={selectedIds.length === 0 || bulkDownloading}
        >
          {bulkDownloading ? 'Téléchargement...' : 'Télécharger la sélection'}
        </button>
      </div>

      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && ordonnances.length === 0 && (
        <div>Aucune ordonnance trouvée.</div>
      )}

      {!loading && !error && ordonnances.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === ordonnances.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Date</th>
                <th>Statut</th>
                <th>Médecin</th>
                <th>Médicaments</th>
                <th>Détail</th>
                <th>Téléchargement</th>
              </tr>
            </thead>
            <tbody>
              {ordonnances.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ord.id)}
                      onChange={() => toggleSelection(ord.id)}
                    />
                  </td>
                  <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="status-indicator">
                      <span className="dot"></span>
                      Archivée
                    </div>
                  </td>
                  <td>{ord.medecin?.user?.name || "-"}</td>
                  <td>
                    {ord.medicaments && ord.medicaments.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {ord.medicaments.map((med) => (
                          <li key={med.id}>
                            {med.nom}{" "}
                            {med.pivot?.quantite
                              ? `(x${med.pivot.quantite})`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{ord.detail || ord.remarques || "-"}</td>
                  <td>
                    <button className="download-icon-button" onClick={() => handleDownload(ord.id)}>
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MesOrdonnancesPatientPage;

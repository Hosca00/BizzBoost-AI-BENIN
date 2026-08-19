import React, { useState, useEffect } from 'react';
import { generateInvoicePDF } from '../services/api';

export default function InvoiceGenerator() {
  const [loading, setLoading] = useState(false);
  const [articleHistory, setArticleHistory] = useState([]);
  
  const [formData, setFormData] = useState({
    document_type: 'FACTURE',
    invoice_number: 'FAC-2026-001',
    company_name: 'BizBoost Boutique',
    company_phone: '+229 01 63 43 41 50',
    company_address: 'Parakou, Bénin',
    client_name: 'M. D',
    client_phone: '+229 01 00 00 00 00',
    payment_method: 'MTN Mobile Money',
    discount: 0,
    items: [{ description: 'Article exemple', quantity: 1, unit_price: 5000 }]
  });

  // 1. Charger l'historique des articles depuis l'API FastAPI
  useEffect(() => {
    fetch('http://localhost:8000/api/articles')
      .then((res) => res.json())
      .then((data) => setArticleHistory(data))
      .catch((err) => console.error("Erreur lors de la récupération du catalogue:", err));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'description' ? value : Number(value);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }]
    });
  };

  // Action : Supprimer une ligne d'article
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  // Action : Envoyer la requête PDF et synchroniser le catalogue JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Enregistrer les nouveaux articles dans catalog.json via l'API
    const descriptions = formData.items
      .map((item) => item.description.trim())
      .filter(Boolean);

    if (descriptions.length > 0) {
      try {
        const response = await fetch('http://localhost:8000/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articles: descriptions }),
        });
        const data = await response.json();
        if (data.catalog) {
          setArticleHistory(data.catalog);
        }
      } catch (err) {
        console.error("Erreur lors de la mise à jour du catalogue:", err);
      }
    }

    // Génération et téléchargement du PDF
    try {
      const blob = await generateInvoicePDF(formData);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.document_type}_${formData.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Impossible de générer le PDF. Assurez-vous que le serveur FastAPI (port 8000) tourne.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md my-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">📄 Générateur de Facture / Devis PDF</h2>
      
      {/* Liste de suggestions pour l'autocomplétion */}
      <datalist id="articles-suggestions">
        {articleHistory.map((item, idx) => (
          <option key={idx} value={item} />
        ))}
      </datalist>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informations Entreprise & Client */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Votre Entreprise</label>
            <input
              type="text"
              placeholder="Nom de l'entreprise"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nom du client</label>
            <input
              type="text"
              placeholder="Nom du client"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone client</label>
            <input
              type="text"
              placeholder="+229 01 .."
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Section Articles */}
        <h3 className="font-semibold mt-4">Articles</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              list="articles-suggestions"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="border p-2 rounded flex-1"
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Qté"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="border p-2 rounded w-20 text-center"
              required
            />
            <input
              type="number"
              placeholder="Prix Unit. (FCFA)"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
              className="border p-2 rounded w-32 text-right"
              required
            />
            {formData.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:text-red-700 font-bold hover:bg-red-50 rounded"
                title="Supprimer la ligne"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-sm text-indigo-600 font-semibold hover:underline block"
        >
          + Ajouter un article
        </button>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Génération en cours...' : 'Télécharger le PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}
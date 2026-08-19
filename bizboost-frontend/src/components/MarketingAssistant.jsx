import React, { useState } from 'react';
import { generateMarketingPost } from '../services/api';

export default function MarketingAssistant() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_description: 'Chaussures en vrai cuir fabriquées localement, confortables et durables.',
    target_audience: 'Hommes professionnels et jeunes cadres à Cotonou',
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateMarketingPost(formData);
      setResult(data);
    } catch (error) {
      console.error('Erreur IA Marketing:', error);
      alert('Erreur lors de la génération. Vérifiez le backend ou la clé API Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md my-4">
      <h2 className="text-xl font-bold mb-4 text-purple-600">🤖 Assistant IA Marketing (Gemini)</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Description du produit / service</label>
          <textarea
            value={formData.product_description}
            onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
            className="border p-2 rounded w-full h-20"
            placeholder="Ex: Chaussures en cuir pour hommes importées de Cotonou..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Public cible</label>
          <input
            type="text"
            value={formData.target_audience}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="Ex: Professionnels et étudiants à Parakou..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Génération IA en cours...' : 'Générer la Publication'}
        </button>
      </form>

      {/* Affichage structuré du résultat */}
      {result && (
        <div className="mt-6 space-y-4">
          {result.slogan && (
            <div className="p-3 bg-purple-100 border-l-4 border-purple-600 rounded">
              <span className="font-bold text-purple-900">💡 Slogan : </span>
              <span className="italic font-semibold text-purple-800">"{result.slogan}"</span>
            </div>
          )}

          {result.whatsapp_status && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-green-800">📱 Statut WhatsApp</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result.whatsapp_status)}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  📋 Copier
                </button>
              </div>
              <p className="whitespace-pre-line text-sm text-gray-800 bg-white p-3 rounded border">
                {result.whatsapp_status}
              </p>
            </div>
          )}

          {result.facebook_post && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-800">📘 Publication Facebook</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result.facebook_post)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  📋 Copier
                </button>
              </div>
              <p className="whitespace-pre-line text-sm text-gray-800 bg-white p-3 rounded border">
                {result.facebook_post}
              </p>
            </div>
          )}

          {result.strategy && (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">🎯 Stratégie Conseillée</h3>
              <p className="text-sm text-gray-700">{result.strategy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
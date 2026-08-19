import React, { useState } from 'react';
import { calculatePricing } from '../services/api';

export default function PricingCalculator() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    purchase_price: 15000,
    transport: 2000,
    packaging: 500,
    desired_margin_pct: 30,
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatePricing(formData);
      setResult(data);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      alert('Impossible d\'effectuer le calcul. Vérifiez les données ou le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md my-4">
      <h2 className="text-xl font-bold mb-4 text-green-600">📊 Calculateur de Prix & Marge</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Prix d'achat (FCFA)</label>
            <input
              type="number"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Transport (FCFA)</label>
            <input
              type="number"
              value={formData.transport}
              onChange={(e) => setFormData({ ...formData, transport: Number(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Emballage (FCFA)</label>
            <input
              type="number"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: Number(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Marge souhaitée (%)</label>
            <input
              type="number"
              value={formData.desired_margin_pct}
              onChange={(e) => setFormData({ ...formData, desired_margin_pct: Number(e.target.value) })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Calcul en cours...' : 'Calculer le Prix'}
        </button>
      </form>

      {/* Résultat du calcul */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-lg text-green-800 mb-2">Résultats conseillés :</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Coût de revient</p>
              <p className="font-bold text-base text-gray-800">{result.cost_price} FCFA</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border-2 border-green-500">
              <p className="text-xs text-gray-500">Prix Conseillé</p>
              <p className="font-bold text-lg text-green-600">{result.recommended_price} FCFA</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Prix Minimum</p>
              <p className="font-bold text-base text-red-500">{result.min_price} FCFA</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Prix Promo</p>
              <p className="font-bold text-base text-indigo-600">{result.promo_price} FCFA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import InvoiceGenerator from './components/InvoiceGenerator';
import PricingCalculator from './components/PricingCalculator';
import MarketingAssistant from './components/MarketingAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('invoice');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">
            BizBoost AI Bénin 🇧🇯
          </h1>
          <p className="text-gray-600">
            La suite d'outils intelligents pour booster les PME et commerçants béninois.
          </p>
        </div>

        {/* Navigation par Onglets */}
        <div className="flex justify-center gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'invoice'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📄 Factures & Devis
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'pricing'
                ? 'bg-green-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Calculateur de Prix
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'marketing'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🤖 Assistant Marketing IA
          </button>
        </div>

        {/* Contenu actif */}
        <div>
          {activeTab === 'invoice' && <InvoiceGenerator />}
          {activeTab === 'pricing' && <PricingCalculator />}
          {activeTab === 'marketing' && <MarketingAssistant />}
        </div>

      </div>
    </div>
  );
}
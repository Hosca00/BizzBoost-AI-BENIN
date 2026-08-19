import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Générer la facture PDF
export const generateInvoicePDF = async (data) => {
  const response = await API.post('/invoices/generate-pdf', data, {
    responseType: 'blob', // Pour récupérer un fichier PDF
  });
  return response.data;
};

// Calculer le prix & la marge
export const calculatePricing = async (data) => {
  const response = await API.post('/pricing/calculate', data);
  return response.data;
};

// Assistant IA Marketing
export const generateMarketingPost = async (data) => {
  const response = await API.post('/ai/marketing', data);
  return response.data;
};
import axios from 'axios';

const HF_TOKEN = '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';

// Resumen Automático
async function summarizeText(text) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    return response.data[0]?.summary_text || 'No se pudo generar resumen';
  } catch (error) {
    console.error('Error en summarizeText:', error.response?.data || error.message);
    throw error;
  }
}

// Clasificar Prioridad
async function classifyPriority(text) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/valhalla/distilbart-mnli-12-3',
      {
        inputs: text,
        parameters: { candidate_labels: ['Alta', 'Media', 'Baja'] },
      },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    return response.data?.labels?.[0] || 'Media'; // Valor por defecto
  } catch (error) {
    console.error('Error en classifyPriority:', error.response?.data || error.message);
    return 'Media'; // Prioridad por defecto si falla
  }
}

// Procesar Ticket
export async function processTicket(ticketData) {
  const summary = await summarizeText(ticketData.description);
  const priority = await classifyPriority(summary);
  return {
    ...ticketData,
    summary,
    priority,
    status: 'Abierto',
    date: new Date().toISOString(),
  };
}
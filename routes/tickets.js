import express from 'express';
import { processTicket } from '../services/huggingface.js';

const router = express.Router();
let tickets = []; // Base de datos simulada

// Submit Ticket
router.post('/', async (req, res) => {
  try {
    const ticket = await processTicket(req.body);
    tickets.push(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error en POST /api/tickets:', error); // Log detallado
    res.status(500).json({ error: 'Error al procesar el ticket' });
  }
});

// Get Tickets
router.get('/', (req, res) => {
  res.json(tickets);
});

export default router;
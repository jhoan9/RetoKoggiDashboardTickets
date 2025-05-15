import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ticketRoutes from './routes/tickets.js'; // Extensión .js obligatoria

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Rutas
app.use('/api/tickets', ticketRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
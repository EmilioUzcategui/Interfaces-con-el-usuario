import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
//import { testConnection } from './DB/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

// Probar conexión a la base de datos
//testConnection();

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
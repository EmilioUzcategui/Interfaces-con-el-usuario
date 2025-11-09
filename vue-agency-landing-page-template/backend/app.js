import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import colorRoutes from './routes/color.js';
import tipografiaRoutes from './routes/tipografia.js';
import uploadsRoutes from './routes/uploads.js';
import initPalettes from './init-palettes.js';
import { fileURLToPath } from 'url'
import path from 'path'
//import { testConnection } from './DB/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'backend/public/uploads')))

// Rutas
app.use('/api', authRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/tipografias', tipografiaRoutes);
app.use('/api/uploads', uploadsRoutes);


// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

// Probar conexión a la base de datos
//testConnection();

app.listen(PORT, async () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    
    // Inicializar paletas por defecto
    try {
        await initPalettes();
    } catch (error) {
        console.error('Error inicializando paletas:', error);
    }
});
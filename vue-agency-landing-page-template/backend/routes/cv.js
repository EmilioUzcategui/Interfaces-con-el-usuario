import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pool } from '../DB/dbpostgres.js';

const router = express.Router();

// ========== CONFIGURACIÓN PARA IMÁGENES DE CV ==========
const cvImagesDir = path.resolve('./backend/public/uploads/users');
// Asegurarse que exista la carpeta
try {
    fs.mkdirSync(cvImagesDir, { recursive: true });
} catch (e) {
    // La carpeta ya existe o no se pudo crear
}

const cvImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, cvImagesDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase() || '.png';
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(ext, '');
        cb(null, `cv_${unique}_${safe}${ext}`);
    }
});

// Middleware para validar que sea una imagen
const imageFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf'
    ];

    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP) y PDF'), false);
    }
};

// Configuración de multer para imágenes de CV
const uploadCVImage = multer({
    storage: cvImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo para CVs
    }
});

// POST /api/cv - Crear o actualizar un CV con imagen
router.post('/', uploadCVImage.single('cvImage'), async (req, res) => {
    try {
        const { userId } = req.body;

        // Validar que el usuario esté presente
        if (!userId) {
            return res.status(400).json({ error: 'ID de usuario requerido' });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({ error: 'Imagen del CV requerida' });
        }

        // Verificar si el usuario existe
        const userCheck = await pool.query(
            'SELECT id_user FROM users WHERE id_user = $1',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            // Eliminar el archivo si el usuario no existe
            if (req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error al eliminar archivo:', e);
                }
            }
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Ruta del archivo relativa para guardar en la BD
        const filePath = `/uploads/users/${req.file.filename}`;

        // Siempre crear un nuevo CV (no actualizar el existente)
        const result = await pool.query(
            `INSERT INTO cvs (
                user_id,
                file_path,
                uploaded_at
            ) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id_cv`,
            [userId, filePath]
        );

        res.status(201).json({
            message: 'CV creado exitosamente',
            cvId: result.rows[0].id_cv,
            filePath: filePath
        });
    } catch (error) {
        console.error('Error al guardar CV:', error);

        // Eliminar el archivo si hubo un error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error al eliminar archivo:', e);
            }
        }

        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/cv - Obtener todos los CVs con información del usuario
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                c.id_cv, 
                c.user_id, 
                c.file_path, 
                c.uploaded_at,
                u.name,
                u.email
            FROM cvs c
            INNER JOIN users u ON c.user_id = u.id_user
            ORDER BY c.uploaded_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener CVs:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/cv/user/:userId - Obtener todos los CVs de un usuario específico (debe ir antes de /:userId)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT 
                c.id_cv, 
                c.user_id, 
                c.file_path, 
                c.uploaded_at
            FROM cvs c
            WHERE c.user_id = $1
            ORDER BY c.uploaded_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener CVs del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/cv/:userId - Obtener CV de un usuario (último CV)
router.get('/:userId', async (req, res) => {
    console.log('Obteniendo CV para usuario:', req.params.userId);
    try {
        const { userId } = req.params;

        const result = await pool.query(
            'SELECT * FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'CV no encontrado' });
        }

        const cv = result.rows[0];

        res.json({
            id_cv: cv.id_cv,
            user_id: cv.user_id,
            file_path: cv.file_path,
            uploaded_at: cv.uploaded_at
        });
    } catch (error) {
        console.error('Error al obtener CV:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT /api/cv/:cvId - Actualizar un CV existente (solo imagen y fecha)
router.put('/:cvId', uploadCVImage.single('cvImage'), async (req, res) => {
    try {
        const { cvId } = req.params;

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({ error: 'Imagen del CV requerida' });
        }

        // Verificar si el CV existe
        const cvCheck = await pool.query(
            'SELECT id_cv, file_path FROM cvs WHERE id_cv = $1',
            [cvId]
        );

        if (cvCheck.rows.length === 0) {
            // Eliminar el archivo si el CV no existe
            if (req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error al eliminar archivo:', e);
                }
            }
            return res.status(404).json({ error: 'CV no encontrado' });
        }

        // Eliminar la imagen anterior si existe
        const oldFilePath = cvCheck.rows[0].file_path;
        if (oldFilePath) {
            try {
                const oldFullPath = path.resolve('./backend/public', oldFilePath);
                if (fs.existsSync(oldFullPath)) {
                    fs.unlinkSync(oldFullPath);
                }
            } catch (e) {
                console.error('Error al eliminar imagen anterior:', e);
                // Continuar aunque falle la eliminación
            }
        }

        // Ruta del archivo relativa para guardar en la BD
        const filePath = `/uploads/users/${req.file.filename}`;

        // Actualizar el CV (solo file_path y uploaded_at)
        const result = await pool.query(
            `UPDATE cvs 
            SET file_path = $1, uploaded_at = CURRENT_TIMESTAMP 
            WHERE id_cv = $2 
            RETURNING id_cv, user_id, file_path, uploaded_at`,
            [filePath, cvId]
        );

        res.json({
            message: 'CV actualizado exitosamente',
            cvId: result.rows[0].id_cv,
            filePath: result.rows[0].file_path
        });
    } catch (error) {
        console.error('Error al actualizar CV:', error);

        // Eliminar el archivo si hubo un error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error al eliminar archivo:', e);
            }
        }

        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE /api/cv/:cvId - Eliminar un CV
router.delete('/:cvId', async (req, res) => {
    try {
        const { cvId } = req.params;

        // Verificar si el CV existe y obtener la ruta del archivo
        const cvCheck = await pool.query(
            'SELECT id_cv, file_path FROM cvs WHERE id_cv = $1',
            [cvId]
        );

        if (cvCheck.rows.length === 0) {
            return res.status(404).json({ error: 'CV no encontrado' });
        }

        // Eliminar el archivo físico si existe
        const filePath = cvCheck.rows[0].file_path;
        if (filePath) {
            try {
                const fullPath = path.resolve('./backend/public', filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            } catch (e) {
                console.error('Error al eliminar archivo físico:', e);
                // Continuar aunque falle la eliminación del archivo
            }
        }

        // Eliminar el registro de la base de datos
        await pool.query('DELETE FROM cvs WHERE id_cv = $1', [cvId]);

        res.json({
            message: 'CV eliminado exitosamente',
            cvId: cvId
        });
    } catch (error) {
        console.error('Error al eliminar CV:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;


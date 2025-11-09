import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// ========== CONFIGURACIÓN PARA FUENTES ==========
const uploadDir = path.resolve('./backend/public/uploads/fonts')
// asegurarse que exista la carpeta
try { fs.mkdirSync(uploadDir, { recursive: true }) } catch (e) { }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        cb(null, unique + '-' + safe)
    }
})

const upload = multer({ storage })

// ========== CONFIGURACIÓN PARA IMÁGENES DE USUARIO ==========
const userImagesDir = path.resolve('./backend/public/uploads/users')
// asegurarse que exista la carpeta
try { fs.mkdirSync(userImagesDir, { recursive: true }) } catch (e) { }

const userImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImagesDir)
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname).toLowerCase()
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(ext, '')
        cb(null, unique + '-' + safe + ext)
    }
})

// Middleware para validar que sea una imagen
const imageFileFilter = (req, file, cb) => {
    // Tipos MIME permitidos para imágenes
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ]
    
    // Extensiones permitidas
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'), false)
    }
}

// Configuración de multer para imágenes de usuario
const uploadUserImage = multer({
    storage: userImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
})

// POST /api/uploads/fonts - recibe un campo 'font' con el archivo
router.post('/fonts', upload.single('font'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
        const urlPath = `/uploads/fonts/${req.file.filename}`
        res.status(201).json({ url: urlPath })
    } catch (err) {
        console.error('Upload error:', err)
        res.status(500).json({ error: 'Upload failed' })
    }
})

// POST /api/uploads/user-image - recibe un campo 'image' con la imagen del usuario
router.post('/user-image', uploadUserImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' })
        }
        
        const urlPath = `/uploads/users/${req.file.filename}`
        res.status(201).json({ 
            message: 'Imagen subida exitosamente',
            url: urlPath,
            filename: req.file.filename
        })
    } catch (err) {
        console.error('Error al subir imagen de usuario:', err)
        
        // Manejar errores específicos de multer
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' })
            }
            return res.status(400).json({ error: `Error al subir archivo: ${err.message}` })
        }
        
        // Manejar errores de validación
        if (err.message) {
            return res.status(400).json({ error: err.message })
        }
        
        res.status(500).json({ error: 'Error al subir la imagen' })
    }
})

export default router

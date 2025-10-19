import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

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

export default router

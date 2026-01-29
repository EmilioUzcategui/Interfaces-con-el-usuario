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

// ========== CONFIGURACIÓN PARA VIDEOS + SUBTÍTULOS + AUDIO ==========
const videosDir = path.resolve('./backend/public/uploads/videos')
const subtitlesDir = path.resolve('./backend/public/uploads/subtitles')
const audiosDir = path.resolve('./backend/public/uploads/audios')
const videoPackagesManifestPath = path.resolve('./backend/public/uploads/video-packages.json')
try { fs.mkdirSync(videosDir, { recursive: true }) } catch (e) { }
try { fs.mkdirSync(subtitlesDir, { recursive: true }) } catch (e) { }
try { fs.mkdirSync(audiosDir, { recursive: true }) } catch (e) { }

async function readVideoPackagesManifest() {
    try {
        const raw = await fs.promises.readFile(videoPackagesManifestPath, 'utf8')
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch (e) {
        return []
    }
}

async function writeVideoPackagesManifest(items) {
    await fs.promises.writeFile(videoPackagesManifestPath, JSON.stringify(items, null, 2), 'utf8')
}

function toDisplayName(name) {
    if (!name) return ''
    const base = String(name).split('/').filter(Boolean).pop() || ''
    const withoutExt = base.replace(/\.[a-z0-9]+$/i, '')
    const normalized = withoutExt.replace(/[-_]+/g, ' ').trim()
    const parts = normalized.split(/\s+/).filter(Boolean)
    if (parts.length && /^\d+$/.test(parts[0])) {
        let i = 0
        while (i < parts.length && /^\d+$/.test(parts[i])) i += 1
        return parts.slice(i).join(' ').trim()
    }
    return normalized
}

async function listFilesWithStats(dirPath, allowedExts) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
    const files = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((name) => allowedExts.has(path.extname(name).toLowerCase()))

    const withStats = await Promise.all(
        files.map(async (name) => {
            const full = path.join(dirPath, name)
            const stat = await fs.promises.stat(full)
            return { name, mtimeMs: stat.mtimeMs }
        })
    )
    return withStats
}

async function inferMissingVideoPackages(existing) {
    const byId = new Set((existing || []).map((e) => e?.id).filter(Boolean))
    const mp4Exts = new Set(['.mp4'])
    const vttExts = new Set(['.vtt'])
    const mp3Exts = new Set(['.mp3'])

    const videos = await listFilesWithStats(videosDir, mp4Exts)
    const subtitles = await listFilesWithStats(subtitlesDir, vttExts)
    const audios = await listFilesWithStats(audiosDir, mp3Exts)

    const added = []
    const maxDeltaMs = 60_000 // 60s de ventana para asociar archivos

    for (const v of videos) {
        if (byId.has(v.name)) continue

        const pickClosest = (arr) => arr
            .map((x) => ({ ...x, delta: Math.abs(x.mtimeMs - v.mtimeMs) }))
            .filter((x) => x.delta <= maxDeltaMs)
            .sort((a, b) => a.delta - b.delta)
            .slice(0, 2)

        const chosenSubs = pickClosest(subtitles)
        const chosenAudios = pickClosest(audios)

        added.push({
            id: v.name,
            name: toDisplayName(v.name),
            createdAt: new Date(v.mtimeMs).toISOString(),
            video: { filename: v.name, url: `/uploads/videos/${v.name}` },
            subtitles: chosenSubs.map((s, idx) => ({ field: `subtitle${idx + 1}`, filename: s.name, url: `/uploads/subtitles/${s.name}` })),
            audios: chosenAudios.map((a, idx) => ({ field: `audio${idx + 1}`, filename: a.name, url: `/uploads/audios/${a.name}` }))
        })
    }

    if (added.length) {
        const merged = [...(existing || []), ...added]
        await writeVideoPackagesManifest(merged)
        return merged
    }

    return existing || []
}

const videoPackageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video') return cb(null, videosDir)
        if (file.fieldname === 'subtitle1' || file.fieldname === 'subtitle2') return cb(null, subtitlesDir)
        if (file.fieldname === 'audio1' || file.fieldname === 'audio2') return cb(null, audiosDir)
        return cb(null, videosDir)
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname).toLowerCase()
        const safeBase = file.originalname
            .replace(/[^a-zA-Z0-9.\-_]/g, '_')
            .replace(ext, '')
        cb(null, unique + '-' + safeBase + ext)
    }
})

const videoPackageFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const isVideo = file.fieldname === 'video'
    const isSubtitle = file.fieldname === 'subtitle1' || file.fieldname === 'subtitle2'
    const isAudio = file.fieldname === 'audio1' || file.fieldname === 'audio2'

    if (isVideo) {
        const ok = ext === '.mp4' && (file.mimetype === 'video/mp4' || file.mimetype === 'application/octet-stream')
        return ok ? cb(null, true) : cb(new Error('El video debe ser un archivo .mp4'), false)
    }
    if (isSubtitle) {
        const ok = ext === '.vtt'
        return ok ? cb(null, true) : cb(new Error('Los subtítulos deben ser archivos .vtt'), false)
    }
    if (isAudio) {
        const ok = ext === '.mp3' && (file.mimetype === 'audio/mpeg' || file.mimetype === 'application/octet-stream')
        return ok ? cb(null, true) : cb(new Error('El audio debe ser un archivo .mp3'), false)
    }
    return cb(new Error('Campo de archivo no permitido'), false)
}

const uploadVideoPackage = multer({
    storage: videoPackageStorage,
    fileFilter: videoPackageFilter,
    limits: {
        // mp4 puede ser grande; dejamos margen
        fileSize: 200 * 1024 * 1024
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

// GET /api/uploads/user-images - lista las imágenes disponibles en /uploads/users
router.get('/user-images', async (req, res) => {
    try {
        const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])
        const entries = await fs.promises.readdir(userImagesDir, { withFileTypes: true })

        const files = entries
            .filter((ent) => ent.isFile())
            .map((ent) => ent.name)
            .filter((name) => allowedExts.has(path.extname(name).toLowerCase()))

        // Ordenar por fecha de modificación (más recientes primero)
        const withStats = await Promise.all(
            files.map(async (name) => {
                const stat = await fs.promises.stat(path.join(userImagesDir, name))
                return { name, mtimeMs: stat.mtimeMs }
            })
        )
        withStats.sort((a, b) => b.mtimeMs - a.mtimeMs)

        const images = withStats.map(({ name }) => ({
            filename: name,
            url: `/uploads/users/${name}`
        }))

        res.json({ images })
    } catch (err) {
        console.error('Error listando imágenes de usuario:', err)
        res.status(500).json({ error: 'No se pudieron listar las imágenes' })
    }
})

// GET /api/uploads/video-packages - lista videos subidos con sus audios/subtítulos
router.get('/video-packages', async (req, res) => {
    try {
        const items = await readVideoPackagesManifest()
        const merged = await inferMissingVideoPackages(items)
        merged.sort((a, b) => (b?.createdAt || '').localeCompare(a?.createdAt || ''))
        res.json({ videos: merged })
    } catch (err) {
        console.error('Error listando video-packages:', err)
        res.status(500).json({ error: 'No se pudieron listar los videos' })
    }
})

// POST /api/uploads/video-package
// Campos esperados (multipart):
// - name (texto)
// - video (mp4)
// - subtitle1 (vtt) opcional
// - subtitle2 (vtt) opcional
// - audio1 (mp3) opcional
// - audio2 (mp3) opcional
router.post(
    '/video-package',
    uploadVideoPackage.fields([
        { name: 'video', maxCount: 1 },
        { name: 'subtitle1', maxCount: 1 },
        { name: 'subtitle2', maxCount: 1 },
        { name: 'audio1', maxCount: 1 },
        { name: 'audio2', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const name = (req.body?.name || '').toString().trim()
            const files = req.files || {}

            const videoFile = files.video?.[0]
            if (!videoFile) return res.status(400).json({ error: 'No se subió ningún video (.mp4)' })

            const resp = {
                message: 'Video subido exitosamente',
                name,
                video: {
                    filename: videoFile.filename,
                    url: `/uploads/videos/${videoFile.filename}`
                },
                subtitles: [],
                audios: []
            }

            const s1 = files.subtitle1?.[0]
            const s2 = files.subtitle2?.[0]
            if (s1) resp.subtitles.push({ field: 'subtitle1', filename: s1.filename, url: `/uploads/subtitles/${s1.filename}` })
            if (s2) resp.subtitles.push({ field: 'subtitle2', filename: s2.filename, url: `/uploads/subtitles/${s2.filename}` })

            const a1 = files.audio1?.[0]
            const a2 = files.audio2?.[0]
            if (a1) resp.audios.push({ field: 'audio1', filename: a1.filename, url: `/uploads/audios/${a1.filename}` })
            if (a2) resp.audios.push({ field: 'audio2', filename: a2.filename, url: `/uploads/audios/${a2.filename}` })

            // Guardar manifest (para poder reconstruir el carrusel luego)
            const entry = {
                id: videoFile.filename,
                name,
                createdAt: new Date().toISOString(),
                video: resp.video,
                subtitles: resp.subtitles,
                audios: resp.audios
            }
            const manifest = await readVideoPackagesManifest()
            manifest.push(entry)
            await writeVideoPackagesManifest(manifest)

            res.status(201).json(resp)
        } catch (err) {
            console.error('Error subiendo video-package:', err)

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'El archivo es demasiado grande' })
                }
                return res.status(400).json({ error: `Error al subir archivo: ${err.message}` })
            }

            if (err.message) return res.status(400).json({ error: err.message })
            res.status(500).json({ error: 'Error al subir el video' })
        }
    }
)

export default router

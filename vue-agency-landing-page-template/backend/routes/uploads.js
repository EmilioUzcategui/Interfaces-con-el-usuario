import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// ========== UTILS START ==========
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
    try {
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
    } catch (e) {
        return []
    }
}
// ========== UTILS END ==========


// ========== CONFIGURACIÓN PARA FUENTES ==========
const uploadDir = path.resolve('./backend/public/uploads/fonts')
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
const userImagesManifestPath = path.resolve('./backend/public/uploads/user-images.json')
try { fs.mkdirSync(userImagesDir, { recursive: true }) } catch (e) { }

async function readUserImagesManifest() {
    try {
        const raw = await fs.promises.readFile(userImagesManifestPath, 'utf8')
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch (e) {
        return []
    }
}

async function writeUserImagesManifest(items) {
    await fs.promises.writeFile(userImagesManifestPath, JSON.stringify(items, null, 2), 'utf8')
}

// Sincroniza el manifest con los archivos reales (si se borraron manual o si hay nuevos)
async function inferMissingUserImages(existing) {
    const byId = new Map((existing || []).filter(e => e && e.id).map(e => [e.id, e]))
    const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

    const files = await listFilesWithStats(userImagesDir, allowedExts)

    // 1. Identificar archivos físicos que no están en el manifest
    const merged = []

    for (const f of files) {
        // En este diseño simple, usamos el filename como ID inicial si no existe uno mapeado
        // Ojo: si renombramos el archivo físico cambia el ID. 
        // Para robustez ideal usaríamos un ID interno, pero para mantener simpleza:
        // Buscamos si existe alguna entrada cuyo filename coincida
        let entry = existing.find(e => e.filename === f.name)

        if (!entry) {
            // Crear nueva entrada
            entry = {
                id: f.name, // ID temporal basado en filename
                filename: f.name,
                name: toDisplayName(f.name),
                url: `/uploads/users/${f.name}`,
                createdAt: new Date(f.mtimeMs).toISOString()
            }
        } else if (!entry.id) {
            // FIX: Corregir entradas corruptas que les falte ID
            entry.id = f.name
        }

        // Actualizamos siempre la data estática
        entry.url = `/uploads/users/${f.name}`
        merged.push(entry)
    }

    // Si hubo cambios en la cantidad (archivos borrados o nuevos), deberíamos guardar?
    // Para no spammear escritura, solo guardamos si "merged" tiene items nuevos que no estaban
    // O si faltan items que sí estaban.
    // Por simplicidad: devolvemos merged. La persistencia puede ocurrir on-demand o aqui.
    // Vamos a guardar solo si detectamos nuevos ID que no estaban en 'byId'
    const currentIds = new Set(merged.map(m => m.id))
    let changed = false

    // Check si hay nuevos
    for (const m of merged) {
        if (!byId.has(m.id)) {
            changed = true
            break
        }
    }
    // Check si se borraron (existía en 'byId' pero no en 'currentIds')
    if (!changed && existing.length !== merged.length) {
        changed = true
    }

    if (changed) {
        await writeUserImagesManifest(merged)
    }

    return merged
}

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

const imageFileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'), false)
    }
}

const uploadUserImage = multer({
    storage: userImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
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

// Infiere packages buscando videos huerfanos en disco
async function inferMissingVideoPackages(existing) {
    const byId = new Set((existing || []).map((e) => e?.id).filter(Boolean))
    const mp4Exts = new Set(['.mp4'])
    const vttExts = new Set(['.vtt'])
    const mp3Exts = new Set(['.mp3'])

    const videos = await listFilesWithStats(videosDir, mp4Exts)
    const subtitles = await listFilesWithStats(subtitlesDir, vttExts)
    const audios = await listFilesWithStats(audiosDir, mp3Exts)

    const added = []
    const maxDeltaMs = 60_000

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
    limits: { fileSize: 200 * 1024 * 1024 }
})


// ========== ROUTES ==========

// POST /api/uploads/fonts
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

// POST /api/uploads/user-image
router.post('/user-image', uploadUserImage.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' })

        const providedName = req.body.name || ''
        const urlPath = `/uploads/users/${req.file.filename}`

        // Guardar metadata en manifest
        const manifest = await readUserImagesManifest()
        const newEntry = {
            id: req.file.filename,
            filename: req.file.filename,
            name: providedName || toDisplayName(req.file.filename),
            url: urlPath,
            createdAt: new Date().toISOString()
        }
        manifest.push(newEntry)
        await writeUserImagesManifest(manifest)

        res.status(201).json({
            message: 'Imagen subida exitosamente',
            url: urlPath,
            filename: req.file.filename,
            entry: newEntry
        })
    } catch (err) {
        console.error('Error al subir imagen de usuario:', err)
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' })
            return res.status(400).json({ error: `Error al subir archivo: ${err.message}` })
        }
        if (err.message) return res.status(400).json({ error: err.message })
        res.status(500).json({ error: 'Error al subir la imagen' })
    }
})

// GET /api/uploads/user-images
router.get('/user-images', async (req, res) => {
    try {
        const manifest = await readUserImagesManifest()
        const merged = await inferMissingUserImages(manifest)
        // Ordenar por fecha (setup simple)
        merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

        console.log('--- DEBUG: GET /user-images ---');
        merged.forEach(m => console.log(`ID: ${m.id} | Filename: ${m.filename}`));
        console.log('-------------------------------');

        res.json({ images: merged })
    } catch (err) {
        console.error('Error listando imágenes de usuario:', err)
        res.status(500).json({ error: 'No se pudieron listar las imágenes' })
    }
})

// PUT /api/uploads/user-image/:id
router.put('/user-image/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' })

        const manifest = await readUserImagesManifest()
        // Por si acaso, hacemos sync (aunque costoso, asegura consistencia basica)
        const entries = await inferMissingUserImages(manifest)

        const entry = entries.find(e => e.id === id)
        if (!entry) return res.status(404).json({ error: 'Imagen no encontrada' })

        entry.name = name

        // Guardamos todo el array actualizado
        await writeUserImagesManifest(entries)

        res.json({ message: 'Nombre actualizado', entry })
    } catch (e) {
        console.error('Update image error:', e)
        res.status(500).json({ error: 'Error actualizando imagen' })
    }
})


// GET /api/uploads/video-packages
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

            // Guardar manifest
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
                if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'El archivo es demasiado grande' })
                return res.status(400).json({ error: `Error al subir archivo: ${err.message}` })
            }
            if (err.message) return res.status(400).json({ error: err.message })
            res.status(500).json({ error: 'Error al subir el video' })
        }
    }
)

// PUT /api/uploads/video-package/:id
router.put('/video-package/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' })

        const manifest = await readVideoPackagesManifest()
        // No forzamos inferencia acá, asumimos que existe si tiene ID.
        // Pero para ser consistentes, si quieres que videos en disco aparezcan, 
        // tendrías que haber hecho GET antes o correr inferencia aqui.
        // Corremos inferencia para asegurar que "id" (que es filename en los nuevos) exista.
        const entries = await inferMissingVideoPackages(manifest)

        const entry = entries.find(e => e.id === id)
        if (!entry) return res.status(404).json({ error: 'Video package no encontrado' })

        entry.name = name
        await writeVideoPackagesManifest(entries)

        res.json({ message: 'Nombre de video actualizado', entry })
    } catch (e) {
        console.error('Update video error:', e)
        res.status(500).json({ error: 'Error actualizando video' })
    }
})

export default router

import express from "express"
import { pool } from "../DB/dbpostgres.js"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = express.Router()

// configurar multer para uso local (mismo directorio que uploads.js)
const uploadDir = path.resolve("./backend/public/uploads/fonts")
try {
    fs.mkdirSync(uploadDir, { recursive: true })
} catch (e) { }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_.]/g, "_")
        cb(null, unique + "-" + safe)
    },
})

const upload = multer({ storage })
const uploadFields = upload.fields([
    { name: "font1", maxCount: 1 },
    { name: "font2", maxCount: 1 },
])

// GET /api/tipografias/activa - obtener la tipografía activa
router.get("/activa", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id_tipografia, nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, created_at FROM tipografia WHERE active = true LIMIT 1",
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No hay una tipografía activa" })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error al obtener la tipografía activa:", error)
        res.status(500).json({ error: "Error al obtener la tipografía activa" })
    }
})

// GET /api/tipografias - listar todas las tipografías
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id_tipografia, nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, created_at FROM tipografia ORDER BY created_at DESC",
        )
        res.json(result.rows)
    } catch (error) {
        console.error("Error al obtener las tipografías:", error)
        res.status(500).json({ error: "Error al obtener las tipografías" })
    }
})

// POST /api/tipografias - crear una tipografía
router.post("/", async (req, res) => {
    try {
        const { nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2 } = req.body

        // Validaciones básicas
        if (!nombre || !font1 || !font2) {
            return res.status(400).json({ error: "Faltan campos obligatorios (nombre, font1, font2)" })
        }

        const query = `INSERT INTO tipografia (nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id_tipografia, created_at`
        const values = [nombre, tamanio_titulo || 40, tamanio_subtitulo || 28, tamanio_parrafo || 16, font1, font2]
        const result = await pool.query(query, values)
        res.status(201).json({ id_tipografia: result.rows[0].id_tipografia, created_at: result.rows[0].created_at })
    } catch (error) {
        console.error("Error al agregar la tipografía:", error)
        res.status(500).json({ error: "Error al agregar la tipografía" })
    }
})

// PUT /api/tipografias/:id - actualizar
router.put("/:id", uploadFields, async (req, res) => {
    try {
        const { id } = req.params

        // Soportar tanto application/json como multipart/form-data
        // Evitar destructuring directo para no fallar cuando req.body === undefined
        let nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2

        if (req.is("multipart/form-data") || req.files) {
            // los campos vienen en req.body (strings) y los archivos en req.files
            nombre = req.body && req.body.nombre ? req.body.nombre : null
            tamanio_titulo = req.body && req.body.tamanio_titulo ? Number.parseInt(req.body.tamanio_titulo, 10) : null
            tamanio_subtitulo =
                req.body && req.body.tamanio_subtitulo ? Number.parseInt(req.body.tamanio_subtitulo, 10) : null
            tamanio_parrafo = req.body && req.body.tamanio_parrafo ? Number.parseInt(req.body.tamanio_parrafo, 10) : null

            // archivos procesados por multer
            if (req.files && req.files.font1 && req.files.font1[0]) {
                font1 = `/uploads/fonts/${req.files.font1[0].filename}`
            } else {
                font1 = req.body && req.body.font1 ? req.body.font1 : null
            }

            if (req.files && req.files.font2 && req.files.font2[0]) {
                font2 = `/uploads/fonts/${req.files.font2[0].filename}`
            } else {
                font2 = req.body && req.body.font2 ? req.body.font2 : null
            }
        } else {
            // JSON normal
            const body = req.body || {}
            nombre = body.nombre
            tamanio_titulo = body.tamanio_titulo
            tamanio_subtitulo = body.tamanio_subtitulo
            tamanio_parrafo = body.tamanio_parrafo
            font1 = body.font1
            font2 = body.font2
        }

        const query = `UPDATE tipografia SET nombre=$1, tamanio_titulo=$2, tamanio_subtitulo=$3, tamanio_parrafo=$4, font1=$5, font2=$6 WHERE id_tipografia=$7 RETURNING *`
        const values = [nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, id]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipograf\u00eda no encontrada" })
        }

        res.json({ message: "Tipograf\u00eda actualizada exitosamente", tipografia: result.rows[0] })
    } catch (error) {
        console.error("Error al actualizar la tipograf\u00eda:", error)
        res.status(500).json({ error: "Error al actualizar la tipograf\u00eda" })
    }
})

// POST /api/tipografias/:id/activate - activar una tipografía
router.post("/:id/activate", async (req, res) => {
    try {
        const { id } = req.params
        // Desactivar todas las tipografías
        await pool.query("UPDATE tipografia SET active = false")
        // Activar la tipografía seleccionada
        const result = await pool.query("UPDATE tipografia SET active = true WHERE id_tipografia = $1 RETURNING *", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }
        res.json({ message: "Tipografía activada exitosamente", tipografia: result.rows[0] })
    } catch (error) {
        console.error("Error al activar la tipografía:", error)
        res.status(500).json({ error: "Error al activar la tipografía" })
    }
})

// DELETE /api/tipografias/:id - eliminar
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("DELETE FROM tipografia WHERE id_tipografia = $1 RETURNING *", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }
        res.json({ message: "Tipografía eliminada exitosamente" })
    } catch (error) {
        console.error("Error al eliminar la tipografía:", error)
        res.status(500).json({ error: "Error al eliminar la tipografía" })
    }
})

export default router

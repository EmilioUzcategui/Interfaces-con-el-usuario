import express from "express"
import { pool } from "../DB/dbpostgres.js"

const router = express.Router()

// Obtener todas las tipografías
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tipografia ORDER BY created_at DESC")
        res.json(result.rows)
    } catch (error) {
        console.error("Error al obtener las tipografías:", error)
        res.status(500).json({ error: "Error al obtener las tipografías" })
    }
})

// Obtener tipografía activa
router.get("/activa", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tipografia WHERE active = true LIMIT 1")
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No hay tipografía activa" })
        }
        
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error al obtener la tipografía activa:", error)
        res.status(500).json({ error: "Error al obtener la tipografía activa" })
    }
})

// Obtener tipografía por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("SELECT * FROM tipografia WHERE id_tipografia = $1", [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }
        
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error al obtener la tipografía:", error)
        res.status(500).json({ error: "Error al obtener la tipografía" })
    }
})

// Crear nueva tipografía
router.post("/", async (req, res) => {
    try {
        const { nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, active } = req.body
        
        const result = await pool.query(
            "INSERT INTO tipografia (nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, active || false]
        )
        
        res.json({
            message: "Tipografía agregada exitosamente",
            tipografia: result.rows[0],
        })
    } catch (error) {
        console.error("Error al agregar la tipografía:", error)
        res.status(500).json({ error: "Error al agregar la tipografía" })
    }
})

// Actualizar tipografía
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, active } = req.body
        
        const result = await pool.query(
            "UPDATE tipografia SET nombre = $1, tamanio_titulo = $2, tamanio_subtitulo = $3, tamanio_parrafo = $4, font1 = $5, font2 = $6, active = $7 WHERE id_tipografia = $8 RETURNING *",
            [nombre, tamanio_titulo, tamanio_subtitulo, tamanio_parrafo, font1, font2, active, id]
        )
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }
        
        res.json({
            message: "Tipografía actualizada exitosamente",
            tipografia: result.rows[0],
        })
    } catch (error) {
        console.error("Error al actualizar la tipografía:", error)
        res.status(500).json({ error: "Error al actualizar la tipografía" })
    }
})

// Activar una tipografía (desactiva las demás)
router.put("/:id/activar", async (req, res) => {
    try {
        const { id } = req.params
        
        // Primero desactivar todas
        await pool.query("UPDATE tipografia SET active = false")
        
        // Luego activar la seleccionada
        const result = await pool.query(
            "UPDATE tipografia SET active = true WHERE id_tipografia = $1 RETURNING *",
            [id]
        )
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }
        
        res.json({
            message: "Tipografía activada exitosamente",
            tipografia: result.rows[0],
        })
    } catch (error) {
        console.error("Error al activar la tipografía:", error)
        res.status(500).json({ error: "Error al activar la tipografía" })
    }
})

// Eliminar tipografía
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("DELETE FROM tipografia WHERE id_tipografia = $1 RETURNING *", [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipografía no encontrada" })
        }

        res.json({
            message: "Tipografía eliminada exitosamente",
            tipografia: result.rows[0],
        })
    } catch (error) {
        console.error("Error al eliminar la tipografía:", error)
        res.status(500).json({ error: "Error al eliminar la tipografía" })
    }
})

export default router


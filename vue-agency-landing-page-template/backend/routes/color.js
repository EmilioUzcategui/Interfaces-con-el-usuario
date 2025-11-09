import express from "express"
//import { pool } from '../DB/db.js'; deshabilitado para funcionar con postgres
import { pool } from "../DB/dbpostgres.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const colors = await pool.query("SELECT * FROM colors ORDER BY created_at DESC")
        res.json(colors.rows)
    } catch (error) {
        console.error("Error al obtener los colores:", error)
        res.status(500).json({ error: "Error al obtener los colores" })
    }
})

// Endpoint para obtener paleta por nombre
router.get("/by-name/:name", async (req, res) => {
    try {
        const { name } = req.params
        const result = await pool.query("SELECT * FROM colors WHERE name = $1", [name])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Paleta no encontrada" })
        }
        
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error al obtener la paleta:", error)
        res.status(500).json({ error: "Error al obtener la paleta" })
    }
})

// Endpoint para inicializar paletas por defecto
router.post("/init-defaults", async (req, res) => {
    try {
        // Verificar si ya existen las paletas
        const existing = await pool.query("SELECT name FROM colors WHERE name IN ('original', 'daltonicos')")
        const existingNames = existing.rows.map(row => row.name)
        
        const palettes = []
        
        // Crear paleta original si no existe
        if (!existingNames.includes('original')) {
            const originalResult = await pool.query(
                "INSERT INTO colors (name, color1, color2, color3, color4, color5, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                ['original', '#007bff', '#ff5900', '#343a40', '#28a745', '#ffffff', false]
            )
            palettes.push(originalResult.rows[0])
        }
        
        // Crear paleta daltónica si no existe
        if (!existingNames.includes('daltonicos')) {
            const daltonicResult = await pool.query(
                "INSERT INTO colors (name, color1, color2, color3, color4, color5, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                ['daltonicos', '#1e3a8a', '#dc2626', '#1f2937', '#059669', '#f8fafc', false]
            )
            palettes.push(daltonicResult.rows[0])
        }
        
        res.json({
            message: "Paletas inicializadas correctamente",
            palettes: palettes
        })
    } catch (error) {
        console.error("Error al inicializar paletas:", error)
        res.status(500).json({ error: "Error al inicializar paletas" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, color1, color2, color3, color4, color5 } = req.body
        const result = await pool.query(
            "INSERT INTO colors (name, color1, color2, color3, color4, color5) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, color1, color2, color3, color4, color5],
        )
        res.json({
            message: "Color agregado exitosamente",
            palette: result.rows[0],
        })
    } catch (error) {
        console.error("Error al agregar el color:", error)
        res.status(500).json({ error: "Error al agregar el color" })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { name, color1, color2, color3, color4, color5 } = req.body
        const result = await pool.query(
            "UPDATE colors SET name = $1, color1 = $2, color2 = $3, color3 = $4, color4 = $5, color5 = $6 WHERE id_color = $7 RETURNING *",
            [name, color1, color2, color3, color4, color5, id],
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Paleta no encontrada" })
        }
        res.json({
            message: "Paleta actualizada exitosamente",
            palette: result.rows[0],
        })
    } catch (error) {
        console.error("Error al actualizar la paleta:", error)
        res.status(500).json({ error: "Error al actualizar la paleta" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("DELETE FROM colors WHERE id_color = $1 RETURNING *", [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Paleta no encontrada" })
        }

        res.json({
            message: "Paleta eliminada exitosamente",
            palette: result.rows[0],
        })
    } catch (error) {
        console.error("Error al eliminar la paleta:", error)
        res.status(500).json({ error: "Error al eliminar la paleta" })
    }
})

export default router

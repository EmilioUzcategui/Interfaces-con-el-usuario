// Script para inicializar las paletas por defecto
import { pool } from './DB/dbpostgres.js'

async function initPalettes() {
    try {
        console.log('🎨 Inicializando paletas por defecto...')
        
        // Verificar si ya existen las paletas
        const existing = await pool.query("SELECT name FROM colors WHERE name IN ('original', 'daltonicos')")
        const existingNames = existing.rows.map(row => row.name)
        
        console.log('Paletas existentes:', existingNames)
        
        // Crear paleta original si no existe
        if (!existingNames.includes('original')) {
            console.log('📝 Creando paleta original...')
            await pool.query(
                "INSERT INTO colors (name, color1, color2, color3, color4, color5, active) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                ['original', '#007bff', '#ff5900', '#343a40', '#28a745', '#ffffff', false]
            )
            console.log('✅ Paleta original creada')
        } else {
            console.log('ℹ️ Paleta original ya existe')
        }
        
        // Crear paleta daltónica si no existe
        if (!existingNames.includes('daltonicos')) {
            console.log('📝 Creando paleta daltónica...')
            await pool.query(
                "INSERT INTO colors (name, color1, color2, color3, color4, color5, active) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                ['daltonicos', '#1e3a8a', '#dc2626', '#1f2937', '#059669', '#f8fafc', false]
            )
            console.log('✅ Paleta daltónica creada')
        } else {
            console.log('ℹ️ Paleta daltónica ya existe')
        }
        
        console.log('🎉 Inicialización de paletas completada')
        
    } catch (error) {
        console.error('❌ Error inicializando paletas:', error)
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    initPalettes().then(() => {
        console.log('Script completado')
        process.exit(0)
    }).catch(error => {
        console.error('Error:', error)
        process.exit(1)
    })
}

export default initPalettes

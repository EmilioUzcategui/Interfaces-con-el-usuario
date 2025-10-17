import express from 'express';
import bcrypt from 'bcryptjs';
//import { pool } from '../DB/db.js'; deshabilitado para funcionar con postgres
import { pool } from '../DB/dbpostgres.js';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }
        /*
        // Verificar si el email ya existe
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        */

        const existingUser = await pool.query(
            'SELECT id_user FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario
        /*
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );*/

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id_user',
            [name, email, hashedPassword]
        );

        res.json({
            message: 'Usuario registrado exitosamente',
            userId: result.rows[0].id_user
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        /*
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        const user = users[0];
        */

        // Buscar usuario
        const users = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (users.rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        const user = users.rows[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        res.json({
            message: 'Login exitoso',
            user: {
                id_user: user.id_user,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
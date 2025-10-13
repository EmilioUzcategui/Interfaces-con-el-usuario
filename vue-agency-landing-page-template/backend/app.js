import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

// app.js
import { pool } from './DB/db.js';

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Conectado a PostgreSQL:');
        console.log('Hora del servidor:', result.rows[0]);
    } catch (err) {
        console.error('❌ Error al conectar a PostgreSQL:', err);
    }
}

testConnection();

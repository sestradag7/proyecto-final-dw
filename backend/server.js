const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Estudiantes
app.post('/api/estudiantes', async (req, res) => {
  try {
    const { nombre, edad, nivel } = req.body;
    const [result] = await db.query(
      'INSERT INTO estudiantes (nombre, edad, nivel) VALUES (?, ?, ?)',
      [nombre, edad, nivel]
    );
    res.status(201).json({ id: result.insertId, nombre, edad, nivel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/estudiantes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiantes ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Progresos y Reportes
app.post('/api/progreso', async (req, res) => {
  try {
    const { estudiante_id, actividad_id, puntaje, total_preguntas } = req.body;
    const [result] = await db.query(
      'INSERT INTO progresos (estudiante_id, actividad_id, puntaje, total_preguntas) VALUES (?, ?, ?, ?)',
      [estudiante_id, actividad_id, puntaje, total_preguntas]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/progreso', async (req, res) => {
  try {
    const { estudiante_id } = req.query;
    let query = `
      SELECT p.id, e.nombre AS estudiante, a.nombre AS actividad, 
             p.puntaje, p.total_preguntas, p.fecha 
      FROM progresos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN actividades a ON p.actividad_id = a.id
    `;
    let params = [];
    if (estudiante_id) {
      query += ' WHERE p.estudiante_id = ?';
      params.push(estudiante_id);
    }
    query += ' ORDER BY p.fecha DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});
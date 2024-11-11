import express from 'express';
import cors from 'cors'; // Para evitar errores que surjan en relación a alguna medida de seguridad que tengan los navegadores
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPreference } from './mercado_pago.js';

dotenv.config(); //carga las variables de entorno definidas en el archivo .env y permite acceder a ellas a través de process.env

const app = express(); // Inicializa express
const PORT = process.env.PORT || 3000; // Configura el puerto para levantar el servidor

// Ruta para obtener la Public Key de Mercado Pago
app.get('/get_public_key', (req, res) => {
  res.json({ publicKey: process.env.PUBLIC_KEY });
});

// Configuración de __dirname para ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Habilita cors (le dice que utilice cors)
app.use(express.json()); // Le pide a express que utilice el formato json, es decir que use json en las solicitudes

// Middleware para servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Ruta para la página "Inicio/Index"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Ruta para la página "Nosotros"
app.get('/nosotros', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'nosotros.html'));
});

// Ruta para la página "Contacto"
app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'contacto.html'));
});

app.post('/create_preference', createPreference);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

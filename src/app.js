const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Importar rutas
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

// Definir rutas base
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);

module.exports = app;
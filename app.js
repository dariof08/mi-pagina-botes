const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Bote = require('./models/bote');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
}).catch(err => {
  console.error('❌ Error de conexión:', err);
});

// Rutas

// Crear bote
app.post('/botes', async (req, res) => {
  try {
    const existe = await Bote.findOne({ id: req.body.id });
    if (existe) {
      return res.status(400).json({ error: 'Ya existe un bote con ese ID' });
    }

    const nuevo = new Bote(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el bote' });
  }
});

// Obtener todos los botes
app.get('/botes', async (req, res) => {
  try {
    const botes = await Bote.find();
    res.json(botes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los botes' });
  }
});

// Eliminar bote
app.delete('/botes/:id', async (req, res) => {
  try {
    const eliminado = await Bote.findOneAndDelete({ id: req.params.id });
    if (!eliminado) return res.status(404).json({ error: 'No se encontró el bote' });
    res.json({ mensaje: 'Bote eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el bote' });
  }
});

// Actualizar bote
app.put('/botes/:id', async (req, res) => {
  try {
    const actualizado = await Bote.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'No se encontró el bote' });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el bote' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

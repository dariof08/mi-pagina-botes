const mongoose = require('mongoose');

const boteSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  tipoResiduo: String,
  ubicacion: String,
  capacidad: Number
});

module.exports = mongoose.model('Bote', boteSchema);


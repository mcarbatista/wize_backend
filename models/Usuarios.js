const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuariosSchema = new mongoose.Schema({
    nombre: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'agent'], required: true },
}, { timestamps: true });

UsuariosSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

module.exports = mongoose.model('Usuarios', UsuariosSchema, "usuarios");



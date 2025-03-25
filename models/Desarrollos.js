const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const DesarrollosSchema = new mongoose.Schema({
    Proyecto_Nombre: String,
    Precio: Number,
    Precio_Con_Formato: String,
    Estado: String,
    Resumen: String,
    Descripcion: String,
    Descripcion_Expandir: String,
    Imagen: String,
    Galeria: { type: [ImageSchema], default: [] },
    Ciudad: String,
    Barrio: String,
    Ubicacion: String,
    Tipo: String,
    Entrega: String,
    Dormitorios: String,
    Pisos: String,
    Gastos_Ocupacion: String,
    Forma_de_Pago: String,
    Owner: String,
    Celular: String,
    Email: String,
    Created_Date: Date,
    Updated_Date: Date
}, { timestamps: true });

module.exports = mongoose.model("Desarrollo", DesarrollosSchema);

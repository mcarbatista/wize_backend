const mongoose = require("mongoose");

const PropiedadesSchema = new mongoose.Schema({
    Titulo: String,
    Precio: String,
    Precio_Numerico: Number,
    Estado: String,
    Resumen: String,
    Imagen: String,
    Galeria: Array,
    Descripcion: Object,
    Ciudad: String,
    Barrio: String,
    Ubicacion: String,
    Tipo: String,
    Entrega: String,
    Dormitorios: Number,
    Banos: Number,
    Tamano_m2: String,
    Plano: Array,
    ID: String,
    Proyecto_ID: String,
    Proyecto_Nombre: String,
    Unidad: String,
    Forma_de_Pago: String,
    Celular: String,
    Email: String,
    Owner: String,
    Metraje: String,
    Created_Date: Date,
    Updated_Date: Date
}, { strict: false });

module.exports = mongoose.model("Propiedades", PropiedadesSchema, "propiedades");

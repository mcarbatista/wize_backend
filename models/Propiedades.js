const mongoose = require("mongoose");

const PropiedadesSchema = new mongoose.Schema({
    Title: String,
    Precio: String,
    Precio_Numerico: Number,
    Estado: String,
    Resumen: String,
    Image: String,
    Gallery: Array,
    Descripción_propiedad: String,
    Ciudad: String,
    Barrio: String,
    Ubicacion: String,
    Tipo_de_Propiedad: String,
    Entrega: String,
    num_Dorm: Number,
    num_Banos: Number,
    Tamano_m2: String,
    Plano: Array,
    ID: String,
    Propiedades: String,
    Owner: String,
    Forma_de_Pago: String,
    Celular: String,
    Email: String,
    Created_Date: Date,
    Updated_Date: Date
}, { strict: false });

module.exports = mongoose.model("Propiedades", PropiedadesSchema);

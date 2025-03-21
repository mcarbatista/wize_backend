const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const DesarrollosSchema = new mongoose.Schema({
    Proyecto_Nombre: String,
    Precio: String,
    Precio_Numerico: Number,
    Estado: String,
    Resumen: String,
    Imagen: String,
    Galeria: { type: [ImageSchema], default: [] },
    Descripcion: Object,
    Ciudad: String,
    Barrio: String,
    Ubicacion: String,
    Tipo: String,
    Entrega: String,
    Dormitorios: Number,
    Pisos: String,
    Gastos_Ocupacion: String,
    Proyecto_ID: { type: String, default: () => new UUID().toString() },
    Forma_de_Pago: String,
    Celular: String,
    Email: String,
    Owner: String,
    Created_Date: Date,
    Updated_Date: Date
}, { strict: false });

// Ensure the UUID is used correctly
DesarrollosSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = new UUID().toString();
    }
    next();
});

const Desarrollo = mongoose.model("Desarrollos", DesarrollosSchema, "desarrollos");
module.exports = Desarrollo;



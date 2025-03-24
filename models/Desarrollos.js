const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const DesarrollosSchema = new mongoose.Schema({
    _id: ObjectId("..."),
    Proyecto_Nombre: String,
    Precio: Number,
    Precio_Con_Formato: String,
    Estado: String,
    Resumen: String,
    Descripcion: Object,
    Descripcion_Expandir: Object,
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
}, { strict: false });

// Ensure the UUID is used correctly
DesarrollosSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = new UUID().toString();
    }
    next();
});

module.exports = mongoose.model('Desarrollo', DesarrolloSchema);



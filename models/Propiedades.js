const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const PropiedadesSchema = new mongoose.Schema({
    _id: ObjectId("..."),
    Titulo: String,
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
    Banos: Number,
    Tamano_m2: String,
    Plano: { type: [ImageSchema], default: [] },
    DesarrolloId: { type: mongoose.Schema.Types.ObjectId, ref: 'Desarrollo' },
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

// Ensure the UUID is used correctly
PropiedadesSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = new UUID().toString();
    }
    next();
});

module.exports = mongoose.model('Propiedad', PropiedadSchema);



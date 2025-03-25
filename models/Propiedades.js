const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const PropiedadesSchema = new mongoose.Schema({
    Titulo: String,
    Precio: Number,
    Precio_Con_Formato: String,
    Estado: String,
    Imagen: String,
    Galeria: { type: [ImageSchema], default: [] },
    Tipo: String,
    Entrega: String,
    Dormitorios: String,
    Banos: String,
    Tamano_m2: Number,
    Metraje: Number,
    Piso: String,
    Plano: { type: [ImageSchema], default: [] },
    Unidad: String,
    Forma_de_Pago: String,
    Gastos_Ocupacion: String,
    Owner: String,
    Celular: String,
    Email: String,
    DesarrolloId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Desarrollo",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Propiedad", PropiedadesSchema);

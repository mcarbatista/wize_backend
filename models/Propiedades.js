const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const PropiedadesSchema = new mongoose.Schema({
    Titulo: { type: String, required: true },
    Precio: { type: Number, required: true },
    Precio_Con_Formato: String,
    Estado: { type: String },
    Imagen: String,
    Galeria: { type: [ImageSchema], default: [] },
    Tipo: String,
    Entrega: String,
    Dormitorios: { type: String, required: true },
    Banos: { type: String, required: true },
    Tamano_m2: { type: Number, required: true },
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
        type: String,
        ref: "Desarrollo",
        default: ""
    },
    Ciudad: { type: String, required: true },
    Barrio: { type: String, required: true },
    Ubicacion: String,
    Resumen: { type: String, required: true },
    Descripcion: String,
    Descripcion_Expandir: String,
    syncInfoCasas: { type: Boolean, default: false }
}, { timestamps: true, collection: "propiedades" });

module.exports = mongoose.model("Propiedad", PropiedadesSchema);

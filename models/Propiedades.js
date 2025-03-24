// models/Propiedades.js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    description: { type: String },
    position: { type: Number },
});

const PropiedadesSchema = new mongoose.Schema(
    {
        Titulo: String,
        Precio: Number,
        Precio_Con_Formato: String,
        Estado: String,
        Resumen: String,
        Descripcion: { type: mongoose.Schema.Types.Descripcion, ref: "Desarrollos" },
        Descripcion_Expandir: { type: mongoose.Schema.Types.Descripcion_Expandir, ref: "Desarrollos" },
        Imagen: String,
        Galeria: { type: [ImageSchema], default: [] },
        Ciudad: String,
        Barrio: String,
        Ubicacion: String,
        Tipo: String,
        Entrega: String,
        Dormitorios: String,
        Banos: String,
        Tamano_m2: Number,
        Metraje: Number,
        Piso: String,
        Plano: { type: [ImageSchema], default: [] },
        DesarrolloId: { type: mongoose.Schema.Types.ObjectId, ref: "Desarrollos" },
        Unidad: String,
        Forma_de_Pago: String,
        Gastos_Ocupacion: String,
        Owner: String,
        Celular: String,
        Email: String,
        Created_Date: { type: Date, default: Date.now },
        Updated_Date: { type: Date, default: Date.now },
    },
    { timestamps: true } // crea automaticamente createdAt y updatedAt
);

module.exports = mongoose.model("Propiedad", PropiedadesSchema);

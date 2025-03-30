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
    Pisos: String,
    Gastos_Ocupacion: String,
    Forma_de_Pago: String,
    Owner: String,
    Mapa: String,
    Created_Date: Date,
    Updated_Date: Date
}, { timestamps: true, collection: "desarrollos" });

// 1) Pre-save: whenever we do doc.save()
DesarrollosSchema.pre("save", function (next) {
    // 'this' is the actual document about to be saved
    if (typeof this.Precio === "number") {
        // e.g. "100000" -> "100,000"
        this.Precio_Con_Formato = this.Precio.toLocaleString("es-ES");
    } else {
        this.Precio_Con_Formato = "";
    }
    next();
});

// 2) Pre-findOneAndUpdate: whenever we do findOneAndUpdate() or findByIdAndUpdate()
DesarrollosSchema.pre("findOneAndUpdate", function (next) {
    // 'this' is the Mongoose query
    const update = this.getUpdate();
    if (update && typeof update.Precio === "number") {
        update.Precio_Con_Formato = update.Precio.toLocaleString("es-ES");
    } else if (update && update.$set && typeof update.$set.Precio === "number") {
        // In case the update is nested inside $set
        update.$set.Precio_Con_Formato = update.$set.Precio.toLocaleString("es-ES");
    }
    next();
});

module.exports = mongoose.model("Desarrollo", DesarrollosSchema);

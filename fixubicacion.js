// fixUbicacion.js
const mongoose = require("mongoose");
const Desarrollo = require("./models/desarrollos.js"); // ⚠️ ajustá el path si es distinto

mongoose.connect("mongodb+srv://wize_mongodb_atlas:z1eSfqh2MmR900UA@wize.8s9af.mongodb.net/?retryWrites=true&w=majority&appName=wize", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function fixUbicaciones() {
    try {
        const desarrollos = await Desarrollo.find({});

        for (const dev of desarrollos) {
            if (typeof dev.Ubicacion === "object" && dev.Ubicacion.lat && dev.Ubicacion.lng) {
                const ubicacionString = `${dev.Ubicacion.lat},${dev.Ubicacion.lng}`;
                dev.Ubicacion = ubicacionString;
                await dev.save();
                console.log(`✅ Actualizado: ${dev.Proyecto_Nombre} → ${ubicacionString}`);
            }
        }

        console.log("🚀 ¡Todos los desarrollos corregidos!");
        mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error al corregir ubicaciones:", err);
        mongoose.disconnect();
    }
}

fixUbicaciones();

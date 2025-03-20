const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ ADD THIS LINE
const Propiedades = require("../models/Propiedades");

// GET all propiedades
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedades.find({});
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // ✅ Extract ID from URL params

        console.log("🔍 Searching for property with ID:", id); // Debugging log

        // ✅ Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid MongoDB ObjectId:", id);
            return res.status(400).json({ error: "Invalid Property ID" });
        }

        // ✅ Convert to ObjectId and query the database
        const propiedad = await Propiedades.findOne({ _id: new mongoose.Types.ObjectId(id) });
        console.log("Id is:", id);
        if (!propiedad) {
            console.log("❌ No property found for ID:", id);
            return res.status(404).json({ message: "Property Not Found" });
        }

        console.log("✅ Found Property:", propiedad);
        res.json(propiedad);
    } catch (error) {
        console.error("❌ Error fetching property:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

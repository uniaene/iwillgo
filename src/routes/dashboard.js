// src/routes/dashboard.js
import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

/**
 * Retorna todos os leads (ordenados por data decrescente)
 */
router.get("/leads", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 }).limit(100).lean();
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar cadastros" });
    }
});

export default router;

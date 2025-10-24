import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
    try {
        const { fullname, email, whatsapp, course, local } = req.body;

        if (!fullname || !email || !whatsapp || !course || !local) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        const lead = await Lead.create({ fullname, email, whatsapp, course, local });
        res.status(201).json({ success: true, lead });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
};

export const drawLead = async (req, res) => {
    try {
        const count = await Lead.countDocuments();
        const random = Math.floor(Math.random() * count);
        const winner = await Lead.findOne().skip(random);
        res.json({ winner });
    } catch (err) {
        res.status(500).json({ error: "Erro ao sortear" });
    }
};

export const getAllLeads = async (req, res) => {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
};

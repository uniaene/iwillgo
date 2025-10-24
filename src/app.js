import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import leadsRoutes from "./routes/leads.js";
import localsRoutes from "./routes/locals.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();
const app = express();

// 🧩 Habilitar CORS
app.use(cors({
    origin: [
        "https://uniaene.edu.br/sorteio",
        "https://www.uniaene.edu.br/sorteio",
        "https://sorteio.uniaene.edu.br",  // seu domínio oficial
        "http://sorteio.uniaene.edu.br",   // e versão http, se ainda não tiver SSL
        "http://localhost"                 // útil para testes locais
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cors());
app.use(express.json());
app.use("/leads", leadsRoutes);
app.use("/locals", localsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(express.static("public")); // serve dashboard.html

import { startSyncWorkerEvery5s } from "./workers/syncToMySQL.js";

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
        startSyncWorkerEvery5s(); // 🔁 inicia o worker automático
    })
    .catch((err) => console.error("Erro MongoDB:", err));

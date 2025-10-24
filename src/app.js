import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import leadsRoutes from "./routes/leads.js";
import localsRoutes from "./routes/locals.js";
import dashboardRoutes from "./routes/dashboard.js";
import { startSyncWorkerEvery5s } from "./workers/syncToMySQL.js";

dotenv.config();
const app = express();

// 🚨 Força os cabeçalhos de CORS manualmente (antes de tudo)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 🧩 (opcional) também ativa o middleware oficial do cors
app.use(cors({ origin: "*" }));

// 🧱 Middlewares principais
app.use(express.json());
app.use("/leads", leadsRoutes);
app.use("/locals", localsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(express.static("public")); // serve dashboard.html

// 🚀 Inicia servidor e worker
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
        startSyncWorkerEvery5s(); // 🔁 inicia o worker automático
    })
    .catch((err) => console.error("Erro MongoDB:", err));

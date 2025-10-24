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

// 🧩 Habilitar CORS apenas para domínios permitidos
app.use(cors({
    origin: [
        "https://uniaene.edu.br",
        "https://www.uniaene.edu.br",
        "https://sorteio.uniaene.edu.br",
        "http://sorteio.uniaene.edu.br",
        "http://localhost",
        "http://13.221.21.114", // ✅ adiciona o IP público do servidor
        "http://13.221.21.114:3000" // ✅ adiciona com a porta também
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));

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

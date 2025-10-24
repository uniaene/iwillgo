import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import leadsRoutes from "./routes/leads.js";
import localsRoutes from "./routes/locals.js";
import dashboardRoutes from "./routes/dashboard.js";
import { startSyncWorkerEvery5s } from "./workers/syncToMySQL.js";

dotenv.config();
const app = express();

// 🌐 CORS liberado geral
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// 🔧 Middleware oficial do cors também liberando geral
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,OPTIONS" }));

// 🧱 Middlewares principais
app.use(express.json());
app.use("/leads", leadsRoutes);
app.use("/locals", localsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(express.static("public")); // serve dashboard.html

// 🧩 Rota raiz para teste
app.get("/", (req, res) => {
    res.send("🚀 Servidor Node.js funcionando perfeitamente via HTTPS e CORS liberado!");
});

// 🔁 Worker automático
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");
        app.listen(3000, "0.0.0.0", () => {
            console.log("🚀 Servidor rodando na porta 3000");
        });
        startSyncWorkerEvery5s();
    })
    .catch((err) => console.error("Erro MongoDB:", err));

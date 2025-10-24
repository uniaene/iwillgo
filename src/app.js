import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import leadsRoutes from "./routes/leads.js";
import localsRoutes from "./routes/locals.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();
const app = express();

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
        // app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
        app.listen(3000, '0.0.0.0', () => {
            console.log('Servidor rodando na porta 3000');
        });

        startSyncWorkerEvery5s(); // 🔁 inicia o worker automático
    })
    .catch((err) => console.error("Erro MongoDB:", err));

app.get("/", (req, res) => {
    res.send("🚀 Servidor Node.js funcionando perfeitamente via HTTPS!");
});

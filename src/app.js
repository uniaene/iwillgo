/**
 * app.js — versão final com HTTPS nativo para produção
 * UNIAENE - Sorteio
 */

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";

import leadsRoutes from "./routes/leads.js";
import localsRoutes from "./routes/locals.js";
import dashboardRoutes from "./routes/dashboard.js";
import { startSyncWorkerEvery5s } from "./workers/syncToMySQL.js";

dotenv.config();
const app = express();

// 🧱 Caminhos dos certificados (emitidos com certbot)
const SSL_KEY_PATH = "/etc/letsencrypt/live/sorteio.uniaene.edu.br/privkey.pem";
const SSL_CERT_PATH = "/etc/letsencrypt/live/sorteio.uniaene.edu.br/fullchain.pem";

// 🚨 Força CORS (frontend HTTPS acessando backend HTTPS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 🧩 Middleware oficial CORS (com fallback)
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

// 🧱 Middlewares principais
app.use(express.json());
app.use("/leads", leadsRoutes);
app.use("/locals", localsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(express.static("public")); // serve o dashboard.html, caso precise

// 🔌 Conecta ao MongoDB e inicia o servidor HTTPS
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conectado ao MongoDB");

        // ⚙️ Configurações SSL
        const options = {
            key: fs.readFileSync(SSL_KEY_PATH),
            cert: fs.readFileSync(SSL_CERT_PATH),
        };

        // 🚀 Sobe o servidor HTTPS
        https.createServer(options, app).listen(443, () => {
            console.log("🔒 Servidor HTTPS rodando na porta 443");
        });

        // 🔁 Worker de sincronização
        startSyncWorkerEvery5s();
    })
    .catch((err) => console.error("❌ Erro MongoDB:", err));

// src/workers/syncToMySQL.js
import Lead from "../models/Lead.js";
import { mysqlPool } from "../database/mysql.js";

export async function syncToMySQLBatch() {
    // busca apenas leads não sincronizados
    const unsynced = await Lead.find({ synced: { $ne: true } }).limit(200).lean();
    if (!unsynced.length) return;

    const now = new Date();
    const values = unsynced.map(l => [
        l.fullname,
        "UNIAENE",
        "confirmed",
        now,
        now,
        null
    ]);

    const sql = `
    INSERT IGNORE INTO users (name, uniao, status, checkin, created_at, updated_at)
    VALUES ?
  `;

    const conn = await mysqlPool.getConnection();
    try {
        const [result] = await conn.query(sql, [values]);
        console.log(`✅ Sync: ${result.affectedRows} novos nomes enviados à tabela "users"`);

        // marca os enviados como sincronizados
        const ids = unsynced.map(l => l._id);
        await Lead.updateMany(
            { _id: { $in: ids } },
            { $set: { synced: true, syncedAt: now } }
        );
    } catch (err) {
        console.error("❌ Erro ao sincronizar com MySQL:", err);
    } finally {
        conn.release();
    }
}

export function startSyncWorkerEvery5s() {
    console.log("⏱️  Worker de sincronização iniciado (a cada 5s)");
    setInterval(async () => {
        try {
            await syncToMySQLBatch();
        } catch (err) {
            console.error("Erro no worker:", err);
        }
    }, 5000);
}

// src/database/mysql.js
import mysql from "mysql2/promise";

export const mysqlPool = mysql.createPool({
    host: "193.203.175.192",
    user: "u233696612_sorteio",
    password: "8Piyp*s2L",
    database: "u233696612_sorteio",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4_general_ci"
});

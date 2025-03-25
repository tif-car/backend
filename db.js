import fs from "fs";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Load SSL Certificate for Azure MySQL
const sslCertPath = "./BaltimoreCyberTrustRoot.crt.pem";
const sslCert = fs.readFileSync(sslCertPath, "utf8");

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Default MySQL port
    ssl: {
        rejectUnauthorized: false,
        ca: sslCert,
    },
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on server capacity
    queueLimit: 0,
});

// Log connection success
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to MySQL Database (Pool Mode)");
    connection.release(); // Release test connection
});

// Export the connection pool as a promise-based interface
export default pool.promise();

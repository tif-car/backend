import fs from 'fs';
import mysql from 'mysql2';


// Load SSL Certificate for Azure MySQL
const sslCertPath = './BaltimoreCyberTrustRoot.crt.pem';
const sslCert = fs.readFileSync(sslCertPath);

// MySQL Connection with SSL
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: sslCert,
        rejectUnauthorized: false
    }
});

// Connect to MySQL
dbConnection.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

module.exports = {dbConnection};
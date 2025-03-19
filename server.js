
/*
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';

dotenv.config();

const app = express();   //no express is allowed
app.use(cors());
app.use(express.json());

// Load SSL Certificate for Azure MySQL
const sslCertPath = './BaltimoreCyberTrustRoot.crt.pem'; // Ensure this file is in your backend directory
const sslCert = fs.readFileSync(sslCertPath);

// MySQL Connection with SSL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { 
        ssl: { ca: sslCert }  // Set CA certificate
    }
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// API Route to Fetch Data
app.get('/api/data', (req, res) => {
    db.query("SELECT * FROM animal", (err, results) => {
        if (err) {
            console.error("Data Retrieval Error:", err);
            res.status(500).json({ error: "Database error" });
            return;
        }
        res.json(results);
    });
});

// Determine Local & Azure URLs
const PORT = process.env.PORT || 8080;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find(iface => iface && iface.family === 'IPv4' && !iface.internal)?.address || 'localhost';

const localURL = `http://${localIP}:${PORT}`;
const azureURL = `https://${process.env.WEBSITE_HOSTNAME || 'zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net'}`;

// Start the Server
app.listen(PORT, '0.0.0.0', () => {
    console.log("Server is running!");
    console.log(`Local:  ${localURL}/api/data`);
    console.log(`Azure:  ${azureURL}/api/data\n`);
});

*/

//express is not allowed!!!
import http from 'http'; // Use Node.js HTTP module
import mysql from 'mysql2';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';

dotenv.config();

// Load SSL Certificate for Azure MySQL
const sslCertPath = './BaltimoreCyberTrustRoot.crt.pem'; // Ensure this file is in your backend directory
const sslCert = fs.readFileSync(sslCertPath);

// MySQL Connection with SSL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: sslCert, // Use the downloaded SSL certificate
        rejectUnauthorized: false // Allow self-signed certificate
    }
});


// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/data') {
        db.query("SELECT * FROM animal", (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Database error" }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Determine Local & Azure URLs
const PORT = process.env.PORT || 8080;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find(iface => iface && iface.family === 'IPv4' && !iface.internal)?.address || 'localhost';

const localURL = `http://${localIP}:${PORT}`;
const azureURL = `https://${process.env.WEBSITE_HOSTNAME || 'zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net'}`;

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log("Server is running!");
    console.log(`Local:  ${localURL}/api/data`);
    console.log(`Azure:  ${azureURL}/api/data\n`);
});





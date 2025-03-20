/*
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

*/
import http from 'http';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';
import url from 'url';
import cors from "cors";

dotenv.config();

// Create a CORS middleware
const corsMiddleware = cors({
	origin: ["https://frontend-blond-five.vercel.app", "http://localhost:5173"],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});

// Load SSL Certificate for Azure MySQL
const sslCertPath = './BaltimoreCyberTrustRoot.crt.pem';
const sslCert = fs.readFileSync(sslCertPath);

// MySQL Connection with SSL
const db = mysql.createConnection({
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
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// **Dynamic Route Handlers**
const routes = {
    "/api/getUserRole": (req, res, queryParams) => {
        const email = queryParams.email;

        // Static email for the request
        if (email !== 'employee1@email.com') {
            return sendResponse(res, 400, { error: "Invalid email" });
        }

        // Updated SQL query based on new structure
        const sql = `SELECT r.role_types 
                     FROM employee e 
                     JOIN role r ON e.Role = r.role_typeID 
                     WHERE e.email = ?`;

        db.query(sql, [email], (err, result) => {
            if (err) return sendResponse(res, 500, { error: "Database error" });
            if (result.length === 0) return sendResponse(res, 404, { error: "User not found" });

            sendResponse(res, 200, { role_type: result[0].role_types });
        });
    },

    // Other routes here...
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// **Create the HTTP server with CORS and dynamic routing**
const server = http.createServer((req, res) => {
    corsMiddleware(req, res, () => {
    // **Handle API Routes**
    const parsedUrl = url.parse(req.url, true);
    const routeHandler = routes[parsedUrl.pathname];

    if (routeHandler) {
        routeHandler(req, res, parsedUrl.query);
    } else {
        sendResponse(res, 404, { error: "Route not found. Ensure the endpoint is correct." });
    }
    });
});

// **Determine Local & Azure URLs**
const PORT = process.env.PORT || 8080;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find(iface => iface && iface.family === 'IPv4' && !iface.internal)?.address || 'localhost';

const localURL = `http://${localIP}:${PORT}`;
const azureURL = `https://${process.env.WEBSITE_HOSTNAME || 'zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net'}`;

// **Start the server**
server.listen(PORT, '0.0.0.0', () => {
    console.log("Server is running!");
    Object.keys(routes).forEach(route => {
        console.log(`Local:  ${localURL}${route}`);
        console.log(`Azure:  ${azureURL}${route}\n`);
    });
});






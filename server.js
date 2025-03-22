/*
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import cors from "cors";
import os from "os"; // Ensure 'os' module is imported
import getRole from "./controllers/testing.js";

dotenv.config();

// Create a CORS middleware
const corsMiddleware = cors({
	origin: ["https://frontend-blond-five.vercel.app", "http://localhost:5173"],
	optionsSuccessStatus: 200,
});

// **Dynamic Route Handlers**
const routes = {
    "/api/getUserRole": (req, res) => {
        getRole(req,res);
    },
};

// **Helper function to handle requests**
const server = http.createServer((req, res) => {
    corsMiddleware(req, res, () => {
        const parsedUrl = url.parse(req.url, true);
        const routeHandler = routes[parsedUrl.pathname];

        if (routeHandler) {
            routeHandler(req, res, parsedUrl.query);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Route not found. Ensure the endpoint is correct." }));
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
*/
import http from "http";
import url from "url";
import dotenv from "dotenv";
import os from "os";
import authRoutes from "./routes/authRoutes.js"; // Ensure authRoutes is correctly imported

dotenv.config();

// **Register All Routes**
const routes = {
    ...authRoutes // This automatically handles "/api/getUserRole"
};

// **Helper function to handle requests**
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "https://frontend-blond-five.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests properly
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const routeHandler = routes[parsedUrl.pathname];

    if (routeHandler) {
        routeHandler(req, res, parsedUrl.query);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found. Ensure the endpoint is correct." }));
    }
});

// **Determine Local & Azure URLs**
const PORT = process.env.PORT || 8080;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find(iface => iface && iface.family === "IPv4" && !iface.internal)?.address || "localhost";

const localURL = `http://${localIP}:${PORT}`;
const azureURL = `https://${process.env.WEBSITE_HOSTNAME || "zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net"}`;

// **Start the server**
server.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running!");
    Object.keys(routes).forEach(route => {
        console.log(`Local:  ${localURL}${route}`);
        console.log(`Azure:  ${azureURL}${route}\n`);
    });
});









/*
import http from 'http';
import dotenv from 'dotenv';
import os from 'os';
import url from 'url';
import cors from "cors";
import { getRole } from './controllers/testing';


dotenv.config();

// Create a CORS middleware
const corsMiddleware = cors({
	origin: ["https://frontend-blond-five.vercel.app", "http://localhost:5173"],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});

// **Dynamic Route Handlers**
const routes = {
    "/api/getUserRole": (req, res) => {
        getRole(req, res);
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
   */

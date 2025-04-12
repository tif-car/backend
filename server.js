// Main file for backend
import http from "http";
import url from "url";
import dotenv from "dotenv";
import os from "os";
import cors from "cors";   
//routes added
import employeeRoutes from "./routes/employeeRoute.js";
import memberRoutes from "./routes/memberRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import managerRoutes from "./routes/managerRoute.js"; 
import authRoutes from "./routes/authRoute.js";
import feedingLogRoutes from "./routes/logRoute.js";
import maintenanceRoutes from "./routes/maintenanceRoute.js";
import purchaseRoutes from "./routes/purchaseroutes.js";
import merchandiseRoutes from "./routes/merchandiseRoutes.js";
import orderHistoryRoute from "./routes/orderHistoryRoute.js";

dotenv.config();

// **Register All Routes**
const routes = {
    ...adminRoutes,
    ...employeeRoutes,  // Employee routes
    ...managerRoutes,   // Manager 
    ...authRoutes,
    ...feedingLogRoutes,
    ...memberRoutes,
    ...maintenanceRoutes, 
    ...purchaseRoutes,
    ...merchandiseRoutes,
    ...orderHistoryRoute,
};

const corsMiddleware = cors({
    origin: ["https://frontend-blond-five.vercel.app", "http://localhost:5173"],
    optionsSuccessStatus: 200,
});

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
})
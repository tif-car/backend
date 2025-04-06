// routes/maintenanceRoute.js
import maintenanceController from "../controllers/MaintenanceController.js";

const maintenanceRoutes = {
  "/api/maintenance/form-info": async (req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
        } catch {
          req.body = {};
        }
        maintenanceController.getMaintenanceFormInfo(req, res);
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
  "/api/maintenance/report": async (req, res) => {
    if (req.method === "POST") {
        console.log("📥 Received POSTe /api/maintenance/report");
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
        } catch {
          req.body = {};
        }
        maintenanceController.getMaintenanceReport(req, res);
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default maintenanceRoutes;


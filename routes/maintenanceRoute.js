// routes/maintenanceRoute.js
import maintenanceController from "../controllers/MaintenanceController.js";
import maintenanceTrigger from "../controllers/maintenanceTrigger.js";

/*
    Endpoints Available:
    - POST /api/maintenance/form-info
    - POST /api/maintenance/report
    - POST /api/getMaintenanceNotifications
    - POST /api/seenMaintenanceNotification
    - POST /api/deleteMaintenanceRow
    - POST /api/editMaintenanceRow
*/

const maintenanceRoutes = {
  "/api/maintenance/form-info": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceController.getMaintenanceFormInfo);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  "/api/maintenance/report": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceController.getMaintenanceReport);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  "/api/getMaintenanceNotifications": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceTrigger.getMaintenanceNotifications);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  "/api/seenMaintenanceNotification": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceTrigger.seenMaintenanceNotification);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  "/api/deleteMaintenanceRow": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceController.deleteMaintenanceRow);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  "/api/editMaintenanceRow": (req, res) => {
    if (req.method === "POST") {
      parseBodyAndExecute(req, res, maintenanceController.editMaintenanceRow);
    } else {
      sendMethodNotAllowed(res);
    }
  },
};

// ✅ Helper: Parse JSON body and call the given controller
function parseBodyAndExecute(req, res, controllerFn) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(body);
    } catch (err) {
      console.error("❌ Failed to parse JSON body:", err);
      req.body = {};
    }

    controllerFn(req, res);
  });
}

// ✅ Helper: Reject non-POST methods
function sendMethodNotAllowed(res) {
  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default maintenanceRoutes;



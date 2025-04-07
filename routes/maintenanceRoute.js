// routes/maintenanceRoute.js
import maintenanceController from "../controllers/MaintenanceController.js";
import maintenanceTrigger from "../controllers/maintenanceTrigger.js";

const maintenanceRoutes = {
  "/api/maintenance/form-info": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, maintenanceController.getMaintenanceFormInfo);
    } else {
      sendMethodNotAllowed(res);
    }
  },
  "/api/maintenance/report": async (req, res) => {
    if(req.method === "POST"){
    handleRequestBody(req, res, maintenanceController.getMaintenanceReport);
    } else {
      sendMethodNotAllowed(res);
    }
  },

    //maintenance trigger
    "/api/getMaintenanceNotifications": (req, res) => {
    if (req.method === "POST") {
        handleRequestBody(req, res, maintenanceTrigger);
    } else {
        sendMethodNotAllowed(res);
    }
    },
};

// Helper function to parse request body and call the appropriate controller
function handleRequestBody(req, res, callback) {
  let body = "";
  req.on("data", (chunk) => {
      body += chunk.toString();
  });

  req.on("end", () => {
      try {
          req.body = JSON.parse(body);
      } catch (error) {
          req.body = {};
      }
      callback(req, res);
  });
}

// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default maintenanceRoutes;


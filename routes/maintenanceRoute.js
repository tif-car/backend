// routes/maintenanceRoute.js
import maintenanceController from "../controllers/MaintenanceController.js";
import MaintenanceTriggerController from "../controllers/maintenanceTrigger.js";
import MaintenanceController from "../controllers/MaintenanceController.js";
import ClosureController from "../controllers/closureController.js";

/*
    Endpoints Available:
    - `POST /api/maintenance/form-info`: Fetches information for the maintenance form.
    - `POST /api/maintenance/report`: Fetches a maintenance report.
    - `POST /api/getMaintenanceNotifications` : Fetches new maintenance notifications. Trigger
    - `POST /api/seenMaintenanceNotification` : Marks maintenance notifications as sent.
    - `POST /api/deleteMaintenance` : Deletes a maintenance record based on Maintenance_ID.
    - `POST /api/updateMaintenance` : Updates a maintenance record based on Maintenance_ID.
    - 'POST /api/closure/addClosure`: Adds a new closure row.
    - 'POST /api/closure/editClosure`: Updates a closure row.
    - 'POST /api/closure/deleteClosure`: Deletes a closure row.
    - 'POST /api/closure/closureView`: Fetches a view of all closures.
*/

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
        handleRequestBody(req, res, MaintenanceTriggerController.getMaintenanceNotifications);
    } else {
        sendMethodNotAllowed(res);
    }
    },

  // Acknowledge maintenance notification
  "/api/seenMaintenanceNotification": (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, MaintenanceTriggerController.seenMaintenanceNotification);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  //shows maintenance view of all maintenance requests
  "/api/maintenanceView": async (req, res) => {
    if(req.method === "POST"){
    handleRequestBody(req, res, MaintenanceController.maintenanceView);
    } else {
      sendMethodNotAllowed(res);
    }
  },
  
     // Delete a maintenance record
     "/api/deleteMaintenanceRow": async (req, res) => {
      if (req.method === "POST") {
      handleRequestBody(req, res, maintenanceController.deleteMaintenanceRow);
     } else {
      sendMethodNotAllowed(res);
    }
  },

    // Update a maintenance record
    "/api/editMaintenanceRow": async (req, res) => {
      if (req.method === "POST") {
        handleRequestBody(req, res, maintenanceController.editMaintenanceRow);
      } else {
        sendMethodNotAllowed(res);
      }
    },

    "/api/getMaintenanceRequestFormInfo": (req, res) => {
      if (req.method === "POST") {
          handleRequestBody(req, res, MaintenanceController.getMaintenanceRequestFormInfo);
      } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
      }
  },

  "/api/getMaintenanceEditFormInfo": (req, res) => {
      if (req.method === "POST") {
          handleRequestBody(req, res, MaintenanceController.getMaintenanceEditFormInfo);
      } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
      }
  },

  "/api/getMaintenanceInfo": (req, res) => {
      if (req.method === "POST") {
          handleRequestBody(req, res, MaintenanceController.getMaintenanceInfo);
      } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
      }
  },

   "/api/addMaintenanceRequest": (req, res) => {
      if (req.method === "POST") {
          handleRequestBody(req, res, MaintenanceController.addMaintenanceRequest);
      } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
      }
  },

  //Add a new closure row
  "/api/closure/addClosure": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, ClosureController.addClosure);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  //Add a new closure row
  "/api/closure/getClosureInfo": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, ClosureController.getClosureInfo);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  //Edit an existing closure row
  "/api/closure/editClosure": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, ClosureController.editClosure);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  //Delete a closure row
  "/api/closure/deleteClosure": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, ClosureController.deleteClosure);
    } else {
      sendMethodNotAllowed(res);
    }
  },

  //to view the CLOSURE_VIEW
  "/api/closure/closureView": async (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, ClosureController.closureView);
    } else {
      sendMethodNotAllowed(res);
    }
  }

  };

// Helper function to parse request body and call the appropriate controller
//function handleRequestBody(req, res, callback = (result) => res.send(result)) {
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
      //callback(req, res);  //debug 
      callback(req, res);
  });
}

// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default maintenanceRoutes;


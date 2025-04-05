import HRController from "../controllers/HR.js";
import maintenanceTrigger from "../controllers/maintenanceTrigger.js";

/**
    Endpoints Available:
    - `POST /api/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/createEmployee` : Creates a new employee in the employee table.
    - `POST /api/getMaintenanceNotifications` : Fetches new maintenance notifications
*/

const adminRoutes = {
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.editEmployee(req, res);  // Partial updates
        } else {
            sendMethodNotAllowed(res);
        }
    },


    "/api/createEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.createEmployee(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

     //maintenance trigger
    "/api/getMaintenanceNotifications": (req, res) => {
        if (req.method === "POST") {
            maintenanceTrigger(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    }
};

// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default adminRoutes;

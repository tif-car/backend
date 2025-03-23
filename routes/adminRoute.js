//main function of route is for handling admin related actions
import HRController from "../controllers/HR.js";

/**
    Endpoints Available:
    `POST /api/editEmployee` :for editing an existing employee. Requires the Employee_ID
    `POST /api/createEmployee` :Creates a new employee in the employee table
 */

const adminRoutes = {
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.editEmployee(req, res);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    },

    "/api/createEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.createEmployee(req, res);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    }
};

export default adminRoutes;

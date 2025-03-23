import HRController from "../controllers/HR.js";
import authController from "../controllers/authController.js";

/**
    Endpoints Available:
    - `POST /api/editEmployee` : Edits an existing employee. This requires Employee_ID
    - `POST /api/createEmployee` : Creates a new employee in the employee table
    - `POST /api/loginUser` : Authenticates a user and returns role details
    - `POST /api/getUserRole` : Fetches the role of a given user
*/

const adminRoutes = {
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.editEmployee(req, res);
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

    "/api/loginUser": (req, res) => {
        if (req.method === "POST") {
            authController.loginUser(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getUserRole": (req, res) => {
        if (req.method === "POST") {
            authController.getUserRole(req, res);
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

import HRController from "../controllers/HR.js";

/**
    Endpoints Available:
    - `POST /api/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/editAllEmployeeRow` : Edits an entire row of an employee. Requires all fields.
    - `POST /api/createEmployee` : Creates a new employee in the employee table.
*/

const adminRoutes = {
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.editEmployee(req, res);  // Partial updates
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/editAllEmployeeRow": (req, res) => {
        if (req.method === "POST") {
            HRController.editAllEmployeeRow(req, res);  // Full row update
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
    }
};

// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default adminRoutes;

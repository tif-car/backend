import HRController from "../controllers/HR.js";
import vendorTrigger from "../controllers/vendorTrigger.js";
import purchaseController from "../controllers/purchases.js";

/*
    Endpoints Available:
    - `POST /api/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/createEmployee` : Creates a new employee in the employee table.
    - `POST /api/getVendorNotifications` : Fetches new vendor notifications.
    - `POST /api/updateBulkPurchase` : Updates amount_of_items in bulk_purchase.
    - `POST /api/vendorNotificationSeen` : Marks vendor notifications as sent. 
*/

const adminRoutes = {

    // Route to update employee info
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.editEmployee);  // Partial updates
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to add a new employee to the table
    "/api/createEmployee": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.createEmployee);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to get vendor notifications
    "/api/getVendorNotifications": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorTrigger);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to update bulk purchase info
    "/api/updateBulkPurchase": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, purchaseController.updateBulkPurchase);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to mark vendor notifications as seen
    "/api/vendorNotificationSeen": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorTriggerController.vendorNotificationSeen);  // Handle acknowledgment
        } else {
            sendMethodNotAllowed(res);
        }
    }
};

// Helper function to parse request body and call the appropriate controller
function handleRequestBody(req, res, callback) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            req.body = JSON.parse(body);  // Parse the JSON body
        } catch (error) {
            req.body = {};  // Handle invalid JSON
        }
        callback(req, res);  // Call the controller function
    });
}

// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default adminRoutes;

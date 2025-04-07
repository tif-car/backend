import HRController from "../controllers/HR.js";
import vendorTrigger from "../controllers/vendorTrigger.js";
import purchaseController from "../controllers/purchases.js";

/*
    Endpoints Available:
    - `POST /api/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/createEmployee` : Creates a new employee in the employee table.
    - `POST /api/getMaintenanceNotifications` : Fetches new maintenance notifications
    - `POST /api/getVendorNotifications` : Fetches new vendor notifications.
    - `POST /api/updateBulkPurchase` : Updates amount_of_items in bulk_purchase.
*/

const adminRoutes = {

    //update employee info
    "/api/editEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.editEmployee(req, res);  // Partial updates
        } else {
            sendMethodNotAllowed(res);
        }
    },

     //add new employee to table
    "/api/createEmployee": (req, res) => {
        if (req.method === "POST") {
            HRController.createEmployee(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //vendor trigger
    "/api/getVendorNotifications": (req, res) => {
        if (req.method === "POST") {
            vendorTrigger(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

            //insert into bulk_purchase
            "/api/updateBulkPurchase": (req, res) => {
                if (req.method === "POST") {
                    purchaseController.updateBulkPurchase(req, res);
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

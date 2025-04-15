import HRController from "../controllers/HR.js";
import vendorTrigger from "../controllers/vendorTrigger.js";
import BulkPurchaseController from "../controllers/purchases.js";

/*
    Endpoints Available:
    - `POST /api/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/createEmployee` : Creates a new employee in the employee table.
    - `POST /api/getVendorNotifications` : Fetches new vendor notifications. Trigger
    - `POST /api/updateBulkPurchase` : Updates amount_of_items in bulk_purchase.
    - `POST /api/vendorNotificationSeen` : Marks vendor notifications as sent. 
*/

const adminRoutes = {

    // Route to update employee info (requires Employee_ID)
    "/api/HR/editEmployee": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.editEmployee);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to add a new employee
    "/api/HR/createEmployee": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.createEmployee);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Route to update where an employee works
    "/api/HR/updateWorksAt": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.updateWorksAt);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Route to add a work location to a new employee
    "/api/HR/createWorksAt": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.createWorksAt);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //vendor trigger
    "/api/getVendorNotifications": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorTrigger.getVendorNotifications);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //insert into bulk_purchase
    "/api/addBulkPurchase": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, BulkPurchaseController.addBulkPurchase);
        } else {
            sendMethodNotAllowed(res);
        }
    },

     //insert into bulk_purchase
     "/api/getBulkPurchaseFormInfo": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, BulkPurchaseController.getBulkPurchaseFormInfo);
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
    },
            
            // Route to mark vendor notification as seen
    "/api/vendorNotificationSeen": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorTrigger.vendorNotificationSeen);  // Handle acknowledgment
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


export default adminRoutes;

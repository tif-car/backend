import HRController from "../controllers/HR.js";
import vendorTrigger from "../controllers/vendorTrigger.js";
import BulkPurchaseController from "../controllers/purchases.js";

/*
    Endpoints Available:
    - `POST /api/HR/editEmployee` : Edits specific fields of an employee. Requires Employee_ID.
    - `POST /api/HR/createEmployee` : Creates a new employee in the employee table.
    - `POST /api/HR/updateWorksAt` : Updates the work location and department of an existing employee.
    - `POST /api/HR/createWorksAt` : Assigns a work location and department to a new employee.
    - `GET  /api/getRoles` : Fetches all roles from the role_type table.
    - `POST /api/vendorTrigger/getVendorNotifications` : Fetches new vendor notifications. Trigger-based.
    - `POST /api/vendorTrigger/vendorNotificationSeen` : Marks vendor notifications as sent.
    - `POST /api/BulkPurchase/addBulkPurchase` : Inserts a new bulk purchase record.
    - `POST /api/BulkPurchase/getBulkPurchaseFormInfo` : Gets merch and vendor data for form population.
    - `POST /api/BulkPurchase/BulkPurchaseView` : Returns bulk purchase view, ordered by date purchased.
    - `POST /api/BulkPurchase/updateBulkPurchase` : Updates amount_of_items in bulk_purchase.
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

    "/api/HR/getSCEmployees": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, HRController.getSCEmployeeInfo);
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
    "/api/BulkPurchase/addBulkPurchase": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, BulkPurchaseController.addBulkPurchase);
        } else {
            sendMethodNotAllowed(res);
        }
    },

     //insert into bulk_purchase
     "/api/BulkPurchase/getBulkPurchaseFormInfo": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, BulkPurchaseController.getBulkPurchaseFormInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },

        //insert into bulk_purchase
        "/api/BulkPurchase/BulkPurchaseView": (req, res) => {
            if (req.method === "POST") {
                handleRequestBody(req, res, BulkPurchaseController.BulkPurchaseView);
            } else {
                sendMethodNotAllowed(res);
            }
        },

    //insert into bulk_purchase
     "/api/BulkPurchase/updateBulkPurchase": (req, res) => {
        if (req.method === "POST") {
             handleRequestBody(req, res, BulkPurchaseController.updateBulkPurchase);
         } else {
            sendMethodNotAllowed(res);
         }
    },
            
    // Route to mark vendor notification as seen
    "/api/vendorTrigger/vendorNotificationSeen": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorTrigger.vendorNotificationSeen);  // Handle acknowledgment
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getRoles": (req, res) => {
        if (req.method === "GET") {
            handleRequestBody(req, res, HRController.getRoles); 
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

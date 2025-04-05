import attractionController from "../controllers/attraction.js";
import vendorReportController from "../controllers/vendorReportController.js"
import ticketReportController from "../controllers/ticketReportController.js";

/*
Endpoints:
- `POST /api/getAttractionStatus`: Retrieves the status type of an attraction based on its name.
- `POST /api/updateAttractionStatus`: Updates the status type of an attraction.
*/

const managerRoutes = {
    // Route to get the status type of an attraction (requires Attraction_Name from frontend)
    "/api/getAttractionStatus": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, attractionController.getAttractionStatus);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to update the status type (requires status_typeID and status_Type from frontend)
    "/api/updateAttractionStatus": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, attractionController.updateAttractionStatus);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getVendMerchReportFormInfo": (req,res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorReportController.getVendorQueryFormInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },
    "/api/getVendMerchReport": (req,res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, vendorReportController.getReport);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getTicketReportFormInfo": (req,res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, ticketReportController.getTicketReportFormInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getTicketReport": (req,res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, ticketReportController.getReport);
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

export default managerRoutes;

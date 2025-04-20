import addNewVisitor from "../controllers/memberController.js";
import visitorControllers from "../controllers/visitorController.js";

/*
Endpoints:
- `POST /api/addNewVisitor`: Adds a new visitor to the database.
- `POST /api/visitor/updateVisitorInfo`: Updates the information of an existing visitor.
- `POST /api/visitor/getMemberByID`: Retrieves member information based on the Visitor_ID.
*/

// Route definitions
const memberRoutes = {
    // Add new visitor
    "/api/addNewVisitor": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, addNewVisitor);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Update visitor info
    "/api/visitor/updateVisitorInfo": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, visitorControllers.updateVisitorInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Get member information by Visitor_ID
    "/api/visitor/getMemberByID": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, (reqWithBody, res) => {
                const { Visitor_ID } = reqWithBody.body || {};
                if (!Visitor_ID) {
                    return sendResponse(res, 400, { error: "Visitor_ID is required." });
                }
                // Simulate a RESTful param with POST body
                reqWithBody.params = { Visitor_ID };
                visitorControllers.getMemberByID(reqWithBody, res);
            });
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

export default memberRoutes;

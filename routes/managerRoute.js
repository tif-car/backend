import attractionController from "../controllers/attraction.js";

/*
Info:
- Frontend will send a POST request to the appropriate endpoint.
- The route extracts the request body, parses it as JSON, and calls the 
  respective function from the corresponding controller.
*/

/*
Endpoints:
- `POST /api/getAttractionStatus`: Fetches `status_Type` based on `Attraction_Name`.
- `POST /api/updateAttractionStatus`: Updates the `status_Type` based on `status_typeID`.
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

export default managerRoutes;

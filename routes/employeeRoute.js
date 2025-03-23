import animalCareController from "../controllers/animalCare.js";
import authController from "../controllers/authController.js";

/*
Info:
Frontend will send a POST request to the /api/getAnimalCareTasks endpoint, 
containing the employee_ID.
The route extracts the request body, parses it as JSON, and calls the 
getAnimalCareTasks function from the animalCare.js controller.
*/

/*
Endpoints:
- `POST /api/getAnimalCareTasks`: Fetches animal care tasks based on `employee_ID`.
- `POST /api/loginUser`: Authenticates an employee and returns their role.
- `POST /api/getUserRole`: Fetches the role of a given user.
*/

const employeeRoutes = {
    // Route to get animal care tasks (fetch animal name)
    "/api/getAnimalCareTasks": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalCareController.getAnimalCareTasks);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Authentication Routes
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

export default employeeRoutes;


//work in progress
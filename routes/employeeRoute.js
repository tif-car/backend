import animalCareController from "../controllers/animalCare.js";
import animalHealthController from "../controllers/animalHealth.js";
import authController from "../controllers/authController.js";

/*
Info:
- Frontend will send a POST request to the appropriate endpoint.
- The route extracts the request body, parses it as JSON, and calls the 
  respective function from the corresponding controller.
*/

/*
Endpoints:
- `POST /api/getAnimalCareTasks`: Fetches animal care information such as `animal_ID`, `animal_name`, and `habitat_ID`, based on `employee_ID`.
- `POST /api/updateAnimalWellness`: Updates the wellness status of an animal based on `animal_ID` and `wellness_status`.
- `POST /api/loginUser`: Authenticates an employee and returns their role.
- `POST /api/getUserRole`: Fetches the role of a given user.
*/

const employeeRoutes = {
    // Route to get animal care tasks. will need to receive Employee_ID from frontend
    "/api/getAnimalCareTasks": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalCareController.getAnimalCareTasks);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to update animal wellness status
    //will need to receive animal_ID and wellness_status(maybe dropdown menu?) from the frontend
    "/api/updateAnimalWellness": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.updateAnimalWellness);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Authentication Routes
    //will receive email and password from the frontend
    "/api/loginUser": (req, res) => {
        if (req.method === "POST") {
            authController.loginUser(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //will receive email from the frontend
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

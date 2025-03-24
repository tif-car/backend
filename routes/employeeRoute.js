import animalCareController from "../controllers/animalCare.js";
import animalHealthController from "../controllers/animalHealth.js";
import animalFeedingController from "../controllers/animalFeeding.js";  // Added animalFeedingController
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
- `POST /api/getFeedingDetails`: Fetches feeding details such as `food_Types`, `feeding_Time`, and `Quantity`, based on `employee_ID` and `animal_ID`.
- `POST /api/loginUser`: Authenticates an employee and returns their role.
- `POST /api/getUserRole`: Fetches the role of a given user.
*/

const employeeRoutes = {
    // Route to get animal care tasks (requires Employee_ID from frontend)
    "/api/getAnimalCareTasks": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalCareController.getAnimalCareTasks);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to update animal wellness status (requires animal_ID and wellness_status from frontend)
    "/api/updateAnimalWellness": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.updateAnimalWellness);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to get feeding details (requires employee_ID and animal_ID from frontend)
    "/api/getFeedingDetails": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.getFeedingDetails);
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

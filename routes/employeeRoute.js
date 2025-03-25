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

    // Route to create a new medical record (requires Animal_ID, Employee_ID, Checkup_Date, Diagnosis, and Treatment)
    "/api/createMedicalRecord": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.createMedicalRecord);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to edit an existing medical record (requires Record_ID and updated fields)
    "/api/editMedicalRecord": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.editMedicalRecord);
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

    // Route to get details for the form (requires employee_ID from frontend)
    "/api/FeedingFormInfo": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.getFeedingFormInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to get details for the form (requires employee_ID from frontend)
    "/api/CreateFeedingLog": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.createFeedingLog);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Authentication Routes. Will need email and password from the frontend
    "/api/loginUser": (req, res) => {
        if (req.method === "POST") {
            authController.loginUser(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Needs email from the frontend. Retrieves a user's role
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

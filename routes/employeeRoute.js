import animalCareController from "../controllers/animalCare.js";
import animalHealthController from "../controllers/animalHealth.js";
import animalFeedingController from "../controllers/animalFeeding.js";  // Added animalFeedingController
import animalController from "../controllers/animalController.js";
import MaintenanceController from "../controllers/MaintenanceController.js";

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

    // New route to edit all fields of a medical record (requires Record_ID and all updated fields)
    "/api/editAllMedicalRow": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.editAllMedicalRow);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to get feeding details (requires employee_ID and animal_ID from frontend)
    "/api/getFeedingDetails": (req, res) => {
        if (req.method === "POST") {
            const { employee_ID, animal_ID } = req.body;
            if (!employee_ID || !animal_ID) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Both employee_ID and animal_ID are required" }));
                return;
            }
            handleRequestBody(req, res, animalFeedingController.getFeedingDetails);
        } else {
            sendMethodNotAllowed(res);
        }
    },
    // Route to get feeding query form details
    "/api/getFeedingQueryDetails": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.getFeedingQueryFormInfo);
        } else {
            sendMethodNotAllowed(res);
        }
    },
    // Route to Query feeding logs
    "/api/QueryFeedingLogs": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.QueryFeedingLogs);
        } else {
            sendMethodNotAllowed(res);
        }
    },
    /////////////////////////////
    // Route for /api/animals (GET to fetch all, POST to create new)
    "/api/animals": (req, res) => {
        if (req.method === "GET") {
            animalController.getAllAnimals(req, res);
        } else if (req.method === "POST") {
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
                animalController.createAnimal(req, res);
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or POST." }));
        }
    },

    // Route for /api/animals/:id (GET to fetch by ID, PUT to update by ID)
    "/api/animals/:id": (req, res) => {
        const animalId = req.url.split("/")[3]; // Extract ID from URL
        
        if (req.method === "GET") {
            animalController.getAnimalById(req, res, animalId); // Pass ID to controller
        } else if (req.method === "PUT") {
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
                animalController.updateAnimal(req, res, animalId); // Pass ID to controller
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
        }
    },
     // Route for /api/animals/:id (GET to fetch by ID, PUT to update by ID)
     "/api/getMaintenanceRequestFormInfo": (req, res) => {
        if (req.method === "GET") {
            handleRequestBody(req, res, MaintenanceController.getMaintenanceRequestFormInfo)
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
        }
    },
     // Route for /api/animals/:id (GET to fetch by ID, PUT to update by ID)
     "/api/addMaintenanceRequest": (req, res) => {
        if (req.method === "GET") {
            handleRequestBody(req, res, MaintenanceController.getMaintenanceRequestFormInfo)
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
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

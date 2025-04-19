import animalCareController from "../controllers/animalCare.js";
import animalHealthController from "../controllers/animalHealth.js";
import animalFeedingController from "../controllers/animalFeeding.js";  // Added animalFeedingController
import animalController from "../controllers/animalController.js";

/*
    Endpoints Available:
    - `POST /api/animalCare/getAnimalCareTasks`: Fetches animal care tasks for the employee. Requires `Employee_ID` from frontend
    - `POST /api/animalHealth/updateAnimalWellness`: Updates the wellness status of an animal. Requires `animal_ID` and `wellness_status` from frontend.
    - `POST /api/animalHealth/createMedicalRecord`: Creates a new medical record for an animal. Requires `Animal_ID`, `Employee_ID`, `Checkup_Date`, `Diagnosis`, and `Treatment` from frontend.
    - `POST /api/animalHealth/editMedicalRecord`: Edits an existing medical record. Requires `Record_ID` and updated fields from frontend.
    - `POST /api/animalHealth/editAllMedicalRow`: Edits all fields of a medical record. Requires `Record_ID` and all updated fields.
    - `POST /api/getFeedingDetails`: Fetches feeding details for an animal. Requires `employee_ID` and `animal_ID` from frontend.
    - `POST /api/getFeedingQueryDetails`: Fetches feeding query form details.
    - `POST /api/QueryFeedingLogs`: Queries feeding logs for an animal.
    - `GET /api/animals`: Fetches all animals.
    - `POST /api/animals`: Creates a new animal entry. Requires details in the request body.
    - `GET /api/animals/:id`: Fetches details of an animal by ID.
    - `PUT /api/animals/:id`: Updates an animal by ID.
    - `POST /api/animalCare/getAnimalById`: Fetches details of a specific animal by ID. Requires `animal_ID` from frontend.
    - `POST /api/animalCare/getCaretakerView`: Fetches the caretaker's view for animal care tasks. Requires `employee_ID` from frontend.
*/

const employeeRoutes = {
    // Route to get animal care tasks (requires Employee_ID from frontend)
    "/api/animalCare/getAnimalCareTasks": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalCareController.getAnimalCareTasks);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to update animal wellness status (requires animal_ID and wellness_status from frontend)
    "/api/animalHealth/updateAnimalWellness": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.updateAnimalWellness);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to create a new medical record (requires Animal_ID, Employee_ID, Checkup_Date, Diagnosis, and Treatment)
    "/api/animalHealth/createMedicalRecord": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.createMedicalRecord);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // Route to edit an existing medical record (requires Record_ID and updated fields)
    "/api/animalHealth/editMedicalRecord": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalHealthController.editMedicalRecord);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    // New route to edit all fields of a medical record (requires Record_ID and all updated fields)
    "/api/animalHealth/editAllMedicalRow": (req, res) => {
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
           handleRequestBody(req, res, animalController.getAllAnimals);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or POST." }));
        }
    },

    // Route for /api/animals/:id (GET to fetch by ID, PUT to update by ID)
    "/api/animalCare/getAnimalById": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.getAnimalById);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Get animals and habitat information from the CARETAKER_VIEW
    "/api/animalCare/getCaretakerView": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.getCaretakerView);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Update animal
    "/api/animalCare/updateAnimal": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.updateAnimal);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Create Animal
    "/api/animalCare/createAnimal": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.createAnimal);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Create Animal
    "/api/animalCare/deleteAnimal": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.deleteAnimal);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Create Animal
    "/api/animalCare/getAnimalDropdowns": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.getAnimalDropdowns);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Lists out the names and IDs of all species on record
    "/api/getSpecies": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.getSpecies);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    //Lists out the names and IDs of all wellness types on record
    "/api/getWellness": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalController.getWellness);
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

export default employeeRoutes;

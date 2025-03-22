//API endpoint: POST https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api/getAnimalCareTasks

import animalCareController from "../controllers/animalCare.js";

/*
Info:
Frontend will send a POST request to the /api/getAnimalCareTasks endpoint, 
containing the employee_ID.
The route extracts the request body, parses it as JSON, and calls the 
getAnimalCareTasks function from the animalCare.js controller.
*/

const employeeRoutes = {
    // Route to get animal care tasks (fetch animal name)
    "/api/getAnimalCareTasks": (req, res) => {
        if (req.method === "POST") {
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
                animalCareController.getAnimalCareTasks(req, res);
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    }
};

export default employeeRoutes;


//work in progress
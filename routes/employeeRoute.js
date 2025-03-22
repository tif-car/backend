import animalCareController from "../controllers/animalCare.js";

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
import animalController from "../controllers/animalController.js";
<<<<<<< HEAD
=======

const animalRoutes = {
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

    "/api/animals/:id": (req, res) => {
        if (req.method === "GET") {
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
                animalController.getAnimalById(req, res);
            });
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
                animalController.updateAnimal(req, res);
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or PUT." }));
        }
    }
};

export default animalRoutes; 
>>>>>>> main

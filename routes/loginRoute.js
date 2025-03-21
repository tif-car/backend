import loginController from "../controllers/loginController.js";

const routes = {
    "/api/loginUser": (req, res, query) => {
        console.log(`Received request for /api/loginUser with query:`, query); // Debugging log

        if (req.method === "GET") {
            if (!query.email) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Missing email parameter." }));
                return;
            }

            loginController.handleGetRole(req, res, query);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use GET instead." }));
        }
    }
};

export default routes;

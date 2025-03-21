import userController from "../controllers/userController.js";

const routes = {
    "/api/getUserRole": (req, res) => {
        if (req.method === "POST") {
            userController.getUserRole(req, res);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    }
};

export default routes;


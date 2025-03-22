import authController from "../controllers/authController.js";

const authRoutes = {
    "/api/loginUser": (req, res) => {
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
                authController.loginUser(req, res);
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    },

    "/api/getUserRole": (req, res) => {
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
                authController.getUserRole(req, res);
            });
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
        }
    }
};

export default authRoutes;

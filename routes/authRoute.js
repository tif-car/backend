import authControl from "../controllers/authController.js";

/**
    Endpoints Available:
    - `POST /api/loginUser` : Authenticates a user and returns role details
    - `POST /api/getUserRole` : Fetches the role of a given user
*/

const authRoutes = {
    "/api/loginUser": (req, res) => {
        if (req.method === "POST") {
            authControl.loginUser(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    },

    "/api/getUserRole": (req, res) => {
        if (req.method === "POST") {
            authControl.getUserRole(req, res);
        } else {
            sendMethodNotAllowed(res);
        }
    }
};


// Helper function to handle method restrictions
function sendMethodNotAllowed(res) {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed. Use POST instead." }));
}

export default authRoutes;

import getUserRole from "../controllers/getUserRole.js";

const getUserRoleRoute = (req, res) => {
    if (req.method === "POST") {
        getUserRole(req, res);
    } else {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
};

export default getUserRoleRoute;

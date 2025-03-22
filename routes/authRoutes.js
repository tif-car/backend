//The main function of authRoutes.js is to handle user authentication
import authController from "../controllers/authController.js";

/* 
api/loginUser returns user id and role information
Frontend Needs to Send:
Method: POST
Request Body (JSON format):
{
  "email": "user@example.com",
  "password": "userpassword"
}

Response Format:
{
  "id": 123,           // user ID (employee_ID or visitor_ID)
  "role": 0,           // 0: member, 1: employee, 2: admin
  "role_name": "member" // textual role description
}
*/

//API endpoint is api/loginUser
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

import dbConnection from "../db.js";

const getUserRole = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const { email } = JSON.parse(body);

        console.log("Received email parameter:", email); // Debugging log

        if (!email) {
            return sendResponse(res, 400, { error: "Email is required" });
        }

        // SQL query to fetch role_typeID and role_types
        const sql = `SELECT r.role_typeID, r.role_types
                     FROM employee e 
                     JOIN role_type r ON e.Role = r.role_typeID 
                     WHERE e.email = ?`;

        dbConnection.query(sql, [email], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return sendResponse(res, 500, { error: "Database error" });
            }
            if (result.length === 0) {
                console.log("User not found.");
                return sendResponse(res, 404, { error: "User not found." });
            }

            console.log("Sending role:", result[0].role_types); // Debugging log
            sendResponse(res, 200, {
                role_typeID: result[0].role_typeID,
                role_types: result[0].role_types
            });
        });
    });
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default getUserRole;

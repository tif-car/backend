import db from "../db.js";

const getUserRole = (req, res, queryParams) => {
    const email = queryParams.email;

    console.log("Received email parameter:", email); // Debugging log

    if (!email) {
        return sendResponse(res, 400, { error: "Email parameter is required" });
    }

    const sql = `SELECT r.role_types 
                 FROM employee e 
                 JOIN role_type r ON e.Role = r.role_typeID 
                 WHERE e.email = ?`;

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.length === 0) {
            return sendResponse(res, 404, { error: "User not found" });
        }

        sendResponse(res, 200, { role_type: result[0].role_types });
    });
};

// Define sendResponse function inside this file
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { getUserRole };

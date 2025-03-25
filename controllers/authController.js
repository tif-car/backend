import dbConnection from "../db.js";

// Login function that authenticates users and returns role number
const loginUser = (req, res) => {
    if (req.method !== "POST") {
        return sendResponse(res, 405, { error: "Method Not Allowed. Use POST instead." });
    }

    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const { email, password } = JSON.parse(body);
            console.log("Received email:", email);
            console.log("Received password:", password);

            if (!email || !password) {
                return sendResponse(res, 400, { error: "Email and password are required" });
            }

            // First check if email exists in employee table
            const employeeQuery = `SELECT e.employee_ID, e.password, r.role_types, r.role_typeID
                                   FROM employee e
                                   JOIN role_type r ON e.Role = r.role_typeID
                                   WHERE e.email = ?`;

            dbConnection.query(employeeQuery, [email], (err, employeeResult) => {
                if (err) {
                    console.error("Database query error:", err);
                    return sendResponse(res, 500, { error: "Database error" });
                }

                if (employeeResult.length > 0) {
                    if (password === employeeResult[0].password) {
                        return sendResponse(res, 200, { 
                            id: employeeResult[0].employee_ID,
                            role: employeeResult[0].role_types,
                            message: "Login successful"
                        });
                    } else {
                        return sendResponse(res, 401, { error: "Invalid password" });
                    }
                } else {
                    // If not found in employee table, check visitor/member table
                    const memberQuery = `SELECT visitor_ID, password, email FROM visitor WHERE email = ?`;

                    dbConnection.query(memberQuery, [email], (visitorErr, visitorResult) => {
                        if (visitorErr) {
                            console.error("Database query error:", visitorErr);
                            return sendResponse(res, 500, { error: "Database error" });
                        }

                        if (visitorResult.length === 0) {
                            return sendResponse(res, 404, { error: "Email not found" });
                        }

                        if (password === visitorResult[0].password) {
                            return sendResponse(res, 200, { 
                                id: visitorResult[0].visitor_ID,
                                role: "member",
                                message: "Login successful"
                            });
                        } else {
                            return sendResponse(res, 401, { error: "Invalid password" });
                        }
                    });
                }
            });
        } catch (error) {
            return sendResponse(res, 400, { error: "Invalid JSON format" });
        }
    });
};

// Get User Role function
const getUserRole = (req, res) => {
    if (req.method !== "POST") {
        return sendResponse(res, 405, { error: "Method Not Allowed. Use POST instead." });
    }

    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const { email } = JSON.parse(body);
            console.log("Received email:", email);

            if (!email) {
                return sendResponse(res, 400, { error: "Email is required" });
            }

            const sql = `SELECT e.employee_ID, r.role_typeID, r.role_types
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

                console.log("Sending employee_ID and role:", result[0].employee_ID, result[0].role_types);
                sendResponse(res, 200, {
                    employee_ID: result[0].employee_ID,
                    role_typeID: result[0].role_typeID,
                    role_types: result[0].role_types
                });
            });
        } catch (error) {
            return sendResponse(res, 400, { error: "Invalid JSON format" });
        }
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

// Export authentication functions
export default { loginUser, getUserRole };

import dbConnection from "../db.js";
//import bcrypt from "bcrypt";

// Login function taken from the testing.js
const loginUser = (req, res) => {
    const { email, password } = req.body || {};

    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
        return sendResponse(res, 400, { error: "Email and password are required" });
    }

    const sqlE = `select r.role_types, e.password
                from employee e
                join role_type r on e.Role = r.role_typeID
                where e.email = ?`;

    const sqlV = `select v.password
                from visitor v
                where v.email = ?`;            
                                

    dbConnection.query(sqlE, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.length === 0) {
            dbConnection.query(sqlV, [email], (err, result) => {
                if(err){
                    console.error("Database query error:", err);
                    return sendResponse(res, 500, { error: "Database error" });
                }
                if (result.length === 0) {
                    console.log("User not found");
                    return sendResponse(res, 404, { error: "User not found" });
                }
        
                if (password === result[0].password) {
                    console.log("Sending role: member");
                    sendResponse(res, 200, { user_type: "member" });
                } else {
                    sendResponse(res, 401, { error: "Invalid login credentials" });
                }
            });
            return;
        }

        if (password === result[0].password) {
            console.log("Sending role:", result[0].role_types);
            sendResponse(res, 200, { user_type: result[0].role_types });
        } else {
            sendResponse(res, 401, { error: "Invalid login credentials" });
        }
    });
};

// Get User Role function
const getUserRole = (req, res) => {
    const { email } = req.body || {};

    console.log("Received email:", email);

    if (!email) {
        return sendResponse(res, 400, { error: "Email is required" });
    }

    //returns the employeeID, their role_type, and role_typeID
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
};


// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { loginUser, getUserRole };

import dbConnection from "../db.js";
//import bcrypt from "bcrypt";

// Login function that handles authentication and returns role and ID
const loginUser = (req, res) => {
    const { email, password } = req.body || {};

    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
        return sendResponse(res, 400, { error: "Email and password are required" });
    }

    // Query to check employee credentials and get role
    const sqlE = `SELECT e.employee_ID, r.role_types, r.role_typeID, e.password
                FROM employee e
                JOIN role_type r ON e.Role = r.role_typeID
                WHERE e.email = ?`;

    // Query to check visitor/member credentials
    const sqlV = `SELECT v.visitor_ID, v.password
                FROM visitor v
                WHERE v.email = ?`;            
                                
    // First check if the user is an employee
    dbConnection.query(sqlE, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        
        if (result.length === 0) {
            // Not an employee, check if they're a visitor/member
            dbConnection.query(sqlV, [email], (err, visitorResult) => {
                if(err){
                    console.error("Database query error:", err);
                    return sendResponse(res, 500, { error: "Database error" });
                }
                
                if (visitorResult.length === 0) {
                    console.log("User not found");
                    return sendResponse(res, 404, { error: "User not found" });
                }
        
                // Check visitor password
                if (password === visitorResult[0].password) {
                    console.log("Successful login as member");
                    // Return role 0 for member and visitor_ID
                    sendResponse(res, 200, { 
                        id: visitorResult[0].visitor_ID, 
                        role: 0,  // 0 represents member role
                        role_name: "member" 
                    });
                } else {
                    sendResponse(res, 401, { error: "Invalid login credentials" });
                }
            });
            return;
        }

        // Check employee password
        if (password === result[0].password) {
            console.log("Successful login as employee with role:", result[0].role_types);
            
            // Determine numeric role value
            let roleValue = 1; // Default for regular employee
            
            // If admin role, set to 2
            if (result[0].role_types.toLowerCase().includes("admin")) {
                roleValue = 2;
            }
            
            sendResponse(res, 200, { 
                id: result[0].employee_ID, 
                role: roleValue,
                role_name: result[0].role_types
            });
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
            // Check if user is a visitor/member
            const visitorSql = `SELECT v.visitor_ID
                               FROM visitor v
                               WHERE v.email = ?`;
            
            dbConnection.query(visitorSql, [email], (err, visitorResult) => {
                if (err) {
                    console.error("Database query error:", err);
                    return sendResponse(res, 500, { error: "Database error" });
                }
                
                if (visitorResult.length === 0) {
                    console.log("User not found.");
                    return sendResponse(res, 404, { error: "User not found." });
                }
                
                // Return member role (0)
                sendResponse(res, 200, {
                    id: visitorResult[0].visitor_ID,
                    role: 0,
                    role_name: "member"
                });
            });
            return;
        }

        // Determine numeric role value
        let roleValue = 1; // Default for regular employee
            
        // If admin role, set to 2
        if (result[0].role_types.toLowerCase().includes("admin")) {
            roleValue = 2;
        }
        
        console.log("Sending employee_ID and role:", result[0].employee_ID, result[0].role_types);
        sendResponse(res, 200, {
            id: result[0].employee_ID,
            role: roleValue,
            role_name: result[0].role_types
        });
    });
};


// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { loginUser, getUserRole };

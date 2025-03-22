import dbConnection from "../db.js";
import bcrypt from "bcrypt";

const getRole = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {

        const {email, password}= JSON.parse(body);
        
        console.log("Received email parameter:", email); // Debugging log
        console.log("Received password parameter:", password); // Debugging log

        if (!email || !password) {
            return sendResponse(res, 400, { error: "Email parameter is required" });
        }

        // Updated SQL query
        const sql = `SELECT r.role_types, e.password
                     FROM employee e 
                     JOIN role_type r ON e.Role = r.role_typeID 
                     WHERE e.email = ?`;

        dbConnection.query(sql, [email], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return sendResponse(res, 500, { error: "Database error" });
            }
            if (result.length === 0) {
                console.log("user not found");
                return sendResponse(res, 404, { error: "User not found" });
            }

            /* 
            bcrypt.compare(password, result[0].password, (err, same) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                    return;
                }

                if (!same) {
                    console.log(result[0].password);
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid login credentials" }));
                    return;
                }

                
            });
            */
            if(password == result[0].password){
                console.log("sending role:", result.role_types); // Debugging log
                sendResponse(res, 200, { role_types: result[0].role_types });
            } else {
                sendResponse(res, 401, "Invalid login credentials");
            }
            
        });
    })
}

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default getRole;
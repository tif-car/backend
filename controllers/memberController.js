import dbConnection from "../db.js";

/* Visitor_name Varchar(30)
    email varchar(30)
    password varchar(255)
    phone_number varchar(30) <--need to change this 
    Address varchar(50)
*/

 const addNewVisitor = (req, res) => {
    const {
        Visitor_name,
        email,
        password,
        phone_number,
        Address
    } = req.body || {};

    console.log("Received data:", req.body);

    const sql = `INSERT INTO visitor (Visitor_Name, Email, password, membership_status)
                 VALUES (?, ?, ?, 2);`;

    dbConnection.query(sql,[Visitor_name, email, password, phone_number,Address], (err)=> {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                console.error("visitor already exists:", err);
                return sendResponse(res, 400, { error: "visitor already exists" });
            }
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    });
    
    return sendResponse(res, 200, { res: "Visitor entered!" });
}

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default addNewVisitor;
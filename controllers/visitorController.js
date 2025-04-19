import pool from "../db.js"; // Use pool for database queries

const visitorControllers = {

    updateVisitorInfo: async (req, res) => {
        const {
            Visitor_ID,
            Visitor_Name,
            Email,
            Phone_number,
            membership_status,
            Address,
            password
        } = req.body;
    
        // Make sure Visitor_ID is provided
        if (!Visitor_ID) {
            return sendResponse(res, 400, { error: "Visitor_ID is required to update visitor info." });
        }
    
        // Build SET clause dynamically
        let setClause = [];
        let values = [];
    
        if (Visitor_Name) {
            setClause.push("Visitor_Name = ?");
            values.push(Visitor_Name);
        }
        if (Email) {
            setClause.push("Email = ?");
            values.push(Email);
        }
        if (Phone_number) {
            setClause.push("Phone_number = ?");
            values.push(Phone_number);
        }
        /*
        membership_status info:
        membership_TypeID[1, 2, 3, 4] = membership_Type[None, Bronze, Silver, Gold]
        */
        if (membership_status !== undefined) {
            setClause.push("membership_status = ?");
            values.push(membership_status);
        }
        if (Address) {
            setClause.push("Address = ?");
            values.push(Address);
        }
        if (password) {
            setClause.push("password = ?");
            values.push(password);
        }
    
        // If nothing to update
        if (setClause.length === 0) {
            return sendResponse(res, 400, { error: "No fields provided for update." });
        }
    
        const sql = `UPDATE visitor SET ${setClause.join(", ")} WHERE Visitor_ID = ?`;
        values.push(Visitor_ID);
    
        try {
            const [result] = await pool.promise().query(sql, values);
    
            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "Visitor not found." });
            }
    
            sendResponse(res, 200, { message: "Visitor information updated successfully." });
        } catch (err) {
            console.error("Database update error:", err);
            sendResponse(res, 500, { error: "Database error while updating visitor info." });
        }
    },

    //This is to show the visitor that they information has been updated
    getMemberByID: async (req, res) => {
        const { Visitor_ID } = req.params;
    
        if (!Visitor_ID) {
            return sendResponse(res, 400, { error: "Visitor_ID is required." });
        }
    
        const sql = `SELECT * FROM MEMBER_VIEW WHERE Visitor_ID = ?`;
    
        try {
            const [result] = await pool.promise().query(sql, [Visitor_ID]);
    
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "Visitor not found." });
            }
    
            const member = result[0];
            sendResponse(res, 200, { member });
        } catch (err) {
            console.error("Database query error:", err);
            sendResponse(res, 500, { error: "Error fetching visitor data." });
        }
    }

};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default visitorControllers;
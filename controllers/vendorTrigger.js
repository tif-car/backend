import dbConnection from "../db.js";

const vendorTrigger = {

/* 
Front end would receive this response in Format (JSON):
  "notifications": [
     {
       "vendor_messageID": 1,
       "vendor_merchID": 101,
       "message": "Low supply alert: Only 5 items left for merch_ID 101",
       "Item_Name": "Safari Hat"
    },
   ]
*/

// Function to get vendor notifications from the database
     getVendorNotifications: async (req, res) => {
    const sql = `
        SELECT V.vendor_messageID, V.vendor_merchID, V.message, M.Item_Name  
        FROM vendor_notifications V
        JOIN merchandise M ON V.vendor_merchID = M.Merchandise_ID  
        WHERE V.message_sent = FALSE
        ORDER BY V.vendor_messageID DESC`;

    dbConnection.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.length === 0) {
            // Return an empty array[] if there is no message
            return sendResponse(res, 200, { notifications: [] });
        }

        // Sends notifications to frontend
        sendResponse(res, 200, { notifications: result });
    });
},

// Function to handle acknowledgment of vendor notifications
// Expecting the vendor_messageID and 'T' for acknowledgment
    vendorNotificationSeen: async (req, res) => {
    /*
    Frontend would send this JSON to acknowledge a notification (example):
    {
        "vendor_messageID": 1,
        "seen": "T"
    }
    */

    const { vendor_messageID, seen } = req.body;

    // Validate if the seen field is 'T'
    if (seen !== 'T') {
        return sendResponse(res, 400, { error: "Invalid 'seen' value. Use 'T' to mark as seen." });
    }

    // SQL query to mark the notification as 'sent' after acknowledgment
    const sql = `UPDATE vendor_notifications 
                 SET message_sent = TRUE 
                 WHERE vendor_messageID = ?`;

    dbConnection.query(sql, [vendor_messageID], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Notification not found" });
        }

        sendResponse(res, 200, { message: "Notification marked as sent" });
    });
}

};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default vendorTrigger;

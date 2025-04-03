import dbConnection from "../db.js";

const getVendorNotifications = (req, res) => {
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
            return sendResponse(res, 404, { error: "No new vendor notifications" });
        }

        // Send notifications with Item_Name to frontend
        sendResponse(res, 200, { notifications: result });

        // Mark notifications as "sent"
        const updateSql = `UPDATE vendor_notifications SET message_sent = TRUE 
                           WHERE vendor_messageID IN (?)`;

        const notificationIds = result.map(row => row.vendor_messageID);

        if (notificationIds.length > 0) {
            dbConnection.query(updateSql, [notificationIds], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating notifications:", updateErr);
                } else {
                    console.log("Vendor notifications marked as sent.");
                }
            });
        }
    });
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default getVendorNotifications;

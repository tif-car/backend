import dbConnection from "../db.js";

const getMaintenanceNotifications = (req, res) => {
    const sql = `SELECT maintenance_messageID, maintenance_employeeID, message 
                 FROM maintenance_notifications 
                 WHERE sent = FALSE
                 ORDER BY maintenance_messageID DESC`;

    dbConnection.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.length === 0) {
            return sendResponse(res, 404, { error: "No new maintenance notifications" });
        }

        // Send notifications to frontend
        sendResponse(res, 200, { notifications: result });

        // Mark notifications as "sent"
        const updateSql = `UPDATE maintenance_notifications SET sent = TRUE 
                           WHERE maintenance_messageID IN (?)`;

        const notificationIds = result.map(row => row.maintenance_messageID);

        if (notificationIds.length > 0) {
            dbConnection.query(updateSql, [notificationIds], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating notifications:", updateErr);
                } else {
                    console.log("Notifications marked as sent.");
                }
            });
        }
    });
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default getMaintenanceNotifications;

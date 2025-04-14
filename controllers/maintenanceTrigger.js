import dbConnection from "../db.js";

const MaintenanceTriggerController = {
    /*
    Example response to frontend:
    {
        "notifications": [
            {
                "mnt_ID": 2,
                "maintenance_employeeID": 2,
                "message": "Maintenance has been requested:...",
                "Location_type": "Attraction",
                "Location_Name": "Lion Lookout",
                "Location_ID": 301
            },
            {
                "mnt_ID": 1,
                "maintenance_employeeID": 13,
                "message": "Maintenance has been requested:...",
                "Location_type": "Habitat",
                "Location_Name": "Rainforest Dome",
                "Location_ID": 202
            }
        ]
    }
    */

    // Function to get maintenance notifications from the database
    getMaintenanceNotifications: (req, res) => {
        // SQL query to get information from the maintenance_notifications table
        const sql = `
     SELECT
        m.mnt_ID,
        m.maintenance_employeeID,
        m.message,
        L.Location_type,
        CASE
        WHEN L.Location_ID = H.Status THEN H.Habitat_Name
        WHEN L.Location_ID = A.Status THEN A.Attraction_Name
        WHEN L.Location_ID = V.Status THEN V.name
        END AS Location_Name,
        L.Location_ID
    FROM maintenance_notifications m
       JOIN maintenance_location L ON m.maintenance_locationID = L.Location_ID
       LEFT JOIN habitat H ON L.Location_ID = H.Status
       LEFT JOIN attraction A ON L.Location_ID = A.Status
       LEFT JOIN vendor V ON L.Location_ID = V.Status
    WHERE m.message_sent = FALSE
       ORDER BY m.maintenance_messageID DESC;

        `;

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

    //function to handle acknowledgment of maintenance notifications by the frontend
    //expecting the maintenance id and a T for true from the frontend.
    seenMaintenanceNotification: (req, res) => {
        /*
        Ex: Frontend provides:
        {
        "maintenance_messageID": 1
        }
        */

        const { maintenance_messageID } = req.body;

        // SQL query to mark the notification as 'sent' after acknowledgment
        const sql = `UPDATE maintenance_notifications 
                    SET message_sent = TRUE 
                    WHERE maintenance_messageID = ?`;

        dbConnection.query(sql, [maintenance_messageID], (err, result) => {
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
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default MaintenanceTriggerController;
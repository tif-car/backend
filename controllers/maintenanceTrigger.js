import dbConnection from "../db.js";

const MaintenanceTriggerController = {
    /*
    Example response to frontend:
    {
        "notifications": [
            {
                "maintenance_messageID": 1,
                "maintenance_employeeID": 13,
                "message": "Maintenance has been requested:",
                "maintenance_locationID": 202,
                "Location_Name": "Rainforest Dome"
            },
            {
                "maintenance_messageID": 2,
                "maintenance_employeeID": 2,
                "message": "Maintenance has been requested:",
                "maintenance_locationID": 301,
                "Location_Name": "Lion Lookout"
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
                ml.Location_type,
                ml.Location_ID
            FROM maintenance_notifications m
            JOIN maintenance_location ml ON m.maintenance_locationID = ml.Maintenance_Location
            WHERE m.message_sent = FALSE
            ORDER BY m.maintenance_messageID DESC
        `;

        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return sendResponse(res, 500, { error: "Database error" });
            }

            if (result.length === 0) {
                return sendResponse(res, 200, { error: "No new maintenance notifications" });
            }

            // For each notification, get the corresponding location name
            const notificationsWithLocation = result.map(notification => {
                return getLocationName(notification.Location_ID, notification.Location_type)
                    .then(locationName => {
                        return { ...notification, Location_Name: locationName };
                    });
            });

            // Wait for all location names to be fetched
            Promise.all(notificationsWithLocation)
                .then(notifications => {
                    // Send notifications with location names to frontend
                    sendResponse(res, 200, { notifications });
                })
                .catch(err => {
                    console.error("Error fetching location names:", err);
                    sendResponse(res, 500, { error: "Error fetching location names" });
                });
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
}

// Function to get the location name based on the location ID
const getLocationName = (locationID, Location_type) => {
    return new Promise((resolve, reject) => {
        // Check if it's a vendor, habitat, or attraction by querying the tables
        const vendorSql = `SELECT name FROM vendor WHERE Vendor_ID = ?`;
        const habitatSql = `SELECT Habitat_Name FROM habitat WHERE Habitat_ID = ?`;
        const attractionSql = `SELECT Attraction_Name FROM attraction WHERE Attraction_ID = ?`;

        if(Location_type === "attraction"){
            dbConnection.query(attractionSql, [locationID], (err, attractionResult) => {
                if (err) return reject(err);

                if (attractionResult.length > 0) {
                    return resolve(attractionResult[0].Attraction_Name); // Attraction name
                }
            });
        } else if (Location_type === "habitat"){
            dbConnection.query(habitatSql, [locationID], (err, habitatResult) => {
                if (err) return reject(err);

                if (habitatResult.length > 0) {
                    return resolve(habitatResult[0].Habitat_Name); // Habitat name
                }
            });
        } else if(Location_type === "vendor"){
            dbConnection.query(vendorSql, [locationID], (err, vendorResult) => {
                if (err) return reject(err);
    
                if (vendorResult.length > 0) {
                    return resolve(vendorResult[0].name); // Vendor name
                }
            });
        } else {
            // If not found in any table
            resolve('Unknown Location');
        }   
    });
};


// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default MaintenanceTriggerController;
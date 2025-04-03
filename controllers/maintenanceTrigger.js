import dbConnection from "../db.js";


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

const getMaintenanceNotifications = (req, res) => {
    // SQL query to get information from the maintenance_notifications table
    const sql = `
        SELECT 
            m.maintenance_messageID, 
            m.maintenance_employeeID, 
            m.message, 
            m.maintenance_locationID
        FROM maintenance_notifications m
        WHERE m.sent = FALSE
        ORDER BY m.maintenance_messageID DESC
    `;

    dbConnection.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.length === 0) {
            return sendResponse(res, 404, { error: "No new maintenance notifications" });
        }

        // For each notification, get the corresponding location name
        const notificationsWithLocation = result.map(notification => {
            return getLocationName(notification.maintenance_locationID)
                .then(locationName => {
                    return { ...notification, Location_Name: locationName };
                });
        });

        // Wait for all location names to be fetched
        Promise.all(notificationsWithLocation)
            .then(notifications => {
                // Send notifications with location names to frontend
                sendResponse(res, 200, { notifications });
                
                // Mark notifications as "sent"
                //this is so the same message isn't sent twice
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
            })
            .catch(err => {
                console.error("Error fetching location names:", err);
                sendResponse(res, 500, { error: "Error fetching location names" });
            });
    });
};

// Function to get the location name based on the location ID
const getLocationName = (locationID) => {
    return new Promise((resolve, reject) => {
        // Check if it's a vendor, habitat, or attraction by querying the tables
        const vendorSql = `SELECT name FROM vendor WHERE Vendor_ID = ?`;
        const habitatSql = `SELECT Habitat_Name FROM habitat WHERE Habitat_ID = ?`;
        const attractionSql = `SELECT Attraction_Name FROM attraction WHERE Attraction_ID = ?`;

        dbConnection.query(vendorSql, [locationID], (err, vendorResult) => {
            if (err) return reject(err);

            if (vendorResult.length > 0) {
                return resolve(vendorResult[0].name); // Vendor name
            }

            dbConnection.query(habitatSql, [locationID], (err, habitatResult) => {
                if (err) return reject(err);

                if (habitatResult.length > 0) {
                    return resolve(habitatResult[0].Habitat_Name); // Habitat name
                }

                dbConnection.query(attractionSql, [locationID], (err, attractionResult) => {
                    if (err) return reject(err);

                    if (attractionResult.length > 0) {
                        return resolve(attractionResult[0].Attraction_Name); // Attraction name
                    }

                    // If not found in any table
                    resolve('Unknown Location');
                });
            });
        });
    });
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default getMaintenanceNotifications;

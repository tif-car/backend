import dbConnection from "../db.js";


/* 
Front end would receive this response in Format (JSON):
 {
  "notifications": [
     {
       "vendor_messageID": 1,
      "vendor_merchID": 101,
       "message": "Low supply alert: Only 5 items left for merch_ID 101",
       "Item_Name": "Safari Hat"
    },
     {
       "vendor_messageID": 2,
       "vendor_merchID": 102,
      "message": "Warning: out of stock",
       "Item_Name": "Plush Tiger Toy"
     }
   ]
  }
*/

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
            // Return an empty array[] if there is no message
            return sendResponse(res, 200, { notifications: [] });
        }

        //Sends notifications to frontend
        sendResponse(res, 200, { notifications: result });

        //Extract notification IDs
        const notificationIds = result.map(row => row.vendor_messageID);

        // Only update message_sent if there are notifications
        if (notificationIds.length > 0) {
            const updateSql = `UPDATE vendor_notifications SET message_sent = TRUE 
                               WHERE vendor_messageID IN (?)`;

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

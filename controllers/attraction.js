import dbConnection from "../db.js";

/*
Endpoints:
- `POST /api/getAttractionStatus`: Fetches `status_Type` based on `Attraction_Name`.
- `POST /api/updateAttractionStatus`: Updates the `status_Type` based on `status_typeID`.
*/

// Function to get the status type of an attraction based on Attraction_Name
const getAttractionStatus = (req, res) => {
    const { Attraction_Name } = req.body || {};

    if (!Attraction_Name) {
        return sendResponse(res, 400, { error: "Attraction_Name is required" });
    }

    const sql = `
        SELECT attrstatus_type.status_Type 
        FROM attraction 
        JOIN attrstatus_type ON attraction.Attraction_Status = attrstatus_type.status_typeID
        WHERE attraction.Attraction_Name = ?`;

    dbConnection.query(sql, [Attraction_Name], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (results.length === 0) {
            return sendResponse(res, 404, { error: "Attraction not found" });
        }

        sendResponse(res, 200, { status_Type: results[0].status_Type });
    });
};

// Function to update the status type based on status_typeID
const updateAttractionStatus = (req, res) => {
    const { status_typeID, status_Type } = req.body || {};

    if (!status_typeID || !status_Type) {
        return sendResponse(res, 400, { error: "status_typeID and status_Type are required" });
    }

    const sql = `UPDATE attrstatus_type SET status_Type = ? WHERE status_typeID = ?`;

    dbConnection.query(sql, [status_Type, status_typeID], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Status type not found or no changes made." });
        }

        sendResponse(res, 200, { message: "Status type updated successfully" });
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { getAttractionStatus, updateAttractionStatus };

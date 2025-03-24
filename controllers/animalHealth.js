import dbConnection from "../db.js";

// Function to update the wellness status of an animal.
//Frontend would need to include the animal_ID and wellness_status. Maybe from a dropdown box?
const updateAnimalWellness = (req, res) => {
    const { animal_ID, wellness_status } = req.body || {};

    if (!animal_ID || !wellness_status) {
        return sendResponse(res, 400, { error: "Animal ID and Wellness Status are required" });
    }

    const sql = `UPDATE animal SET Wellness_status = ? WHERE animal_ID = ?`;
    dbConnection.query(sql, [wellness_status, animal_ID], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Animal not found or no changes made." });
        }

        sendResponse(res, 200, { message: "Wellness status updated successfully" });
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { updateAnimalWellness };

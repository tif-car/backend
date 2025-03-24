import dbConnection from "../db.js";

// Get feeding details based on employee_ID and animal_ID
const feedingDetails = (req, res) => {
    const { employee_ID, animal_ID } = req.body || {};

    // Check if both parameters are provided
    if (!employee_ID || !animal_ID) {
        return sendResponse(res, 400, { error: "Both Employee ID and Animal ID are required." });
    }

    // SQL query to fetch feeding details
    const sql = `
        SELECT f.Feeding_Time, f.Quantity, ft.food_Types
        FROM feeding_log f
        JOIN food_type ft ON f.Food_Type = ft.foodtype_ID
        WHERE f.Employee_ID = ? AND f.Animal_ID = ?`;

    dbConnection.query(sql, [employee_ID, animal_ID], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.length === 0) {
            return sendResponse(res, 404, { error: "No feeding records found for this employee and animal." });
        }

        sendResponse(res, 200, { feedingDetails: result });
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { getFeedingDetails };

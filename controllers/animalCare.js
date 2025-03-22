import dbConnection from "../db.js";

// Get animal care tasks based on employee_ID
const getAnimalCareTasks = (req, res) => {
    const { employee_ID } = req.body || {};

    if (!employee_ID) {
        return sendResponse(res, 400, { error: "Employee ID is required" });
    }

    // Single query to get the animal name using JOIN between feeding_log and animal tables
    const sql = `
        SELECT a.animal_name
        FROM feeding_log f
        JOIN animal a ON f.animal_ID = a.animal_ID
        WHERE f.employee_ID = ?`;

    dbConnection.query(sql, [employee_ID], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
        if (result.length === 0) {
            console.log("No animal found for the employee.");
            return sendResponse(res, 404, { error: "No animal found for this employee." });
        }

        const animalName = result[0].animal_name;
        sendResponse(res, 200, { animal_name: animalName });
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { getAnimalCareTasks };

//work in progress
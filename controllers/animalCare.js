
import dbConnection from "../db.js";

/*
Endpoints:
- `POST /api/getAnimalCareTasks`: Fetches animal care information such as `animal_ID`, `animal_name`, and `habitat_ID`, based on `employee_ID`.
*/

// Get animal care tasks based on employee_ID
const getAnimalCareTasks = (req, res) => {
    const { employee_ID } = req.body || {};

    if (!employee_ID) {
        return sendResponse(res, 400, { error: "Employee ID is required" });
    }

    // Query to get animal_ID, animal_name, habitat_ID, habitat_Name
    const sql = `
        SELECT a.animal_ID, a.animal_name, a.habitat_ID, h.Habitat_Name
        FROM feeding_log f
        JOIN animal a ON f.animal_ID = a.animal_ID
        JOIN habitat h ON a.habitat_ID = h.Habitat_ID
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

        // Return all assigned animals with their details
        const animals = result.map(row => ({
            animal_ID: row.animal_ID,
            animal_name: row.animal_name,
            habitat_ID: row.habitat_ID,
            habitat_name: row.Habitat_Name // New field added
        }));

        sendResponse(res, 200, { animals });
    });
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { getAnimalCareTasks };

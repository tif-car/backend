import dbConnection from "../db.js";

// Function to fetch feeding details based on Employee_ID and Animal_ID
const getFeedingDetails = (req, res) => {
    const { employee_ID, animal_ID } = req.body;

    if (!employee_ID || !animal_ID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Both employee_ID and animal_ID are required" }));
        return;
    }

    // SQL Query to retrieve feeding details
    const sql = `
        SELECT f.Food_Time, f.Feeding_Time, f.Quantity, ft.food_Types
        FROM feeding_log f
        JOIN food_type ft ON f.Food_Time = ft.foodtype_ID
        WHERE f.Employee_ID = ? AND f.Animal_ID = ?;
    `;

    dbConnection.query(sql, [employee_ID, animal_ID], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
        }

        if (result.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No feeding details found for the given IDs" }));
            return;
        }

        // Sending the retrieved feeding details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
    });
};

// Exporting the function correctly
export default { getFeedingDetails };

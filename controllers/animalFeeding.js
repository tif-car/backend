import pool from "../db.js"; // Use pool for query handling

// Function to fetch feeding details based on Employee_ID and Animal_ID
const getFeedingDetails = async (req, res) => {
    const { employee_ID, animal_ID } = req.body;

    if (!employee_ID || !animal_ID) {
        return sendResponse(res, 400, { error: "Both employee_ID and animal_ID are required" });
    }

    // SQL Query to retrieve feeding details
    const sql = `
        SELECT f.Feeding_Time, f.Quantity, ft.food_Types
        FROM feeding_log f
        JOIN food_type ft ON f.Food_Time = ft.foodtype_ID
        WHERE f.Employee_ID = ? AND f.Animal_ID = ?;
    `;

    try {
        // Query database using async/await and pool.promise()
        const [result] = await pool.promise().query(sql, [employee_ID, animal_ID]);

        if (result.length === 0) {
            return sendResponse(res, 404, { error: "No feeding details found for the given IDs" });
        }

        // Sending the retrieved feeding details
        sendResponse(res, 200, result);
    } catch (err) {
        console.error("Database query error:", err);
        return sendResponse(res, 500, { error: "Database error" });
    }
};

// Function to fetch feeding form info such as Animals, Units, and Food Types
const getFeedingFormInfo = async (req, res) => {
    const { employee_ID } = req.body;

    let combinedResults = {
        Animals: {}, // animals under the care of the given employee ID
        Units: {}, // units in DB
        Food_types: {} // Food types in DB
    };

    if (!employee_ID) {
        return sendResponse(res, 400, { error: "employee_ID is required" });
    }

    // SQL Queries to retrieve animals, units, and food types
    const animalSql = `
        SELECT a.Animal_ID, a.Animal_Name
        FROM employee e
        JOIN works_at w ON w.E_ID = e.Employee_ID
        JOIN habitat h ON h.Habitat_ID = w.Hab_ID
        JOIN animal a ON a.Habitat_ID = h.Habitat_ID
        WHERE e.Employee_ID = ?;
    `;

    const unitSql = `SELECT * FROM unit;`;

    const foodSql = `SELECT * FROM food_type;`;

    try {
        // Fetch animals, units, and food types in parallel using async/await
        const [aniResult] = await pool.promise().query(animalSql, [employee_ID]);
        const [uniResult] = await pool.promise().query(unitSql);
        const [fResult] = await pool.promise().query(foodSql);

        if (aniResult.length === 0) {
            return sendResponse(res, 404, { error: "No animals found for the given employee ID" });
        }

        combinedResults = {
            Animals: aniResult,
            Units: uniResult,
            Food_types: fResult
        };

        // Sending the combined results
        sendResponse(res, 200, combinedResults);

    } catch (err) {
        console.error("Database query error:", err);
        return sendResponse(res, 500, { error: "Database error" });
    }
};

// Function to create a new feeding log
const createFeedingLog = async (req, res) => {
    const { animal_ID, employee_ID, date, time, foodtID, quantity, unittID } = req.body;

    if (!employee_ID || !animal_ID || !date || !time || !foodtID || !quantity || !unittID) {
        return sendResponse(res, 400, { error: "All fields are required" });
    }

    // SQL Query to insert new feeding log
    const sql = `
        INSERT INTO feeding_log (animal_id, employee_id, feeding_date, feeding_time, food_type, quantity, q_unit)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    try {
        // Insert new feeding log into the database
        const [result] = await pool.promise().query(sql, [animal_ID, employee_ID, date, time, foodtID, quantity, unittID]);

        // Sending the new feeding log details
        sendResponse(res, 201, { message: "Feeding log created successfully.", FeedLog_ID: result.insertId });
    } catch (err) {
        console.error("Database query error:", err);
        return sendResponse(res, 500, { error: "Database error" });
    }
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

// Exporting the functions correctly
export default { getFeedingDetails, getFeedingFormInfo, createFeedingLog };

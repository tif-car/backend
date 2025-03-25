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

// Function to fetch feeding details based on Employee_ID and Animal_ID
const getFeedingFormInfo = (req, res) => {
    const { employee_ID } = req.body;

    const combinedResults = {
        Animals: {}, // animals under the care of the given employee ID
        Units: {}, // units in DB
        Food_types: {}  // Food types in DB
    };

    if (!employee_ID ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Both employee_ID and animal_ID are required" }));
        return;
    }

    // SQL Query to retrieve feeding details
    const animalSql = ` select a.Animal_ID, a.Animal_Name
                        from employee e
                        join works_at w on w.E_ID = e.Employee_ID
                        join  habitat h on h.Habitat_ID = w.Hab_ID
                        join animal a on a.Habitat_ID = h.Habitat_ID
                        where e.Employee_ID = 5;`;

    const unitSql =`select * from unit;`;

    const foodSql =`select * from food_type;`;


    dbConnection.query(animalSql, [employee_ID], (err, aniResult) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
        }

        if (result.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No animals found for the given ID" }));
            return;
        }
        combinedResults = {
            animals: {aniResult}
        };
    });

    dbConnection.query(unitSql, (err, uniResult) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
        }

        combinedResults = {
            Units: {uniResult}
        };
    });

    dbConnection.query(foodSql, (err, fResult) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
        }

        combinedResults = {
            Food_types: {fResult}
        };
    });

    // Sending the retrieved feeding details
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(combinedResults));
};

// Function to fetch feeding details based on Employee_ID and Animal_ID
const createFeedingLog = (req, res) => {
    const { animal_ID, employee_ID, date, time, foodtID, quantity, unittID} = req.body;

    if (!employee_ID || !animal_ID ||!date || !time || !foodtID || !quantity || !unittID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Both employee_ID and animal_ID are required" }));
        return;
    }

    // SQL Query to retrieve feeding details
    const sql = `
        insert into feeding_log (animal_id, employee_id, food_type, feeeding_date, feeding_time, quantity, q_unit)
        values( ?, ?, ?, ?, ?, ?, ?, ? );
    `;

    dbConnection.query(sql, [animal_ID, employee_ID, date, time, foodtID, quantity, unittID], (err) => {
        if (err) {
            console.error("Database query error:", (err, result));
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
            return;
        }

        // Sending the new feeding log details
        sendResponse(res, 201, { message: "Medical record created successfully.", FeedLog_ID: result.insertId });

    });
};

// Exporting the function correctly
export default { getFeedingDetails , getFeedingFormInfo, createFeedingLog};

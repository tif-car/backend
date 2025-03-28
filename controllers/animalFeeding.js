import pool from "../db.js";

const animalFeedingController = {
    // Existing functions from your friend's code
    getFeedingDetails: async (req, res) => {
        const { employee_ID, animal_ID } = req.body;

        if (!employee_ID || !animal_ID) {
            return sendResponse(res, 400, { error: "Both employee_ID and animal_ID are required" });
        }

        const sql = `
            SELECT f.Feeding_Time, f.Quantity, ft.food_Types
            FROM feeding_log f
            JOIN food_type ft ON f.Food_Time = ft.foodtype_ID
            WHERE f.Employee_ID = ? AND f.Animal_ID = ?;
        `;

        try {
            const [result] = await pool.promise().query(sql, [employee_ID, animal_ID]);
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "No feeding details found for the given IDs" });
            }
            sendResponse(res, 200, result);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    getFeedingFormInfo: async (req, res) => {
        const { employee_ID } = req.body;

        if (!employee_ID) {
            return sendResponse(res, 400, { error: "employee_ID is required" });
        }

        const animalSql = `
            SELECT a.Animal_ID, a.Animal_Name
            FROM employee e
            JOIN works_at w ON w.E_ID = e.Employee_ID
            JOIN habitat h ON h.Habitat_ID = w.Hab_ID 
            JOIN animal a ON a.Habitat_ID = h.Habitat_ID
            WHERE e.Employee_ID = ?;
        `;

        const unitSql = `SELECT * FROM unit;`; // Units[0].id or .unit_text
        const foodSql = `SELECT * FROM food_type;`;//Food_types[n].foodID or food_text 

        try {
            const [aniResult] = await pool.promise().query(animalSql, [employee_ID]);
            const [uniResult] = await pool.promise().query(unitSql);
            const [fResult] = await pool.promise().query(foodSql);

            if (aniResult.length === 0) {
                return sendResponse(res, 404, { error: "No animals found for the given employee ID" });
            }

            const combinedResults = {
                Animals: aniResult, // [Animal_ID, Animal_name]
                Units: uniResult, // [Unit_ID, Unit_text]
                Food_types: fResult // [Food_ID, Food_text]
            };

            sendResponse(res, 200, combinedResults);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    createFeedingLog: async (req, res) => {
        const { animal_ID, employee_ID, date, time, foodtID, quantity, unittID } = req.body;

        if (!employee_ID || !animal_ID || !date || !time || !foodtID || !quantity || !unittID) {
            return sendResponse(res, 400, { error: "All fields are required" });
        }

        const sql = `
            INSERT INTO feeding_log (animal_id, employee_id, feeding_date, feeding_time, food_type, quantity, q_unit)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        try {
            const [result] = await pool.promise().query(sql, [animal_ID, employee_ID, date, time, foodtID, quantity, unittID]);
            sendResponse(res, 201, { message: "Feeding log created successfully.", FeedLog_ID: result.insertId });
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    getFeedingQueryFormInfo: async (req, res) => {

        const empSql = `
            select distinct e.first_name, last_name ,e.Employee_ID
            from employee e
            join Feeding_log Fl on e.Employee_ID = Fl.Employee_ID;`;


        const aniSql = `select a.Animal_Name, a.Animal_ID from animal a;`;
        const habSql = `select h.Habitat_Name, h.Habitat_ID from habitat h;`; 
        const unitSql = `SELECT * FROM unit;`; // Units[0].id or .unit_text
        const foodSql = `SELECT * FROM food_type;`;//Food_types[n].foodID or food_text
        const speSql = `select s.Species_ID, s.Name from species s;`;

        try {
            const [empResult] = await pool.promise().query(empSql);
            const [uniResult] = await pool.promise().query(unitSql);
            const [fResult] = await pool.promise().query(foodSql);
            const [habResult] = await pool.promise().query(habSql);
            const [aniResult] = await pool.promise().query(aniSql);
            const [speResult] = await pool.promise().query(speSql);

            if (aniResult.length === 0) {
                return sendResponse(res, 404, { error: "No animals found for the given employee ID" });
            }

            const combinedResults = {
                Animals: aniResult, // [Animal_ID, Animal_name]
                Units: uniResult, // [Unit_ID, Unit_text]
                Food_types: fResult, // [Food_ID, Food_text]
                Employees: empResult, // [employee_id, name]
                Habitats: habResult, // [habitat_id, habitat_name]
                Species: speResult, // [species_id, species_name]
            };

            sendResponse(res, 200, combinedResults);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    QueryFeedingLogs: async (req, res) => {
        const { animal_ID, employee_ID, date, time, foodtID, species_ID, Habitat_ID } = req.body || {} ;

        let query = `select
                        A.Animal_Name,
                        s.Name,
                        e.first_name,
                        e.last_name,
                        ft.food_Types,
                        fl.Quantity,
                        u.Unit_text,
                        fl.Feeding_Date,
                        fl.Feeding_Time
                    from feeding_log fl
                    join Animal A on fl.Animal_ID = A.Animal_ID
                    join employee e on fl.Employee_ID = e.Employee_ID
                    join Species S on A.Species_ID = S.Species_ID
                    join unit u on u.Unit_ID = fl.Q_Unit
                    join food_type ft on ft.foodtype_ID = fl.Food_Type `;
        
        // Initialize conditions and parameters
        const conditions = [];
        const parameters = [];

        // Dynamically add conditions based on provided parameters
        if (animal_ID) {
            conditions.push("fl.Animal_ID = ?");
            parameters.push(animal_ID);
        }
        
        if (employee_ID) {
            conditions.push("fl.Employee_ID = ?");
            parameters.push(employee_ID);
        }
        
        if (date) {
            conditions.push("fl.Feeding_Date = ?");
            parameters.push(date);
        }
        
        if (time) {
            conditions.push("fl.Feeding_Time = ?");
            parameters.push(time);
        }
        
        if (foodtID) {
            conditions.push("fl.Food_Type = ?");
            parameters.push(foodtID);
        }
        
        if (species_ID) {
            conditions.push("A.Species_ID = ?");
            parameters.push(species_ID);
        }
        
        if (Habitat_ID) {
            conditions.push("A.Habitat_ID = ?");
            parameters.push(Habitat_ID);
        }

        // Add WHERE clause if any conditions exist
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        } 
            
        try{
            // Only pass parameters if they exist
            const [logs] = parameters.length > 0 
                ? await pool.promise().query(query, parameters)
                : await pool.promise().query(query);
            sendResponse(res, 200, logs);
        } catch(error){
            console.error('Error in getFeedingLogsByEmployee:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }

    },

    // Our new functions for retrieving feeding logs
    getFeedingLogsByEmployee: async (req, res) => {
        try {
            const { Employee_ID } = req.body;
            if (!Employee_ID) {
                return sendResponse(res, 400, { error: "Employee ID is required" });
            }

            const query = `
                SELECT 
                    fl.Feeding_ID,
                    fl.Animal_ID,
                    fl.Employee_ID,
                    fl.Food_Type,
                    fl.Feeding_Date,
                    fl.Quantity,
                    fl.Q_Unit,
                    fl.Feeding_Time,
                    a.Animal_Name,
                    e.First_Name,
                    e.Last_Name
                FROM feeding_log fl
                JOIN animal a ON fl.Animal_ID = a.Animal_ID
                JOIN employee e ON fl.Employee_ID = e.Employee_ID
                WHERE fl.Employee_ID = ?
                ORDER BY fl.Feeding_Date DESC, fl.Feeding_Time DESC
            `;

            const [logs] = await pool.promise().query(query, [Employee_ID]);
            sendResponse(res, 200, logs);
        } catch (error) {
            console.error('Error in getFeedingLogsByEmployee:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    },

    getFeedingLogsByAnimal: async (req, res) => {
        try {
            const { Animal_ID } = req.body;
            if (!Animal_ID) {
                return sendResponse(res, 400, { error: "Animal ID is required" });
            }

            const query = `
                SELECT 
                    fl.Feeding_ID,
                    fl.Animal_ID,
                    fl.Employee_ID,
                    fl.Food_Type,
                    fl.Feeding_Date,
                    fl.Quantity,
                    fl.Q_Unit,
                    fl.Feeding_Time,
                    a.Animal_Name,
                    e.First_Name,
                    e.Last_Name
                FROM feeding_log fl
                JOIN animal a ON fl.Animal_ID = a.Animal_ID
                JOIN employee e ON fl.Employee_ID = e.Employee_ID
                WHERE fl.Animal_ID = ?
                ORDER BY fl.Feeding_Date DESC, fl.Feeding_Time DESC
            `;

            const [logs] = await pool.promise().query(query, [Animal_ID]);
            sendResponse(res, 200, logs);
        } catch (error) {
            console.error('Error in getFeedingLogsByAnimal:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    },

    getFeedingLogsByDate: async (req, res) => {
        try {
            const { date } = req.body;
            if (!date) {
                return sendResponse(res, 400, { error: "Date is required (YYYY-MM-DD format)" });
            }

            const query = `
                SELECT 
                    fl.Feeding_ID,
                    fl.Animal_ID,
                    fl.Employee_ID,
                    fl.Food_Type,
                    fl.Feeding_Date,
                    fl.Quantity,
                    fl.Q_Unit,
                    fl.Feeding_Time,
                    a.Animal_Name,
                    e.First_Name,
                    e.Last_Name
                FROM feeding_log fl
                JOIN animal a ON fl.Animal_ID = a.Animal_ID
                JOIN employee e ON fl.Employee_ID = e.Employee_ID
                WHERE fl.Feeding_Date = ?
                ORDER BY fl.Feeding_Time DESC
            `;

            const [logs] = await pool.promise().query(query, [date]);
            sendResponse(res, 200, logs);
        } catch (error) {
            console.error('Error in getFeedingLogsByDate:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    },

    getFeedingLogsByFoodType: async (req, res) => {
        try {
            const { Food_Type } = req.body;
            if (!Food_Type) {
                return sendResponse(res, 400, { error: "Food Type is required" });
            }

            const query = `
                SELECT 
                    fl.Feeding_ID,
                    fl.Animal_ID,
                    fl.Employee_ID,
                    fl.Food_Type,
                    fl.Feeding_Date,
                    fl.Quantity,
                    fl.Q_Unit,
                    fl.Feeding_Time,
                    a.Animal_Name,
                    e.First_Name,
                    e.Last_Name
                FROM feeding_log fl
                JOIN animal a ON fl.Animal_ID = a.Animal_ID
                JOIN employee e ON fl.Employee_ID = e.Employee_ID
                WHERE fl.Food_Type = ?
                ORDER BY fl.Feeding_Date DESC, fl.Feeding_Time DESC
            `;

            const [logs] = await pool.promise().query(query, [Food_Type]);
            sendResponse(res, 200, logs);
        } catch (error) {
            console.error('Error in getFeedingLogsByFoodType:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    }
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default animalFeedingController;

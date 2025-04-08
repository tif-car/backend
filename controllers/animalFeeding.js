import pool from "../db.js";

const animalFeedingController = {
   
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
            JOIN habitat h ON h.Habitat_ID = w.Habitat_ID 
            JOIN animal a ON a.Habitat_ID = h.Habitat_ID
            WHERE e.Employee_ID = ?;
        `;

        const unitSql = `SELECT * FROM unit;`;
        const foodSql = `SELECT * FROM food_type;`;

        try {
            const [aniResult] = await pool.promise().query(animalSql, [employee_ID]);
            const [uniResult] = await pool.promise().query(unitSql);
            const [fResult] = await pool.promise().query(foodSql);

            if (aniResult.length === 0) {
                return sendResponse(res, 404, { error: "No animals found for the given employee ID" });
            }

            const combinedResults = {
                Animals: aniResult,
                Units: uniResult,
                Food_types: fResult
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
        const unitSql = `SELECT * FROM unit;`;
        const foodSql = `SELECT * FROM food_type;`;
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
                Animals: aniResult,
                Units: uniResult,
                Food_types: fResult,
                Employees: empResult,
                Habitats: habResult,
                Species: speResult
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
        
        const conditions = [];
        const parameters = [];

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

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        } 
            
        try{
            const [logs] = parameters.length > 0 
                ? await pool.promise().query(query, parameters)
                : await pool.promise().query(query);
            sendResponse(res, 200, logs);
        } catch(error){
            console.error('Error in getFeedingLogsByEmployee:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }

    },

};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default animalFeedingController;

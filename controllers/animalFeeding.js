import pool from "../db.js";

const animalFeedingController = {
   
    getFeedingDetails: async (req, res) => {
        const { feedingId } = req.body;

        if (!feedingId ) {
            return sendResponse(res, 400, { error: "feeding log ID is required" });
        }

        const sql = `
            select Animal_ID, 
                Food_Type, 
                Feeding_Date, 
                Feeding_Time, 
                Quantity, 
                Q_Unit,
                e.Employee_ID, 
                e.first_Name, 
                e.last_Name
            from feeding_log
            join employee e on feeding_log.Employee_ID = e.Employee_ID
            where Feeding_ID = ?;
        `;

        try {
            const [result] = await pool.promise().query(sql, [feedingId]);

            const row = result[0];
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "No feeding details found for the given ID" });
            }
            sendResponse(res, 200,{row});
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
            JOIN works_at w ON w.Employee_ID = e.Employee_ID
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
        const {
            animal_ID,
            employee_ID,
            date,
            time,
            foodtID,
            speciesID,  
            Habitat_ID,
          } = req.body || {};
          

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
        
        if (speciesID) {
            conditions.push("A.Species_ID = ?");
            parameters.push(speciesID);
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

    //feedingLog View based on employee_ID
     employeeFeedingLogView: async (req, res) => {
        const { employee_ID } = req.body;
    
        if (!employee_ID) {
            return sendResponse(res, 400, { error: "employee_ID is required" });
        }
    
        const sql = `
            SELECT *
            FROM FEEDINGLOG_View
            WHERE Employee_ID = ?
            ORDER BY Feeding_Date DESC, Feeding_Time DESC;
        `;
    
        try {
            const [result] = await pool.promise().query(sql, [employee_ID]);
    
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "No feeding logs found for this employee." });
            }
    
            sendResponse(res, 200, {feeding_logs: result});
        } catch (err) {
            console.error("Error fetching feeding logs from view:", err);
            return sendResponse(res, 500, { error: "Internal server error" });
        }
    },

    editFeedingLog: async (req,res) => {
        const {
            Feeding_ID,
            Food_Type,
            date,
            time,
            Quantity,
            Q_Unit,
        } = req.body;

        if (!Feeding_ID) {
            return sendResponse(res, 400, { error: "Feeding_ID is required" });
        }

        const updates = [];
        const values = [];

        if(Food_Type){
            updates.push("Food_Type = ?");
            values.push(Food_Type);
        }
        if(Quantity){
            updates.push("Quantity = ?");
            values.push(Quantity);
        }
        if(Q_Unit){
            updates.push("Q_Unit = ?");
            values.push(Q_Unit);
        }
        if(date){
            updates.push("Feeding_Date = ?");
            values.push(date);
        }
        if(time){
            updates.push("Feeding_Time = ?");
            values.push(time);
        }

        // If no fields provided to update
        if (updates.length === 0) {
            return sendResponse(res, 400, { error: "At least one field must be provided for update" });
        }

        values.push(Feeding_ID);

        const sql =`
            UPDATE feeding_log
            SET ${updates.join(", ")}
            WHERE Feeding_ID = ?;`;

        try {
            const [result] = await pool.promise().query(sql, values);
        
            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "No record found with the given Feeding_ID" });
            }
        
            sendResponse(res, 200, { message: "Feeding Log updated successfully" });
            } catch (err) {
            console.error("Error while updating maintenance record:", err);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    },

    deleteFeedingLog: async (req, res) => {
        const {Feeding_ID} = req.body;

        if (!Feeding_ID) {
            return sendResponse(res, 400, { error: "Feeding_ID is required" });
        }

        const sql = `
            DELETE FROM feeding_log
            WHERE Feeding_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, Feeding_ID);
        
            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "No record found with the given Feeding_ID" });
            }
        
            sendResponse(res, 200, { message: "Feeding Log Deleted successfully" });
            } catch (err) {
            console.error("Error while updating feeding log:", err);
            sendResponse(res, 500, { error: "Internal server error" });
        }

    }
    
};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default animalFeedingController;

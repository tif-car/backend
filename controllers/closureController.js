import pool from "../db.js"; // Use pool for database queries


const ClosureController = {

    //add a closure row to the table
    addClosure: async (req, res) => {

/* Ex: Frontend provides:
 {
     "start_date": "2025-05-01",
     "end_date": "2025-05-03",
     "location_ID": 2,
     "status": 1,
     "description": "Routine maintenance in penguin attraction",
     "mnt_ID": 12
 }
 Output:
 {
     "message": "Closure created successfully.",
     "closure_ID": 5
 } */
        const { start_date, location_ID, description, mnt_ID } = req.body.payload || {};

        // Now enforcing description as required
        if (!start_date || !location_ID || !description || !mnt_ID) {
            return sendResponse(res, 400, {
                error: "start_date, location_ID, description, and mnt_ID are required.",
            });
        }

        const sql = `
            INSERT INTO closure (start_date, location_ID, description, mnt_ID)
            VALUES (?, ?, ?, ?)
        `;

        const values = [start_date, location_ID, description, mnt_ID];

        try {
            const [result] = await pool.promise().query(sql, values);
            sendResponse(res, 201, {
                message: "Closure created successfully.",
                closure_ID: result.insertId,
            });
        } catch (err) {
            console.error("Database insertion error:", err);
            sendResponse(res, 500, { error: "Database error while adding closure." });
        }
    },


    //edit a row in the closure table
    editClosure: async (req, res) => {
        
/* Ex: Frontend provides:
    {
        "closure_ID": 5,
        "end_date": "2025-05-15",
        "description": "Extended due to rain"
    }
    Output:
    {
        "message": "Closure updated successfully."
    } */
        const { closure_ID, start_date, end_date, location_ID, status, description, mnt_ID } = req.body || {};

        if (!closure_ID) {
            return sendResponse(res, 400, { error: "closure_ID is required for updating closure." });
        }

        let setClause = [];
        let values = [];

        if (start_date) {
            setClause.push("start_date = ?");
            values.push(start_date);
        }
        if (end_date) {
            setClause.push("end_date = ?");
            values.push(end_date);
        }
        if (location_ID) {
            setClause.push("location_ID = ?");
            values.push(location_ID);
        }
        if (status) {
            setClause.push("status = ?");
            values.push(status);
        }
        if (description) {
            setClause.push("description = ?");
            values.push(description);
        }
        if (mnt_ID) {
            setClause.push("mnt_ID = ?");
            values.push(mnt_ID);
        }

        if (setClause.length === 0) {
            return sendResponse(res, 400, { error: "No fields provided for update." });
        }

        const sql = `UPDATE closure SET ${setClause.join(", ")} WHERE closure_ID = ?`;
        values.push(closure_ID);

        try {
            const [result] = await pool.promise().query(sql, values);

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "Closure not found." });
            }

            sendResponse(res, 200, { message: "Closure updated successfully." });
        } catch (err) {
            console.error("Database update error:", err);
            sendResponse(res, 500, { error: "Database error while updating closure." });
        }
    },

    // Delete a closure row, frontent will need to provide closure_ID 
    deleteClosure: async (req, res) => {
        const { closure_ID } = req.body;

        if (!closure_ID) {
            return sendResponse(res, 400, { error: "closure_ID is required to delete a closure." });
        }

        const sql = `DELETE FROM closure WHERE closure_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, [closure_ID]);

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "Closure not found." });
            }

            sendResponse(res, 200, { message: "Closure deleted successfully." });
        } catch (err) {
            console.error("Database deletion error:", err);
            sendResponse(res, 500, { error: "Database error while deleting closure." });
        }
    },

    //Function to see the CLOSURE_VIEW 
    //Returns newest closure rows first
    closureView: async (req, res) => {
    
        const sql = `SELECT * FROM CLOSURE_VIEW 
                     ORDER BY closure_ID ASC`;
    
        try {
            const [results] = await pool.promise().query(sql);
            sendResponse(res, 200, { data: results });
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    }

};


// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default ClosureController;
import pool from "../db.js";

    /*
    Endpoints:
    - `POST /api/getAttractionStatus`: Retrieves the status type of an attraction based on its name.
    - `POST /api/updateAttractionStatus`: Updates the status type of an attraction.
    */

const attractionController = {
    //Function to get the status_Type. Frontend will give the Attraction_Name
    async getAttractionStatus(req, res) {
        const { Attraction_Name } = req.body;

        if (!Attraction_Name) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Attraction_Name is required" }));
            return;
        }

        try {
            const [rows] = await pool.query(
                `SELECT attrstatus_type.status_Type 
                 FROM attraction 
                 JOIN attrstatus_type ON attraction.Attraction_Status = attrstatus_type.status_typeID 
                 WHERE attraction.Attraction_Name = ?`,
                [Attraction_Name]
            );

            if (rows.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Attraction not found" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(rows[0])); // Returns { status_Type: "Operational" }
            }
        } catch (error) {
            console.error("Database Error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
    },

    //Function to update the status_Type in attrstatus_type table
    async updateAttractionStatus(req, res) {
        const { status_typeID, newStatusType } = req.body;

        if (!status_typeID || !newStatusType) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Missing status_typeID or newStatusType" }));
            return;
        }

        try {
            const [result] = await pool.query(
                `UPDATE attrstatus_type 
                 SET status_Type = ? 
                 WHERE status_typeID = ?`,
                [newStatusType, status_typeID]
            );

            if (result.affectedRows === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Status type ID not found" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Status type updated successfully" }));
            }
        } catch (error) {
            console.error("Database Error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
    }
};

//default export
export default attractionController;

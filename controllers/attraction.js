import pool from "../db.js";

const attractionController = {
  // ✅ Get the status_Type based on Attraction_Name
  async getAttractionStatus(req, res) {
    const { Attraction_Name } = req.body;

    if (!Attraction_Name) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Attraction_Name is required" }));
      return;
    }

    try {
      const [rows] = await pool.promise().query(
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

  // ✅ Update the status_Type by status_typeID
  async updateAttractionStatus(req, res) {
    const { status_typeID, newStatusType } = req.body;

    if (!status_typeID || !newStatusType) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing status_typeID or newStatusType" }));
      return;
    }

    try {
      const [result] = await pool.promise().query(
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
  },

  async getAllAttractions(req, res) {
    try {
      const [rows] = await pool.promise().query(`
        SELECT 
          a.Attraction_ID AS id,
          a.Attraction_Name AS name,
          a.Annual_Cost,
          a.Dept_ID,
          a.Habitat_ID,
          mntstatus_type.status_types AS status
        FROM attraction a
        JOIN maintenance_location ml ON a.Status = ml.Location_ID
        JOIN mntstatus_type ON ml.status_type = mntstatus_type.status_typeID
      `);
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.error("Error fetching attractions with status:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
  
  
};

export default attractionController;

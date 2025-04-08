// backend/controllers/merchandiseController.js
import pool from "../db.js";

const merchandiseController = {
  getAllMerchandise: async (req, res) => {
    try {
      const [rows] = await pool.promise().query("SELECT * FROM merchandise");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (error) {
      console.error("Error fetching merchandise:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch merchandise" }));
    }
  },
};

export default merchandiseController;


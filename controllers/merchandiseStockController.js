import pool from "../db.js";

const merchandiseStockController = {
  getCurrentStock: async (req, res) => {
    try {
      const [rows] = await pool.promise().query(`
        SELECT 
          m.Merch_ID AS merch_ID,
          m.Name AS name,
          m.Price AS price,
          m.Cost AS cost,
          COUNT(s.Item_ID) AS current_stock
        FROM merchandise m
        LEFT JOIN single_item s ON m.Merch_ID = s.merch_ID AND s.order_ID IS NULL
        GROUP BY m.Merch_ID, m.Name, m.Price, m.Cost
        ORDER BY m.Merch_ID
      `);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (error) {
      console.error(" Error fetching stock info:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

export default merchandiseStockController;

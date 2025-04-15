import pool from "../db.js";

const merchandiseStockController = {
  getCurrentStock: async (req, res) => {
    try {
      const [rows] = await pool.promise().query(`
        SELECT
          m.Merchandise_ID AS merch_ID,
          m.Item_Name AS name,
          m.Item_Price AS price,
          m.m_cost AS cost,
          COUNT(s.Item_ID) AS current_stock
        FROM merchandise m
        LEFT JOIN single_item s ON m.Merchandise_ID = s.merch_ID AND s.order_ID IS NULL
        GROUP BY Merchandise_ID;
      `);

      sendResponse(res, 200, {rows});
    } catch (error) {
      console.error(" Error fetching stock info:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export default merchandiseStockController;

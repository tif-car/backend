import pool from "../db.js";

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const shopOrderController = {
  createOrder: async (req, res) => {
    try {
      const { Visitor_ID, items } = req.body;

      if (!Visitor_ID || !Array.isArray(items) || items.length === 0) {
        console.log(" Invalid payload structure.");
        return sendJSON(res, 400, { error: "Invalid input data" });
      }

      console.log("🛒 Visitor_ID:", Visitor_ID);
      console.log("🧾 Items:", items);

      const conn = await pool.promise().getConnection();
      await conn.beginTransaction();

      // Validate inventory
      for (const item of items) {
        const { Merchandise_ID, quantity } = item;

        if (!Merchandise_ID || !quantity || quantity < 1) {
          await conn.rollback();
          conn.release();
          return sendJSON(res, 400, { error: `Invalid item or quantity: ${JSON.stringify(item)}` });
        }

        const [stockRows] = await conn.query(
          `SELECT COUNT(*) AS available FROM single_item WHERE merch_ID = ? AND order_ID IS NULL`,
          [Merchandise_ID]
        );

        if (stockRows[0].available < quantity) {
          await conn.rollback();
          conn.release();
          return sendJSON(res, 400, {
            error: `Not enough stock for merchandise ID ${Merchandise_ID}. Available: ${stockRows[0].available}, Requested: ${quantity}`,
          });
        }
      }

      // Create the order
      const [orderResult] = await conn.query(
        "INSERT INTO orders (Visitor_ID, Order_Date) VALUES (?, CURDATE())",
        [Visitor_ID]
      );
      const orderId = orderResult.insertId;
      console.log("🆕 Created Order ID:", orderId);

      // Assign items to order
      for (const item of items) {
        const { Merchandise_ID, quantity } = item;

        await conn.query(
          `UPDATE single_item
           SET order_ID = ?
           WHERE merch_ID = ? AND order_ID IS NULL
           LIMIT ?`,
          [orderId, Merchandise_ID, quantity]
        );
        console.log(`✅ Assigned ${quantity} of merch_ID ${Merchandise_ID} to order ${orderId}`);
      }

      await conn.commit();
      conn.release();

      return sendJSON(res, 200, { message: "Shop order successfully saved!" });

    } catch (error) {
      console.error(" Error in createOrder:", error);
      return sendJSON(res, 500, { error: "Internal server error" });
    }
  },
};

export default shopOrderController;

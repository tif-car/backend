import pool from "../db.js";

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const shopOrderController = {
  createOrder: async (req, res) => {
    try {
      const { Visitor_ID, items } = req.body;

      if (!Visitor_ID || !Array.isArray(items)) {
        console.log("❌ Invalid payload structure.");
        return sendJSON(res, 400, { error: "Invalid input data" });
      }

      console.log("🛒 Visitor_ID:", Visitor_ID);
      console.log("🧾 Items:", items);

      const [orderResult] = await pool
        .promise()
        .query("INSERT INTO orders (Visitor_ID, Order_Date) VALUES (?, CURDATE())", [Visitor_ID]);

      const orderId = orderResult.insertId;
      console.log("🆕 Created Order ID:", orderId);

      const insertPromises = items.map((item) =>
        pool
          .promise()
          .query(
            "INSERT INTO single_item (merch_ID, order_ID) VALUES (?, ?)",
            [item.Merchandise_ID, orderId]
          )
      );

      await Promise.all(insertPromises);
      console.log("✅ All items added to single_item");

      return sendJSON(res, 200, { message: "Shop order successfully saved!" });

    } catch (error) {
      console.error("🔥 Error in createOrder:", error);
      sendJSON(res, 500, { error: "Internal server error" });
    }
  },
};

export default shopOrderController;


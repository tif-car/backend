import pool from "../db.js";

const shopOrderController = {
  createOrder: async (req, res) => {
    const { visitor_id, items } = req.body;

    if (!visitor_id || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      
      const [orderResult] = await pool
        .promise()
        .query("INSERT INTO orders (Visitor_ID, Order_Date) VALUES (?, CURDATE())", [visitor_id]);

      const orderId = orderResult.insertId;


      const insertPromises = items.map((item) =>
        pool
          .promise()
          .query(
            "INSERT INTO single_item (merch_ID, order_ID) VALUES (?, ?)",
            [item.merchandise_id, orderId]
          )
      );

      await Promise.all(insertPromises);

      res.status(200).json({ message: "Shop order successfully saved!" });
    } catch (error) {
      console.error("Error saving shop order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default shopOrderController;

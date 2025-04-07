import pool from "../db.js";

const shopOrderController = {
  createOrder: async (req, res) => {
    const { visitor_id, items } = req.body;

    if (!visitor_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    //Group items and count quantities
    const itemCounts = {};
    for (const item of items) {
      if (!item.merchandise_id) continue;
      itemCounts[item.merchandise_id] = (itemCounts[item.merchandise_id] || 0) + 1;
    }

    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();

      //Check inventory for each merch item
      for (const merchID in itemCounts) {
        const quantity = itemCounts[merchID];
        const [rows] = await conn.query(
          `SELECT COUNT(*) AS available FROM single_item WHERE merch_ID = ? AND order_ID IS NULL`,
          [merchID]
        );

        if (rows[0].available < quantity) {
          await conn.rollback();
          return res.status(400).json({
            error: `Not enough stock for merchandise ID ${merchID}`,
          });
        }
      }

      //Create new order
      const [orderResult] = await conn.query(
        `INSERT INTO orders (Visitor_ID, Order_Date) VALUES (?, CURDATE())`,
        [visitor_id]
      );
      const orderId = orderResult.insertId;

      //Assign items to the order
      for (const merchID in itemCounts) {
        const quantity = itemCounts[merchID];
        await conn.query(
          `UPDATE single_item 
           SET order_ID = ?
           WHERE merch_ID = ? AND order_ID IS NULL
           LIMIT ?`,
          [orderId, merchID, quantity]
        );
      }

      await conn.commit();
      res.status(200).json({ message: "Shop order successfully saved!" });
    } catch (error) {
      await conn.rollback();
      console.error("Error saving shop order:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      conn.release();
    }
  },
};

export default shopOrderController;

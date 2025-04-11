import pool from "../db.js";

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const paymentController = {
  processPayment: async (req, res) => {
    const { type, Visitor_ID, items } = req.body;

    if (!type || !Visitor_ID || !Array.isArray(items) || items.length === 0) {
      return sendJSON(res, 400, { error: "Invalid request structure" });
    }

    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(
        `INSERT INTO orders (Visitor_ID, Order_Date, Discount_Applied) VALUES (?, CURDATE(), 0.00)`,
        [Visitor_ID]
      );
      const orderId = orderResult.insertId;

      if (type === "shop") {
        const itemCounts = {};
        for (const item of items) {
          if (!item.Merchandise_ID || !item.quantity) continue;
          itemCounts[item.Merchandise_ID] =
            (itemCounts[item.Merchandise_ID] || 0) + item.quantity;
        }

        for (const merchID in itemCounts) {
          const quantity = itemCounts[merchID];
          const [rows] = await conn.query(
            `SELECT COUNT(*) AS available FROM single_item WHERE merch_ID = ? AND order_ID IS NULL`,
            [merchID]
          );
          if (rows[0].available < quantity) {
            throw new Error(
              `Not enough stock for merchandise ID ${merchID}`
            );
          }
        }

        for (const merchID in itemCounts) {
          const quantity = itemCounts[merchID];
          await conn.query(
            `UPDATE single_item SET order_ID = ? WHERE merch_ID = ? AND order_ID IS NULL LIMIT ?`,
            [orderId, merchID, quantity]
          );
        }

      } else if (type === "ticket") {
        const ticketMap = new Map();
        for (const [personTypeID, attractionID] of items) {
          const key = `${personTypeID}-${attractionID}`;
          ticketMap.set(key, (ticketMap.get(key) || 0) + 1);
        }

        for (const [key, quantity] of ticketMap.entries()) {
          const [personTypeID, attractionID] = key.split("-").map(Number);
          const [priceRow] = await conn.query(
            `SELECT Price_ID FROM ticket_price WHERE ticket_Person = ? AND Attraction_ID = ? LIMIT 1`,
            [personTypeID, attractionID]
          );

          if (priceRow.length === 0) {
            throw new Error(
              `No price found for personTypeID ${personTypeID} and attractionID ${attractionID}`
            );
          }

          const priceID = priceRow[0].Price_ID;
          for (let i = 0; i < quantity; i++) {
            await conn.query(
              `INSERT INTO ticket (Visitor_ID, Bought_Date, Expire_Date, Ticket_Price_ID)
               VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), ?)`,
              [Visitor_ID, priceID]
            );
          }
        }

      } else {
        throw new Error("Unsupported payment type");
      }

      await conn.commit();
      conn.release();
      return sendJSON(res, 200, { message: "Payment processed successfully!" });

    } catch (error) {
      await conn.rollback();
      conn.release();
      return sendJSON(res, 500, { error: error.message || "Internal server error" });
    }
  },
};

export default paymentController;

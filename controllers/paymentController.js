import pool from "../db.js";

const paymentController = {
  processPayment: async (req, res) => {
    const { Visitor_ID, tickets = [], merchandise = [] } = req.body;

    if (!Visitor_ID || (tickets.length === 0 && merchandise.length === 0)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Visitor_ID, tickets, or merchandise missing" }));
      return;
    }

    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();

      // Create a new order
      const [orderResult] = await conn.query(
        "INSERT INTO orders (Visitor_ID, Order_Date, Discount_Applied) VALUES (?, CURDATE(), 0.00)",
        [Visitor_ID]
      );
      const orderID = orderResult.insertId;

      // Handle ticket insertion 
      if (Array.isArray(tickets) && tickets.length > 0) {
        const ticketMap = new Map();
        for (const [personTypeID, attractionID] of tickets) {
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
            throw new Error(`No price found for ticket_Person=${personTypeID} and Attraction_ID=${attractionID}`);
          }

          const priceID = priceRow[0].Price_ID;
          for (let i = 0; i < quantity; i++) {
            await conn.query(
              `INSERT INTO ticket (Visitor_ID, Order_ID, Bought_Date, Expire_Date, Ticket_Price_ID)
               VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), ?)`,
              [Visitor_ID, orderID, priceID]
            );
          }
        }
      }

      // Handle merchandise
      if (Array.isArray(merchandise) && merchandise.length > 0) {
        for (const item of merchandise) {
          const { Merchandise_ID, quantity } = item;

          if (!Merchandise_ID || !quantity || quantity < 1) {
            throw new Error("Invalid merchandise item or quantity.");
          }

          const [stockRows] = await conn.query(
            `SELECT COUNT(*) AS available FROM single_item WHERE merch_ID = ? AND order_ID IS NULL`,
            [Merchandise_ID]
          );

          if (stockRows[0].available < quantity) {
            throw new Error(`Insufficient stock for merchandise ID ${Merchandise_ID}`);
          }

          await conn.query(
            `UPDATE single_item
             SET order_ID = ?
             WHERE merch_ID = ? AND order_ID IS NULL
             LIMIT ?`,
            [orderID, Merchandise_ID, quantity]
          );
        }
      }

      await conn.commit();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Payment processed successfully!" }));
    } catch (error) {
      await conn.rollback();
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message || "Internal server error" }));
    } finally {
      conn.release();
    }
  },
};

export default paymentController;

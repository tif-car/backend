import pool from "../db.js";

const ticketPurchaseController = {
  createTickets: async (req, res) => {
    const { Visitor_ID, tickets } = req.body;

    if (!Visitor_ID || !Array.isArray(tickets) || tickets.length === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid ticket data" }));
      return;
    }

    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();

      //Insert into orders table
      const [orderResult] = await conn.query(
        `INSERT INTO orders (Visitor_ID, Order_Date, Discount_Applied) VALUES (?, CURDATE(), 0.00)`,
        [Visitor_ID]
      );
      const orderID = orderResult.insertId;

      //Count identical tickets
      const ticketMap = new Map(); // key = `${personTypeID}-${attractionID}`

      for (const [personTypeID, attractionID] of tickets) {
        const key = `${personTypeID}-${attractionID}`;
        ticketMap.set(key, (ticketMap.get(key) || 0) + 1);
      }

      //Insert each ticket record based on count
      for (const [key, quantity] of ticketMap.entries()) {
        const [personTypeID, attractionID] = key.split("-").map(Number);

        const [priceRow] = await conn.query(
          `SELECT Price_ID FROM ticket_price WHERE ticket_Person = ? AND Attraction_ID = ? LIMIT 1`,
          [personTypeID, attractionID]
        );

        if (priceRow.length === 0) {
          throw new Error(`No price found for personTypeID ${personTypeID} and attractionID ${attractionID}`);
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

      await conn.commit();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Tickets purchased successfully!" }));
    } catch (error) {
      await conn.rollback();
      console.error(" Error creating tickets:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    } finally {
      conn.release();
    }
  },
};

export default ticketPurchaseController;

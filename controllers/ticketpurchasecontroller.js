import pool from "../db.js";

const ticketPurchaseController = {
  createTickets: async (req, res) => {
    console.log("🎯 Incoming request to /api/tickets/payment");
    console.log("📦 Raw request body:", req.body);

    const { Visitor_ID, tickets } = req.body;

    if (!Visitor_ID || !Array.isArray(tickets) || tickets.length === 0) {
      console.error("❌ Invalid ticket data structure:", { Visitor_ID, tickets });
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid ticket data" }));
      return;
    }

    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();
      console.log("🔄 Transaction started");

      // Insert order
      const [orderResult] = await conn.query(
        `INSERT INTO orders (Visitor_ID, Order_Date, Discount_Applied) VALUES (?, CURDATE(), 0.00)`,
        [Visitor_ID]
      );
      const orderID = orderResult.insertId;
      console.log("🧾 Order created with ID:", orderID);

      // Count tickets by personTypeID-attractionID
      const ticketMap = new Map();
      for (const [personTypeID, attractionID] of tickets) {
        const key = `${personTypeID}-${attractionID}`;
        ticketMap.set(key, (ticketMap.get(key) || 0) + 1);
      }

      // Insert tickets
      for (const [key, quantity] of ticketMap.entries()) {
        const [personTypeID, attractionID] = key.split("-").map(Number);
        console.log(`🎫 Processing ${quantity}x tickets for personTypeID=${personTypeID}, attractionID=${attractionID}`);

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

        console.log(`✅ Inserted ${quantity}x tickets with priceID=${priceID}`);
      }

      await conn.commit();
      console.log("✅ Transaction committed successfully");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Tickets purchased successfully!" }));
    } catch (error) {
      await conn.rollback();
      console.error("🔥 Error creating tickets:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    } finally {
      conn.release();
      console.log("🔚 Connection released");
    }
  },
};

export default ticketPurchaseController;

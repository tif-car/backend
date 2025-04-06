import pool from "../db.js";

const ticketPurchaseController = {
  createTickets: async (req, res) => {
    const { Visitor_ID, tickets } = req.body;

    if (!Visitor_ID || !Array.isArray(tickets)) {
      return res.status(400).json({ error: "Invalid ticket data" });
    }

    try {
      const insertPromises = tickets.map(([personTypeID, attractionID]) =>
        pool
          .promise()
          .query(
            `INSERT INTO ticket (Visitor_ID, Bought_Date, Expire_Date, Ticket_Price_ID)
             VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY),
              (SELECT Price_ID FROM ticket_price WHERE ticket_Person = ? AND Attraction_ID = ? LIMIT 1))`,
            [Visitor_ID, personTypeID, attractionID]
          )
      );

      await Promise.all(insertPromises);

      res.status(200).json({ message: "Tickets purchased successfully!" });
    } catch (error) {
      console.error("Error creating tickets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ticketPurchaseController;

// backend/controllers/ticketInfoController.js
import pool from "../db.js";

const ticketInfoController = {
  getTicketFormInfo: async (req, res) => {
    try {
      const [personTypes] = await pool.promise().query(
        "SELECT PersonType_ID, ticket_person FROM ticket_person"
      );

      const [attractions] = await pool.promise().query(
        "SELECT Attraction_ID, Attraction_Name FROM attraction"
      );

      const [ticketPrices] = await pool.promise().query(
        `SELECT tp.Price_ID, tp.ticket_Person AS PersonType_ID, tp.Attraction_ID, tp.price, 
                p.ticket_person, a.Attraction_Name
         FROM ticket_price tp
         JOIN ticket_person p ON tp.ticket_Person = p.PersonType_ID
         JOIN attraction a ON tp.Attraction_ID = a.Attraction_ID`
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          personTypes,
          attractions,
          ticketPrices, // ✅ include this in response
        })
      );
    } catch (error) {
      console.error("❌ Error fetching ticket form info:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to load ticket form info" }));
    }
  },
};

export default ticketInfoController;


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

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          personTypes,
          attractions,
        })
      );
    } catch (error) {
      console.error("Error fetching ticket form info:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to load ticket form info" }));
    }
  },
};

export default ticketInfoController;

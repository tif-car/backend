// backend/routes/ticketFormRoutes.js
import ticketInfoController from "../controllers/ticketInfoController.js";

const ticketFormRoutes = {
  "/api/tickets/form-info": (req, res) => {
    if (req.method === "GET") {
      ticketInfoController.getTicketFormInfo(req, res);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },
};

export default ticketFormRoutes;

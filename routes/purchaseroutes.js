import shopOrderController from "../controllers/shopordercontroller.js";
import ticketPurchaseController from "../controllers/ticketpurchasecontroller.js";

const purchaseRoutes = {
  "/api/shop/payment": (req, res) => {
    if (req.method === "POST") {
      shopOrderController.createOrder(req, res);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/tickets/payment": (req, res) => {
    if (req.method === "POST") {
      ticketPurchaseController.createTickets(req, res);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },
};

export default purchaseRoutes;

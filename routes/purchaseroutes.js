import shopOrderController from "../controllers/shopordercontroller.js";
import ticketPurchaseController from "../controllers/ticketpurchasecontroller.js";

const purchaseRoutes = {
  "/api/shop/payment": (req, res) => {
    if (req.method === "POST") {
      shopOrderController.createOrder(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },

  "/api/tickets/payment": (req, res) => {
    if (req.method === "POST") {
      ticketPurchaseController.createTickets(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default purchaseRoutes;

import shopOrderController from "../controllers/shopordercontroller.js";
import ticketPurchaseController from "../controllers/ticketpurchasecontroller.js";

const purchaseRoutes = {
  "/api/shop/payment": (req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          req.body = JSON.parse(body); // ✅ attaches parsed body
          shopOrderController.createOrder(req, res);
        } catch (err) {
          console.error("❌ JSON parse error:", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON format" }));
        }
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },

  "/api/tickets/payment": (req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
          ticketPurchaseController.createTickets(req, res);
        } catch (err) {
          console.error("❌ JSON parse error:", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON format" }));
        }
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default purchaseRoutes;



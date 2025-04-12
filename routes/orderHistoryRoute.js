import orderHistoryController from "../controllers/orderHistoryController.js";

const orderHistoryRoute = {
  "/api/order-history": (req, res) => {
    if (req.method === "POST") {
      orderHistoryController.getOrderHistory(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default orderHistoryRoute;

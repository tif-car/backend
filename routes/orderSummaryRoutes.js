import orderSummaryController from "../controllers/orderSummaryController.js";

const orderSummaryRoute = {
  "/api/order-summary": (req, res) => {
    if (req.method === "GET") {
      orderSummaryController.getOrderSummaries(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default orderSummaryRoute;

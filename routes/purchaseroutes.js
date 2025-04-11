import paymentController from "../controllers/paymentController.js";

const purchaseRoutes = {
  "/api/payment": (req, res) => {
    if (req.method === "POST") {
      paymentController.processPayment(req, res);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },
};

export default purchaseRoutes;

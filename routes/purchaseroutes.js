import paymentController from "../controllers/paymentController.js";

const purchaseRoutes = {
  "/api/payment": (req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          req.body = JSON.parse(body); // ✅ parse manually and attach to req
          paymentController.processPayment(req, res);
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        }
      });
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },
};

export default purchaseRoutes;

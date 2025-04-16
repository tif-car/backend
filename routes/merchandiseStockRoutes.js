/*import merchandiseStockController from "../controllers/merchandiseStockController.js";

const merchandiseStockRoutes = {
  "/api/getMerchandiseStock": (req, res) => {
    if (req.method === "GET") {
      merchandiseStockController.getCurrentStock(req, res);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

export default merchandiseStockRoutes;*/


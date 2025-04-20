import merchandiseStockController from "../controllers/merchandiseStockController.js";

const merchandiseStockRoutes = {
  "/api/getMerchandiseStock": (req, res) => {
    if (req.method === "GET") {
      handleRequestBody(req, res, merchandiseStockController.getCurrentStock);
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  },
};

// Helper function to parse request body and call the appropriate controller
function handleRequestBody(req, res, callback) {
  let body = "";
  req.on("data", (chunk) => {
      body += chunk.toString();
  });

  req.on("end", () => {
      try {
          req.body = JSON.parse(body);
      } catch (error) {
          req.body = {};
      }
      callback(req, res);
  });
}

export default merchandiseStockRoutes;


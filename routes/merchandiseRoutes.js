// backend/routes/merchandiseRoutes.js
import merchandiseController from "../controllers/merchandiseController.js";

const merchandiseRoutes = {
  "/api/merchandise": (req, res) => {
    if (req.method === "GET") {
      merchandiseController.getAllMerchandise(req, res);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },
};



export default merchandiseRoutes;

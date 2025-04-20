// backend/routes/merchandiseRoutes.js
import merchandiseController from "../controllers/merchandiseController.js";

const merchandiseRoutes = {
  "/api/merchandise/getDropdowns": (req, res) => {
    if (req.method === "GET") {
      handleRequestBody(req, res, merchandiseController.getDropdowns);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/merchandise/addMerchandise": (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, merchandiseController.createMerchandise);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/merchandise/deleteMerchandise": (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, merchandiseController.deleteMerchandiseRow);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/merchandise/updateMerchandise": (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, merchandiseController.updateMerchandise);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/merchandise/getMerchByID": (req, res) => {
    if (req.method === "POST") {
      handleRequestBody(req, res, merchandiseController.getMerchByID);
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  },

  "/api/merchandise": (req, res) => {
  if (req.method === "GET") {
    merchandiseController.getAllMerchandise(req, res);
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
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

export default merchandiseRoutes;

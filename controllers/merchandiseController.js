// backend/controllers/merchandiseController.js
import pool from "../db.js";

const merchandiseController = {
  getAllMerchandise: async (req, res) => {
    try {
      const [rows] = await pool.promise().query("SELECT * FROM merchandise");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (error) {
      console.error("Error fetching merchandise:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch merchandise" }));
    }
  },

  getDropdowns: async (req,res) => {
    try {
      const [types] = await pool.promise().query("SELECT * FROM item_types");

      const [vendors] = await pool.promise().query("select v.name AS vendor_name, v.Vendor_ID from vendor v;");

      sendResponse(res, 200, {types, vendors});
    } catch (error) {
      console.error("Error fetching merchandise:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch merchandise" }));
    }
  },

  getMerchByID: async (req,res) => {
    const merch_ID = req.body || {};

    if(!merch_ID){
      sendResponse(res, 400, { error: "Missing Merch ID" });
    }

    try {
      const [result] = await pool.promise().query("select * from merchandise where Merchandise_ID = ?;", [merch_ID]);

      if(result.length === 0){
        sendResponse(res, 400, { error: "No Merchandise with that ID" });
      }

      sendResponse(res, 200, result);
    } catch (error) {
      console.error("Error fetching merchandise:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch merchandise" }));
    }
  },

  createMerchandise: async (req, res) => {
    const {Item_Type, V_ID, Item_Price, m_cost, Item_Name} = req.body;

    if(!Item_Type ||!V_ID || !m_cost || !Item_Price || !Item_Name){
      sendResponse(res, 400, { error: "Missing information" });
    }

    const insertSql = `
      insert into merchandise (Item_Type, m_cost, Item_Price, Item_Name, V_ID )
        VALUES (?, ?, ?, ?, ?);
      `;

    const [insertResult] = await pool.promise().query(insertSql, [Item_Type, m_cost, Item_Price, Item_Name, V_ID]);
  
      sendResponse(res, 200, { message: "Merchandise added." });
  },

  deleteMerchandiseRow: async (req, res) => {
    const { Merch_ID } = req.body || {};

    if (!Merch_ID) {
      return sendResponse(res, 400, { error: "Merch_ID is required" });
    }

    try {
      // First check if there are items in stock
      const [checkResult] = await pool.promise().query(
        `SELECT Item_ID FROM single_item WHERE merch_ID = ? AND order_ID IS NULL`,
        [Merch_ID]
      );

      if (checkResult.length > 0) {
        return sendResponse(res, 401, { 
          error: "Cannot remove from database if still in stock" 
        });
      }

      // If no items in stock, proceed with deletion
      const [deleteResult] = await pool.promise().query(
        `DELETE FROM merchandise WHERE Merchandise_ID = ?`,
        [Merch_ID]
      );

      if (deleteResult.affectedRows === 0) {
        return sendResponse(res, 404, { 
          error: "No record found with the given Merch_ID" 
        });
      }

      return sendResponse(res, 200, { 
        message: "Merchandise deleted successfully" 
      });

    } catch (err) {
      console.error("Database error:", err);
      return sendResponse(res, 500, { 
        error: "Database error" 
      });
    }
},
  
  updateMerchandise: async (req, res) => {
    const { Merchandise_ID, Item_Type, V_ID, Item_Price, m_cost, Item_Name } = req.body;
  
    if (!Merchandise_ID || !Item_Type || !V_ID || !Item_Price || !m_cost || !Item_Name) {
      return sendResponse(res, 400, { error: "Missing required fields" });
    }
  
    try {
      const updateSql = `
        UPDATE merchandise 
        SET Item_Type = ?, 
            V_ID = ?, 
            Item_Price = ?, 
            m_cost = ?, 
            Item_Name = ?
        WHERE Merchandise_ID = ?
      `;
  
      await pool.promise().query(updateSql, [
        Item_Type,
        V_ID,
        Item_Price,
        m_cost,
        Item_Name,
        Merchandise_ID
      ]);
  
      sendResponse(res, 200, { message: "Merchandise updated successfully" });
    } catch (error) {
      console.error("Error updating merchandise:", error);
      sendResponse(res, 500, { error: "Failed to update merchandise" });
    }
  },
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export default merchandiseController;


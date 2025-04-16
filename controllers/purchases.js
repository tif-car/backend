import pool from "../db.js";                   // Use pool for database queries


const BulkPurchaseController ={
// Update the amount_of_items in bulk_purchase table
    updateBulkPurchase: async (req, res) => {
        /*
            Function: updateBulkPurchase
            Input from frontend:
            {
                "amount_of_items": 10,
                "merch_ID": 101
            }
            Effect: Updates the bulk_purchase row with merch_ID = 101, setting amount_of_items to 10.
                    A trigger will handle inserting new rows into single_item table.
        */

        const { amount_of_items, merch_ID } = req.body || {};

        if (!amount_of_items || !merch_ID) {
            return sendResponse(res, 400, { error: "amount_of_items and merch_ID are required" });
        }

        //query used
        const sql = `
            UPDATE bulk_purchase
            SET amount_of_items = ?
            WHERE merch_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, [amount_of_items, merch_ID]);

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "No record found with the given merch_ID" });
            }

            sendResponse(res, 200, { message: "bulk_purchase updated successfully" });
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    addBulkPurchase: async (req, res) => {
        /*
            Function: addBulkPurchase
            Input from frontend:
            {
                "amount_of_items": 10,
                "merch_ID": 101
                producer: "General production"
                date purchased: mm-dd-yyyy
                bulk cost: xx.xx
            }
            Effect: Updates the bulk_purchase row with merch_ID = 101, setting amount_of_items to 10.
                    A trigger will handle inserting new rows into single_item table.
        */
        console.log("recived", req.body);
        const { Amount_of_items, Merchandise_ID, Producer, Date_purchased, Bulk_cost } = req.body || {};

        if (!Amount_of_items || !Merchandise_ID || !Producer || !Date_purchased || !Bulk_cost) {
            return sendResponse(res, 400, { error: "missing part" });
        }
        //query used
        const sql = `INSERT INTO zoo.bulk_purchase (merch_id, Bulk_cost, amount_of_items, producer, date_purchased) VALUES (?, ?, ?, ?, ?)`;

        try {
            const [result] = await pool.promise().query(sql, [Merchandise_ID, Bulk_cost, Amount_of_items, Producer, Date_purchased]);

            sendResponse(res, 200, { message: "bulk_purchase added successfully" });
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    getBulkPurchaseFormInfo: async (req, res) => {

        const merchSql = `select Merchandise_ID, Item_Name, Item_Type from merchandise;`;
        const iTypesSql = `select item_typeID, item_types from item_types;`;

        try {
            const [merchResult] = await pool.promise().query(merchSql);
            const [iTypeResult] = await pool.promise().query(iTypesSql);

            const combinedResults = {
                merchandise: merchResult,
                item_types: iTypeResult
            };

            sendResponse(res, 200, combinedResults);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },

    //Function to see the bulk_purchase_view 
    //Returns the purchases from newest to oldest
    BulkPurchaseView: async (req, res) => {
    
        const sql = `SELECT * FROM BULK_PURCHASE_VIEW 
                     ORDER BY date_purchased DESC`;
    
        try {
            const [results] = await pool.promise().query(sql);
            sendResponse(res, 200, { data: results });
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },
    
};


// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default BulkPurchaseController;

import pool from "../db.js"; // Use pool for database queries

// Update the amount_of_items in bulk_purchase table
const updateBulkPurchase = async (req, res) => {
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
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { updateBulkPurchase };

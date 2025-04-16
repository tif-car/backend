import pool from "../db.js";

const managerController = {

        getManagerView: async (req, res) => {
            const { Manager_ID } = req.body || {};
        
            if (!Manager_ID) {
                return sendResponse(res, 400, { error: "Manager ID is required" });
            }
        
            const sql = `SELECT * FROM MANAGER_VIEW 
                         WHERE Manager_ID = ? `;
        
            pool.query(sql, [Manager_ID], (err, result) => {
                if (err) {
                    console.error("Database query error:", err);
                    return sendResponse(res, 500, { error: "Database error" });
                }
        
                if (result.length === 0) {
                    return sendResponse(res, 404, { error: "No records found for this manager" });
                }
        
                sendResponse(res, 200, { managerData: result });
            });
        }

};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default managerController;
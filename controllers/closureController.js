import pool from "../db.js"; // Use pool for database queries

const ClosureTasks = async (req, res) => {



};


// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default ClosureTasks;
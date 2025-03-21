import db from "../db.js";

const handleGetRole = (req, res, query) => {
    const { email } = query;

    if (!email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email is required." }));
        return;
    }

    // SQL query to fetch the user role based on the provided email
    const sql = `
       SELECT r.role_types
       FROM employee e
       JOIN role_type r ON e.Role = r.role_typeID
       WHERE e.email = ?;
    `;

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
            return;
        }

        if (result.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "User not found" }));
            return;
        }

        // Role found, return it
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            //message: "User role retrieved successfully",
            role_type: result[0].role_types
        }));
    });
};

export default { handleGetRole };

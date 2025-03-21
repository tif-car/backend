const { dbConnection } = require("../db.js");

const getRole = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const email = JSON.parse(body);
        
        dbConnection.query(
            "SELECT r.role_types FROM employee e JOIN role r ON e.Role = r.role_typeID WHERE e.email = ?",
            [email],
            (err, result) => {
                if(err) {
                    console.log(err);
					res.writeHead(500, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "Internal Server Error" }));
					return;
                }

                if (result.length === 0) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "Invalid login credentials" }));
					return;
				}

                const role = result[0];

                res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ role: role }));
            }
        )
    })
}

module.exports = {getRole};
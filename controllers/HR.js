import pool from "../db.js"; // Use pool instead of dbConnection

// Edit an existing employee
const editEmployee = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        const { Employee_ID, Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password } = JSON.parse(body);

        // Employee_ID needs to be provided
        if (!Employee_ID) {
            return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
        }

        // Update the table employee
        const sql = `UPDATE employee 
                     SET Name = ?, Role = ?, Salary = ?, Work_Location_ID = ?, Phone_number = ?, Email = ?, Password = ?
                     WHERE Employee_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, [Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password, Employee_ID]);

            // If no rows are affected, that means the employee wasn't found
            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "Employee not found." });
            }

            sendResponse(res, 200, { message: "Employee updated successfully." });
        } catch (err) {
            console.error("Database update error:", err);
            sendResponse(res, 500, { error: "Database error while updating employee." });
        }
    });
};

// Create a new employee
const createEmployee = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        const { Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password } = JSON.parse(body);

        // This is to make sure all required fields are provided
        if (!Name || !Role || !Salary || !Work_Location_ID || !Phone_number || !Email || !Password) {
            return sendResponse(res, 400, { error: "All fields are required to create a new employee." });
        }

        // Add new information into the employee table
        const sql = `INSERT INTO employee (Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await pool.promise().query(sql, [Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password]);

            sendResponse(res, 201, { message: "Employee created successfully.", Employee_ID: result.insertId });
        } catch (err) {
            console.error("Database insertion error:", err);
            sendResponse(res, 500, { error: "Database error while adding employee." });
        }
    });
};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { editEmployee, createEmployee };

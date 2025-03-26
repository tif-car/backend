import pool from "../db.js"; // Use pool instead of dbConnection

/*
editEmployee:
Frontend send:
{ "Salary": 60000 }
 Query becomes: UPDATE employee SET Salary = 60000 WHERE Employee_ID = 5;

*/
const editEmployee = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        const data = JSON.parse(body);
        const { Employee_ID } = data;

        // Ensure Employee_ID is provided
        if (!Employee_ID) {
            return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
        }

        // Remove Employee_ID from the data object (since we don’t update it)
        delete data.Employee_ID;

        // If no other fields are provided, return an error
        if (Object.keys(data).length === 0) {
            return sendResponse(res, 400, { error: "No fields provided for update." });
        }

        // Dynamically build the SET clause of the SQL query
        const setClause = Object.keys(data).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(data);

        // Final SQL query
        const sql = `UPDATE employee SET ${setClause} WHERE Employee_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, [...values, Employee_ID]);

            // If no rows were affected, employee not found
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


//Edit an existing employee, this expects all fields to be present
const editAllEmployeeRow = (req, res) => {
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
        //JSON data is converted into a JavaScript object using JSON.parse(body)
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

export default { editAllEmployeeRow, createEmployee, editEmployee };

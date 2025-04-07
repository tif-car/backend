import pool from "../db.js"; // Use pool instead of dbConnection

const editEmployee = async (req, res) => {
    const { Employee_ID, Salary, Name, Role, Work_Location_ID, Phone_number, Email, Password } = req.body;

    // Ensure Employee_ID is provided
    if (!Employee_ID) {
        return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
    }

    // Dynamically build the SET clause of the SQL query based on provided fields
    let setClause = [];
    let values = [];

    // Add fields to setClause if they are provided
    if (Salary) {
        setClause.push("Salary = ?");
        values.push(Salary);
    }
    if (Name) {
        setClause.push("Name = ?");
        values.push(Name);
    }
    if (Role) {
        setClause.push("Role = ?");
        values.push(Role);
    }
    if (Work_Location_ID) {
        setClause.push("Work_Location_ID = ?");
        values.push(Work_Location_ID);
    }
    if (Phone_number) {
        setClause.push("Phone_number = ?");
        values.push(Phone_number);
    }
    if (Email) {
        setClause.push("Email = ?");
        values.push(Email);
    }
    if (Password) {
        setClause.push("Password = ?");
        values.push(Password);
    }

    // If no fields are provided to update, return an error
    if (setClause.length === 0) {
        return sendResponse(res, 400, { error: "No fields provided for update." });
    }

    // Final SQL query
    const sql = `UPDATE employee SET ${setClause.join(", ")} WHERE Employee_ID = ?`;

    // Add Employee_ID to the values array for the WHERE condition
    values.push(Employee_ID);

    try {
        const [result] = await pool.promise().query(sql, values);

        // If no rows were affected, employee not found
        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Employee not found." });
        }

        sendResponse(res, 200, { message: "Employee updated successfully." });
    } catch (err) {
        console.error("Database update error:", err);
        sendResponse(res, 500, { error: "Database error while updating employee." });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    const { Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password } = req.body;

    // Ensure all required fields are provided
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
};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { createEmployee, editEmployee };

import pool from "../db.js"; // Use pool instead of dbConnection


const editEmployee = (req, res) => {
/*
Function: editEmployee
Frontend send: { "Salary": 60000 }
Query becomes: UPDATE employee SET Salary = 60000 WHERE Employee_ID = 5;

*/
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

/*
********work in progress
const getEmployeeInfo = (req, res) => {
    let body = "";
    
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        try {
            const { employee_ID, employee_name, department_name } = JSON.parse(body);

            // Base query to fetch employee details and department
            let query = `
                SELECT e.Employee_ID, e.Name AS employee_name, e.Role, r.role_types, 
                       e.Salary, e.Work_Location_ID, e.Phone_number, e.Email, d.Name AS department_name
                FROM employee e
                JOIN role_type r ON e.Role = r.role_typeID
                JOIN works_at w ON e.Employee_ID = w.E_ID
                JOIN department d ON w.Dept_ID = d.Department_ID
            `;

            let conditions = [];
            let values = [];

            if (employee_ID) {
                conditions.push("e.Employee_ID = ?");
                values.push(employee_ID);
            }
            if (employee_name) {
                conditions.push("e.Name LIKE ?");
                values.push(`%${employee_name}%`);
            }
            if (department_name) {
                conditions.push("d.Name LIKE ?");
                values.push(`%${department_name}%`);
            }

            // Add WHERE clause if filters exist
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [result] = await pool.promise().query(query, values);

            // If no employee is found
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "No employees found." });
            }

            sendResponse(res, 200, { employees: result });

        } catch (error) {
            console.error("Database query error:", error);
            return sendResponse(res, 500, { error: "Internal Server Error" });
        }
    });
};
*/

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { createEmployee, editEmployee };

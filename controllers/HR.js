import pool from "../db.js"; // Use pool instead of dbConnection


const HRController = {
    getEmployeeInfo: async (req,res) => {
        const {employeeId} = req.body || {};

        // Ensure Employee_ID is provided
        if (!employeeId) {
            return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
        }

        const sql = "select * from employee where Employee_ID = ?;";

        try {
            const [rows] = await pool.promise().query(sql, [employeeId]);
    
            if (rows.length === 0) {
                return sendResponse(res, 404, { message: 'Employee not found' });
            }
            
            // Extract the first row as an object
            const employeeInfo = rows[0];
            
            // Send as plain object
            sendResponse(res, 200, employeeInfo);

        } catch {
            console.error("Database retreval error:", err);
            sendResponse(res, 500, { error: "Database error while retreving roles." });
        }

    },

    getSCEmployeeInfo: async (req,res) => {


        const sql = `
            Select Employee_ID, first_Name as first_name, last_Name as last_name, role_types AS Role
            from employee
            join zoo.role_type rt on employee.Role = rt.role_typeID
            where role_typeID in ('4', '5', '7');
        `;

        try {
            const [employees] = await pool.promise().query(sql);
    
            if (employees.length === 0) {
                return sendResponse(res, 404, { message: 'Employees not found' });
            }
            
            // Send as plain object
            sendResponse(res, 200, {employees});

        } catch {
            console.error("Database retreval error:", err);
            sendResponse(res, 500, { error: "Database error while retreving roles." });
        }

    },

    editEmployee: async (req, res) => {


    const {Employee_ID, first_Name, last_Name, Role, Salary, Phone_number, Email, Password } = req.body;

    // Ensure Employee_ID is provided
    if (!Employee_ID) {
        return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
    }

    // Dynamically build the SET clause of the SQL query based on provided fields
    let setClause = [];
    let values = [];

    // Add fields to setClause if they are provided
    if (first_Name) {
        setClause.push("first_Name = ?");
        values.push(first_Name);
    }
    if (last_Name) {
        setClause.push("last_Name = ?");
        values.push(last_Name);
    }
    if (Role) {
        setClause.push("Role = ?");
        values.push(Role);
    }
    if (Salary) {
        setClause.push("Salary = ?");
        values.push(Salary);
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
},

// Create a new employee
     createEmployee: async (req, res) => {
    const {first_Name, last_Name, Role, Salary, Phone_number, Email, Password} = req.body;

    // Ensure all required fields are provided
    if (!first_Name || !last_Name || !Role || !Salary || !Phone_number || !Email || !Password) {
        return sendResponse(res, 400, { error: "All fields are required to create a new employee." });
    }

    // Add new information into the employee table
    const sql = `INSERT INTO employee (first_Name, last_Name, Role, Salary, Phone_number, Email, Password) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await pool.promise().query(sql, [first_Name, last_Name, Role, Salary, Phone_number, Email, Password]);

        sendResponse(res, 201, { message: "Employee created successfully.", Employee_ID: result.insertId });
    } catch (err) {
        console.error("Database insertion error:", err);
        sendResponse(res, 500, { error: "Database error while adding employee." });
    }
},

    getRoles: async (req, res) => {
        const sql = "select * from role_type;";

        try {
            const [roles] = await pool.promise().query(sql);

            sendResponse(res, 200, {roles});

        } catch {
            console.error("Database retreval error:", err);
            sendResponse(res, 500, { error: "Database error while retreving roles." });
        }
    },
/*
function to update the works_at table
Frontend will need to send Employee_ID, Dept_ID, Location_ID
Example of what frontend would send:
{
  "Employee_ID": 3,
  "Dept_ID": 1,
  "Location_ID": 401,
}  */
  updateWorksAt: async (req, res) => {
    const { Employee_ID, Dept_ID, Location_ID } = req.body || {};

    if (!Employee_ID || !Dept_ID || !Location_ID) {
        return sendResponse(res, 400, { error: "Employee ID, Dept_ID, and Location_ID are required" });
    }

    const sql = `
        UPDATE works_at 
        SET Dept_ID = ?, 
            Location_ID = ?
        WHERE Employee_ID = ?`;

    const values = [Dept_ID, Location_ID, Employee_ID];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Employee work assignment not found" });
        }

        sendResponse(res, 200, { message: "Work assignment updated successfully" });
    });
},


/*
Function to insert a row into the works_at table for new employees.
Frontend will need to send Employee_ID, Dept_ID, Habitat_ID. Optional: Attraction_ID or Vend_ID, can also choose neither
Example of what frontend would send:
{
  "Employee_ID": 18,
  "Dept_ID": 3,
  "Habitat_ID": 206,
  "Attraction_ID": 9
}   */

  createWorksAt: async (req, res) => {
    const { Employee_ID, Dept_ID, Location_ID } = req.body || {};

    if (!Employee_ID || !Dept_ID || !Location_ID) {
        return sendResponse(res, 400, { error: "Employee_ID, Dept_ID, and Location_ID are required" });
    }

    const sql = `
        INSERT INTO works_at (Employee_ID, Dept_ID, Location_ID)
        VALUES (?, ?, ?)
    `;

    const values = [Employee_ID, Dept_ID, Location_ID];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        sendResponse(res, 201, { 
            message: "Work assignment created successfully", 
            Works_At_ID: result.insertId 
        });
    });
}

};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default HRController;

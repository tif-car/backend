import dbConnection from "../db.js";

// Edit an existing employee
const editEmployee = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

       //will parse the JSON body sent by frontend
    req.on("end", () => {
        const { Employee_ID, Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password } = JSON.parse(body);

        //Employee_ID needs to be provided
        if (!Employee_ID) {
            return sendResponse(res, 400, { error: "Employee_ID is required for updating an employee." });
        }

        //update the table employee
        const sql = `UPDATE employee 
                     SET Name = ?, Role = ?, Salary = ?, Work_Location_ID = ?, Phone_number = ?, Email = ?, Password = ?
                     WHERE Employee_ID = ?`;

        //will execute query with the new values
        dbConnection.query(sql, [Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password, Employee_ID], (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                return sendResponse(res, 500, { error: "Database error while updating employee." });
            }

            sendResponse(res, 200, { message: "Employee updated successfully." });
        });
    });
};

// Create a new employee
const createEmployee = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    //will parse the JSON body sent by frontend
    req.on("end", () => {
        const { Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password } = JSON.parse(body);

        //This is to make sure all required fields are provided
        if (!Name || !Role || !Salary || !Work_Location_ID || !Phone_number || !Email || !Password) {
            return sendResponse(res, 400, { error: "All fields are required to create a new employee." });
        }
        
        //add new information into the employee table
        const sql = `INSERT INTO employee (Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        //Execute the query with provided values
        dbConnection.query(sql, [Name, Role, Salary, Work_Location_ID, Phone_number, Email, Password], (err, result) => {
            if (err) {
                console.error("Database insertion error:", err);
                return sendResponse(res, 500, { error: "Database error while adding employee." });
            }

            sendResponse(res, 201, { message: "Employee created successfully.", Employee_ID: result.insertId });
        });
    });
};

// Helper function for sending responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default { editEmployee, createEmployee };

import pool from "../db.js";  // Assuming pool is the connection pool object.


const animalHealthController = {

// Function to update the wellness status of an animal.
// Frontend would need to include the animal_ID and wellness_status. Maybe from a dropdown box?
    updateAnimalWellness: async (req, res) => {

/*
 Function: updateAnimalWellness
Ex: Frontend provides:
{
    "animal_ID": 3,
    "wellness_status": "Healthy"
}
Output:
 { "message": "Wellness status updated successfully" }
*/
    const { animal_ID, wellness_status } = req.body || {};

    if (!animal_ID || !wellness_status) {
        return sendResponse(res, 400, { error: "Animal ID and Wellness Status are required" });
    }

    const sql = `UPDATE animal SET Wellness_status = ? WHERE animal_ID = ?`;
    
    pool.query(sql, [wellness_status, animal_ID], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return sendResponse(res, 500, { error: "Database error occurred while updating wellness status." });
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Animal not found or no changes made." });
        }

        sendResponse(res, 200, { message: "Wellness status updated successfully" });
    });
},

// Function to create a new medical record for an animal.
// Frontend must provide: Animal_ID, Employee_ID, Checkup_Date, Diagnosis, and Treatment.
     createMedicalRecord: async (req, res) => {
    /*
        Function: createMedicalRecord
        Ex: Frontend provides:
        {
            "Animal_ID": 10,
            "Employee_ID": 2,
            "Checkup_Date": "2025-03-25",
            "Diagnosis": "Mild fever",
            "Treatment": "Medication prescribed"
        }
        Output:
        { "message": "Medical record created successfully", "Record_ID": 45 }
    */
    const { Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment } = req.body || {};

    if (!Animal_ID || !Employee_ID || !Checkup_Date || !Diagnosis || !Treatment) {
        return sendResponse(res, 400, { error: "All fields are required to create a medical record." });
    }

    const insertQuery = `
        INSERT INTO medical_record (Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment)
        VALUES (?, ?, ?, ?, ?)`;

    pool.query(insertQuery, [Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return sendResponse(res, 500, { error: "Database error occurred while creating medical record." });
        }

        sendResponse(res, 201, { message: "Medical record created successfully.", Record_ID: result.insertId });
    });
},


//Functoin to edit medical record row
//Only updates the fields provided by the frontend
    editMedicalRecord: async (req, res) => {
    /*
        Function: editMedicalRecord
        Ex: Frontend provides:
        {
            "Record_ID": 12,
            "Diagnosis": "Updated diagnosis",
            "Treatment": "Updated treatment"
        }
        Output:
        { "message": "Medical record updated successfully" }
    */
    let body = "";
    //reading input from the frontend
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        const data = JSON.parse(body);
        const { Record_ID } = data;

        //Record_ID is required
        if (!Record_ID) {
            return sendResponse(res, 400, { error: "Record_ID is required for updating a medical record." });
        }

        // Remove Record_ID from the update fields
        delete data.Record_ID;

        // If no other fields are provided, return an error
        if (Object.keys(data).length === 0) {
            return sendResponse(res, 400, { error: "No fields provided for update." });
        }

        // Dynamically build the SET clause for SQL query
        const setClause = Object.keys(data).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(data);

        // Final SQL query
        const sql = `UPDATE medical_record SET ${setClause} WHERE Record_ID = ?`;

        try {
            const [result] = await pool.promise().query(sql, [...values, Record_ID]);

            // If no rows were affected, record not found
            if (result.affectedRows === 0) {
                return sendResponse(res, 404, { error: "Medical record not found." });
            }

            sendResponse(res, 200, { message: "Medical record updated successfully." });
        } catch (err) {
            console.error("Database update error:", err);
            sendResponse(res, 500, { error: "Database error while updating medical record." });
        }
    });
},

/*
Function: EditMedicalRecords
Ex: frontend provides:
{
    "Record_ID": 12,
    "Diagnosis": "Minor infection",
    "Treatment": "Antibiotics prescribed"
}

Query: 
UPDATE medical_record 
SET Diagnosis = ?, Treatment = ?
WHERE Record_ID = ?;

output:
["Minor infection", "Antibiotics prescribed", 12]
 */


// Function to update an existing medical record.
// Frontend must provide a valid Record_ID along with updated fields: Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment.
    editAllMedicalRow: async (req, res) => {
    const { Record_ID, Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment } = req.body || {};

    if (!Record_ID || !Animal_ID || !Employee_ID || !Checkup_Date || !Diagnosis || !Treatment) {
        return sendResponse(res, 400, { error: "All fields including Record_ID are required to update a medical record." });
    }

    const updateQuery = `
        UPDATE medical_record
        SET Animal_ID = ?, Employee_ID = ?, Checkup_Date = ?, Diagnosis = ?, Treatment = ?
        WHERE Record_ID = ?`;

    pool.query(updateQuery, [Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment, Record_ID], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return sendResponse(res, 500, { error: "Database error occurred while updating medical record." });
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Medical record not found." });
        }

        sendResponse(res, 200, { message: "Medical record updated successfully." });
    });
}

/*
Function: editAllMedicalRow
Example input from the frontend:
{
    "Record_ID": 12,
    "Animal_ID": 101,
    "Employee_ID": 5,
    "Checkup_Date": "2025-03-20",
    "Diagnosis": "Minor infection",
    "Treatment": "Antibiotics prescribed"
}

Query: 
UPDATE medical_record 
SET Animal_ID = ?, Employee_ID = ?, Checkup_Date = ?, Diagnosis = ?, Treatment = ?
WHERE Record_ID = ?;

Expected output:
[
    101, 
    5, 
    "2025-03-20", 
    "Minor infection", 
    "Antibiotics prescribed", 
    12
]
 */
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { animalHealthController };

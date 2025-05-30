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

getMedicalDetails: async (req, res) => {
    const {Record_ID} = req.body || {};

    if (!Record_ID) {
        return sendResponse(res, 400, { error: "Record ID is required" });
    }

    const sql = `
            select 
                m.Checkup_Date, 
                m.Checkup_Date, 
                m.Diagnosis, 
                m.Treatment, 
                m.Animal_ID, 
                a.Animal_Name
            from medical_record m
            join zoo.animal a on m.Animal_ID = a.Animal_ID
            where m.Record_ID = ?;
        `;

        try {
            const [result] = await pool.promise().query(sql, [Record_ID]);

            const row = result[0];
            if (result.length === 0) {
                return sendResponse(res, 404, { error: "No feeding details found for the given ID" });
            }
            sendResponse(res, 200, row);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

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
    /*editMedicalRecord: async (req, res) => {
    
        Function: editMedicalRecord
        Ex: Frontend provides:
        {
            "Record_ID": 12,
            "Diagnosis": "Updated diagnosis",
            "Treatment": "Updated treatment"
        }
        Output:
        { "message": "Medical record updated successfully" }
    
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
},*/

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
},

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

medicalView: async (req, res) => {
    /*
        Function: medicalView
        Input from frontend:
        {
            "Employee_ID": 2
        }

        This will query the MEDICAL_VIEW for medical records accessible by this employee.
    */

    const { Employee_ID } = req.body || {};

    if (!Employee_ID) {
        return sendResponse(res, 400, { error: "Employee_ID is required." });
    }

    const sql = `
        SELECT 
            Record_ID, 
            Animal_ID, 
            Animal_Name, 
            Species, 
            Checkup_Date, 
            Diagnosis, 
            Treatment 
        FROM MEDICAL_VIEW
        WHERE Employee_ID = ?`;

    try {
        const [rows] = await pool.promise().query(sql, [Employee_ID]);

        if (rows.length === 0) {
            return sendResponse(res, 404, { message: "No medical records found for this employee." });
        }

        sendResponse(res, 200, rows);
    } catch (err) {
        console.error("Database query error:", err);
        sendResponse(res, 500, { error: "Database error occurred while retrieving medical records." });
    }
},

deleteMedicalRecord: async (req, res) => {
    const {Record_ID} = req.body;

    if (!Record_ID) {
        return sendResponse(res, 400, { error: "Record_ID is required" });
    }

    const sql = `
        DELETE FROM medical_record
        WHERE Record_ID = ?`;

    try {
        const [result] = await pool.promise().query(sql, Record_ID);
    
        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "No record found with the given Record_ID" });
        }
    
        sendResponse(res, 200, { message: "Medical Record Deleted successfully" });
        } catch (err) {
        console.error("Error while updating medical record:", err);
        sendResponse(res, 500, { error: "Internal server error" });
    }

}




};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default animalHealthController;

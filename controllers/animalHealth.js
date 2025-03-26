import pool from "../db.js";  // Assuming pool is the connection pool object.

/*
Endpoints:
- `POST /api/updateAnimalWellness`: Updates the wellness status of an animal based on `animal_ID` and `wellness_status`.
- `POST /api/createMedicalRecord`: Creates a new medical record entry based on `Animal_ID`, `Employee_ID`, `Checkup_Date`, `Diagnosis`, and `Treatment`.
- `POST /api/editMedicalRecord`: Updates an existing medical record based on `Record_ID` and other relevant details.
*/

// Function to update the wellness status of an animal.
// Frontend would need to include the animal_ID and wellness_status. Maybe from a dropdown box?
const updateAnimalWellness = (req, res) => {
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
};

// Function to create a new medical record for an animal.
// Frontend must provide: Animal_ID, Employee_ID, Checkup_Date, Diagnosis, and Treatment.
const createMedicalRecord = (req, res) => {
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
};

// Function to update an existing medical record.
// Frontend must provide a valid Record_ID along with updated fields: Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment.
const editMedicalRecord = (req, res) => {
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
};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export default { updateAnimalWellness, createMedicalRecord, editMedicalRecord };

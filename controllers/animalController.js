import pool from "../db.js"; // Using the connection pool for query handling

const animalCareController = {

// Get all animals
    getAllAnimals: async (req, res) => {
    const sql = `SELECT * FROM animal`;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        sendResponse(res, 200, { animals: result });
    });
},

// Get a single animal by ID
    getAnimalById: async (req, res) => {
    const { Animal_ID } = req.body || {};

    if (!Animal_ID) {
        return sendResponse(res, 400, { error: "Animal ID is required" });
    }

    const sql = `SELECT * FROM animal WHERE Animal_ID = ?`;

    pool.query(sql, [Animal_ID], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.length === 0) {
            return sendResponse(res, 404, { error: "Animal not found" });
        }

        sendResponse(res, 200, { animal: result[0] });
    });
},

// Create a new animal
    createAnimal: async (req, res) => {
    const { Animal_Name, Species_ID, Habitat_ID, Birth_Date, Wellness_Status } = req.body || {};

    if (!Animal_Name || !Species_ID || !Habitat_ID) {
        return sendResponse(res, 400, { error: "Animal name, species ID, and habitat ID are required" });
    }

    const sql = `INSERT INTO animal (Animal_Name, Species_ID, Habitat_ID, Birth_Date, Wellness_Status) 
                 VALUES (?, ?, ?, ?, ?)`;

    pool.query(sql, [Animal_Name, Species_ID, Habitat_ID, Birth_Date, Wellness_Status], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        sendResponse(res, 201, { 
            message: "Animal created successfully",
            Animal_ID: result.insertId
        });
    });
},

// Update an animal's information
    updateAnimal: async (req, res) => {
    const { 
        Animal_ID, 
        Animal_Name, 
        Species_ID, 
        Habitat_ID, 
        Birth_Date, 
        Wellness_Status 
    } = req.body || {};

    if (!Animal_ID) {
        return sendResponse(res, 400, { error: "Animal ID is required" });
    }

    // Build the update query dynamically based on provided fields
    let updateFields = [];
    let updateValues = [];

    if (Animal_Name) {
        updateFields.push("Animal_Name = ?");
        updateValues.push(Animal_Name);
    }
    if (Species_ID) {
        updateFields.push("Species_ID = ?");
        updateValues.push(Species_ID);
    }
    if (Habitat_ID) {
        updateFields.push("Habitat_ID = ?");
        updateValues.push(Habitat_ID);
    }
    if (Birth_Date) {
        updateFields.push("Birth_Date = ?");
        updateValues.push(Birth_Date);
    }
    if (Wellness_Status) {
        updateFields.push("Wellness_Status = ?");
        updateValues.push(Wellness_Status);
    }

    if (updateFields.length === 0) {
        return sendResponse(res, 400, { error: "No fields to update" });
    }

    // Add Animal_ID to the values array
    updateValues.push(Animal_ID);

    const sql = `UPDATE animal SET ${updateFields.join(", ")} WHERE Animal_ID = ?`;

    pool.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, { error: "Animal not found" });
        }

        sendResponse(res, 200, { message: "Animal updated successfully" });
    });
}

};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default {animalCareController};

 
import pool from "../db.js";

const MaintenanceController = {
  getMaintenanceRequestFormInfo: async (req, res) => {
    try {
      const [vendors] = await pool.promise().query(`
        select v.name as vendor_name, ml.Maintenance_Location
        from vendor v
        join maintenance_location ml on ml.Location_ID = v.Vendor_ID;
      `);
      const [attractions] = await pool.promise().query(`
        select a.Attraction_Name, ml.Maintenance_Location
        from attraction a
        join maintenance_location ml on ml.Location_ID = a.Attraction_ID;
      `);
      const [habitats] = await pool.promise().query(`
        select h.Habitat_Name, ml.Maintenance_Location
        from habitat h
        join maintenance_location ml on ml.Location_ID = h.Habitat_ID;
      `);

      sendResponse(res, 200, {
        vendors,
        attractions,
        habitats,
      });
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  getMaintenanceEditFormInfo: async (req, res) => {
    try {
      const [employees] = await pool.promise().query(`
        select e.Employee_ID, e.first_Name, e.last_Name
        from employee e
        where Role = '2';
      `);
      const [statuses] = await pool.promise().query(`select * from mntstatus_type;`);

      sendResponse(res, 200, {
        employees,
        statuses,
      });
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  getMaintenanceInfo: async (req, res) => {
    try {
      const {requestId} = req.body;
      if(!requestId){
        return sendResponse(res, 400, { error: "Maintenance_ID is required" });
      }
      const [requests] = await pool.promise().query(`
        select Maintenance_ID, Maintenance_EmployeeID, Start_Date, End_Date, Description, Status, cost, RecentCheck, request_desc ,Location_ID, Location_type
        from maintenance
        join maintenance_location on maintenance_locationID = Maintenance_Location
        where Maintenance_ID = ?;
        `, [requestId]);

        if (requests.length === 0) {
          return sendResponse(res, 404, { error: "Maintenance request not found" });
        }
  
        const request = requests[0];
        
        // Get location name
        const locationName = await getLocationName(request.Location_ID, request.Location_type);
        
        // Add location name to the request object
        const responseData = {
          ...request,
          Location_Name: locationName
        };
  
        sendResponse(res, 200, {request: responseData});
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  addMaintenanceRequest: async (req, res) => {
    try {
      const {start_date ,Location_ID, request_desc} = req.body;

      const sql = `
        INSERT INTO zoo.maintenance  (Maintenance_EmployeeID, cost, Status, Start_Date, maintenance_locationID, request_desc) 
        VALUES (2, 0, 6, ?, ?, ?)`;

      const result = await pool.promise().query(sql,[start_date, Location_ID, request_desc])
      sendResponse(res, 200, { result });
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  getMaintenanceFormInfo: async (req, res) => {
    try {
      const [departments] = await pool.promise().query("SELECT Department_ID, name FROM department");
      const [vendors] = await pool.promise().query("SELECT Vendor_ID, name FROM vendor");
      const [attractions] = await pool.promise().query("SELECT Attraction_ID, Attraction_Name FROM attraction");
      const [habitats] = await pool.promise().query("SELECT Habitat_ID, Habitat_Name FROM habitat");
      const [workers] = await pool.promise().query("SELECT Employee_ID, first_name, last_name FROM employee");

      sendResponse(res, 200, {
        departments,
        vendors,
        attractions,
        habitats,
        workers,
      });
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  getMaintenanceReport: async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        includeVendor,
        includeAttraction,
        includeHabitat,
        vendorID,
        attractionID,
        habitatID,
        workerID,
      } = req.body;

      const values = [startDate, endDate];
      const conditions = ["Start_Date BETWEEN ? AND ?"];

      if (workerID) {
        conditions.push("Maintenance_EmployeeID = ?");
        values.push(workerID);
      }
      if (includeVendor && vendorID) {
        conditions.push("Vendor_ID = ?");
        values.push(vendorID);
      }
      if (includeAttraction && attractionID) {
        conditions.push("Attraction_ID = ?");
        values.push(attractionID);
      }
      if (includeHabitat && habitatID) {
        conditions.push("Habitat_ID = ?");
        values.push(habitatID);
      }

      const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

      // ---------- COST QUERY ----------
      const costQuery = `
        SELECT Start_Date, End_Date, maintenance_locationID AS Location, SUM(cost) AS cost
        FROM maintenance
        ${whereClause}
        GROUP BY Start_Date, End_Date, Location
        ORDER BY Start_Date
      `;

      const [costResult] = await pool.promise().query(costQuery, values);

      // ---------- DURATION QUERY ----------
      const durationQuery = `
        SELECT DATEDIFF(End_Date, Start_Date) AS duration
        FROM maintenance
        ${whereClause}
      `;

      const [durationRaw] = await pool.promise().query(durationQuery, values);

      const durationBuckets = {
        "0–1 days": 0,
        "2–3 days": 0,
        "4–5 days": 0,
        "6+ days": 0,
      };
      console.log("🕒 Raw durations returned from SQL:");
console.log(durationRaw);

      
      for (const row of durationRaw) {
        // Fix the logic by adding +1 to account for inclusive duration
        const days = (row.duration ?? 0) + 1;
      
        if (days <= 1) durationBuckets["0–1 days"]++;
        else if (days <= 3) durationBuckets["2–3 days"]++;
        else if (days <= 5) durationBuckets["4–5 days"]++;
        else durationBuckets["6+ days"]++;
      }
      
      
      const durationData = Object.entries(durationBuckets).map(([category, count]) => ({
        category,
        duration: count,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        costData: costResult,
        durationData,
      }));
    } catch (error) {
      console.error("❌ Error in getMaintenanceReport:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to generate report" }));
    }
  },

  // Delete a maintenance record based on Maintenance_ID
  deleteMaintenanceRow: async (req, res) => {
    /*
      Function: deleteMaintenanceRow
      Ex: Frontend provides:
      {
          "Maintenance_ID": 42
      };
      Output:
      {
          "message": "Maintenance record deleted successfully"
      }
    */

    const { Maintenance_ID } = req.body || {};

    // Ensure Maintenance_ID is provided
    if (!Maintenance_ID) {
      return sendResponse(res, 400, { error: "Maintenance_ID is required" });
    }

    const sql = `
      DELETE FROM maintenance
      WHERE Maintenance_ID = ?
    `;

    try {
      const [result] = await pool.promise().query(sql, [Maintenance_ID]);

      if (result.affectedRows === 0) {
        return sendResponse(res, 404, { error: "No record found with the given Maintenance_ID" });
      }

      sendResponse(res, 200, { message: "Maintenance record deleted successfully" });
    } catch (err) {
      console.error("Database delete error:", err);
      sendResponse(res, 500, { error: "Database error while deleting maintenance record" });
    }
  },

  // Edit a maintenance record based on Maintenance_ID
  editMaintenanceRow: async (req, res) => {
    /*
      Function: editMaintenanceRow
      Ex: Frontend provides:
      {
          "Maintenance_ID": 42,
          "Cost": 1500.00,
          "Status": 2
      };
      Output:
      {
          "message": "Maintenance record updated successfully"
      }
    */

    console.log(req.body);

    const {
      Maintenance_ID,
      Maintenance_EmployeeID,
      End_Date,
      Description,
      Status,
      cost,
      RecentCheck,
    } = req.body;

    // Ensure Maintenance_ID is provided
    if (!Maintenance_ID) {
      return sendResponse(res, 400, { error: "Maintenance_ID is required" });
    }

    // Dynamically build the SET clause
    const updates = [];
    const values = [];

    if (Maintenance_EmployeeID) {
      updates.push("Maintenance_EmployeeID = ?");
      values.push(Maintenance_EmployeeID);
    }
    if (End_Date) {
      updates.push("End_Date = ?");
      values.push(End_Date);
    }
    if (Description) {
      updates.push("Description = ?");
      values.push(Description);
    }
    if (Status) {
      updates.push("Status = ?");
      values.push(Status);
    }
    if (cost) {
      updates.push("Cost = ?");
      values.push(cost);
    }
    if (RecentCheck) {
      updates.push("RecentCheck = ?");
      values.push(RecentCheck);
    }

    // If no fields provided to update
    if (updates.length === 0) {
      return sendResponse(res, 400, { error: "At least one field must be provided for update" });
    }

    values.push(Maintenance_ID);

    const sql = `
      UPDATE maintenance
      SET ${updates.join(", ")}
      WHERE Maintenance_ID = ?
    `;

    try {
      const [result] = await pool.promise().query(sql, values);

      if (result.affectedRows === 0) {
        return sendResponse(res, 404, { error: "No record found with the given Maintenance_ID" });
      }

      sendResponse(res, 200, { message: "Maintenance record updated successfully" });
    } catch (err) {
      console.error("Error while updating maintenance record:", err);
      sendResponse(res, 500, { error: "Internal server error" });
    }
  },
};

// Function to get the location name based on the location ID
const getLocationName = async (locationID, Location_type) => {
  try {
    // Check if it's a vendor, habitat, or attraction by querying the tables
    const vendorSql = `SELECT name FROM vendor WHERE Vendor_ID = ?`;
    const habitatSql = `SELECT Habitat_Name FROM habitat WHERE Habitat_ID = ?`;
    const attractionSql = `SELECT Attraction_Name FROM attraction WHERE Attraction_ID = ?`;

    if (Location_type === "attraction") {
        const [attractionResult] = await pool.promise().query(attractionSql, [locationID]);
        if (attractionResult.length > 0) {
            return attractionResult[0].Attraction_Name;
        }
    } else if (Location_type === "habitat") {
        const [habitatResult] = await pool.promise().query(habitatSql, [locationID]);
        if (habitatResult.length > 0) {
            return habitatResult[0].Habitat_Name;
        }
    } else if (Location_type === "vendor") {
        const [vendorResult] = await pool.promise().query(vendorSql, [locationID]);
        if (vendorResult.length > 0) {
            return vendorResult[0].name;
        }
    }
    
    // If not found in any table or type doesn't match
    return 'Unknown Location';
  } catch (err) {
      console.error("Error fetching location name:", err);
      return 'Unknown Location';
  }
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}


export default MaintenanceController;



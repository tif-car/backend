 
import pool from "../db.js";

const maintenanceController = {

  getMaintenanceRequestFormInfo: async (req, res) => {
    try {
      
      const [vendors] = await pool.promise().query(`
       SELECT
       v.name AS vendor_name,
       ml.Location_ID AS Maintenance_Location
       FROM vendor v
       JOIN maintenance_location ml
       ON ml.Location_ID = v.Status
      WHERE ml.Location_type = 'vendor';
      `);
     
      
      const [attractions] = await pool.promise().query(`
       
        SELECT
          a.Attraction_Name,
          ml.Location_ID AS Maintenance_Location
        FROM attraction a
        JOIN maintenance_location ml
          ON ml.Location_ID = a.Status
        WHERE ml.Location_type = 'attraction';
      `);
  
      
      const [habitats] = await pool.promise().query(`
                SELECT
            h.Habitat_Name,
            ml.Location_ID AS Maintenance_Location
          FROM habitat h
          JOIN maintenance_location ml
            ON ml.Location_ID = h.Status
          WHERE ml.Location_type = 'habitat';
                `);
  
      sendResponse(res, 200, {
        vendors,
        attractions,
        habitats,
      });
    } catch (error) {
      console.error(" Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },
  


  getMaintenanceEditFormInfo: async (req, res) => {
    try {
      const [employees] = await pool.promise().query(`
        select e.Employee_ID, e.first_Name, e.last_Name
        from employee e
        where Role = 2;
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
      const [request] = await pool.promise().query(`select * from maintenance where Maintenance_ID = ?;`, [requestId]);
      sendResponse(res, 200, {request});
    } catch (error) {
      console.error("❌ Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

 /*
  addMaintenanceRequest: async (req, res) => {
    try {
      const {start_date ,Location_ID, request_desc} = req.body;
//randomly assign a worker, pending, 
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
  */
  addMaintenanceRequest: async (req, res) => {
    try {
      const { start_date, Location_ID, request_desc } = req.body;
  
      // Get the employee with Role = 2 that has been assigned the fewest maintenance tasks
      const getWorkerSql = `
        SELECT e.Employee_ID
        FROM employee e
        LEFT JOIN (
          SELECT Maintenance_EmployeeID, COUNT(*) AS task_count
          FROM maintenance m
          GROUP BY Maintenance_EmployeeID
        ) m ON e.Employee_ID = m.Maintenance_EmployeeID
        WHERE e.Role = 2
        ORDER BY COALESCE(m.task_count, 0), e.Employee_ID
        LIMIT 1;
      `;
  
      const [workerRows] = await pool.promise().query(getWorkerSql);
      if (workerRows.length === 0) {
        return sendResponse(res, 400, { error: "No maintenance workers found." });
      }
  
      const assignedEmployeeId = workerRows[0].Employee_ID;
  
      //insert the maintenance request with that employee
      const insertSql = `
        INSERT INTO zoo.maintenance 
        (Maintenance_EmployeeID, cost, Status, Start_Date, maintenance_locationID, request_desc) 
        VALUES (?, 0, 1, ?, ?, ?)`;
  
      const [insertResult] = await pool.promise().query(insertSql, [
        assignedEmployeeId,
        start_date,
        Location_ID,
        request_desc,
      ]);
  
      sendResponse(res, 200, { message: "Maintenance request added.", assignedEmployeeId });
    } catch (error) {
      console.error("❌ Error adding maintenance request:", error);
      sendResponse(res, 500, { error: "Failed to add maintenance request." });
    }
  },
  

  getMaintenanceFormInfo: async (req, res) => {
    try {
      const [departments] = await pool.promise().query("SELECT Department_ID, name FROM department");
      const [vendors] = await pool.promise().query("SELECT Vendor_ID, name FROM vendor");
      const [attractions] = await pool.promise().query("SELECT Attraction_ID, Attraction_Name FROM attraction");
      const [habitats] = await pool.promise().query("SELECT Habitat_ID, Habitat_Name FROM habitat");
      const [workers] = await pool.promise().query("SELECT Employee_ID, first_name, last_name FROM employee WHERE Role = 2");

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
        departmentID,
      } = req.body;
  
      const values = [startDate, endDate];
      const conditions = [`m.Start_Date BETWEEN ? AND ?`];
  
      const joins = [
        `JOIN maintenance_location ml ON m.maintenance_locationID = ml.Location_ID`,
        `LEFT JOIN vendor v ON ml.Location_type = 'vendor' AND v.Status = ml.Location_ID`,
        `LEFT JOIN attraction a ON ml.Location_type = 'attraction' AND a.Status = ml.Location_ID`,
        `LEFT JOIN habitat h ON ml.Location_type = 'habitat' AND h.Status = ml.Location_ID`,
      ];
  
      // Worker filter
      if (workerID) {
        conditions.push(`m.Maintenance_EmployeeID = ?`);
        values.push(workerID);
      }
  
      // Department filter
      if (departmentID) {
        conditions.push(`
          (
            (ml.Location_type = 'vendor' AND v.Dept_ID = ?)
            OR (ml.Location_type = 'attraction' AND a.Dept_ID = ?)
            OR (ml.Location_type = 'habitat' AND h.Dept_ID = ?)
          )
        `);
        values.push(departmentID, departmentID, departmentID);
      }
  
      // Type filters
      const typeConditions = [];
  
      if (includeVendor) {
        if (vendorID) {
          typeConditions.push(`(ml.Location_type = 'vendor' AND v.Vendor_ID = ?)`);
          values.push(vendorID);
        } else {
          typeConditions.push(`ml.Location_type = 'vendor'`);
        }
      }
  
      if (includeAttraction) {
        if (attractionID) {
          typeConditions.push(`(ml.Location_type = 'attraction' AND a.Attraction_ID = ?)`);
          values.push(attractionID);
        } else {
          typeConditions.push(`ml.Location_type = 'attraction'`);
        }
      }
  
      if (includeHabitat) {
        if (habitatID) {
          typeConditions.push(`(ml.Location_type = 'habitat' AND h.Habitat_ID = ?)`);
          values.push(habitatID);
        } else {
          typeConditions.push(`ml.Location_type = 'habitat'`);
        }
      }
  
      // If no types are selected, return empty result
      if (typeConditions.length === 0) {
        return sendResponse(res, 200, {
          costData: [],
          durationData: [],
        });
      }
  
      conditions.push(`(${typeConditions.join(" OR ")})`);
      const whereClause = `WHERE ${conditions.join(" AND ")}`;
  
      // COST QUERY
      const costQuery = `
        SELECT 
          m.Start_Date, 
          m.End_Date, 
          ml.Location_type AS Location, 
          SUM(m.cost) AS cost
        FROM maintenance m
        ${joins.join("\n")}
        ${whereClause}
        GROUP BY m.Start_Date, m.End_Date, ml.Location_type
        ORDER BY m.Start_Date
      `;
  
      const [costResult] = await pool.promise().query(costQuery, values);
  
      // DURATION QUERY
      const durationQuery = `
        SELECT DATEDIFF(m.End_Date, m.Start_Date) AS duration
        FROM maintenance m
        ${joins.join("\n")}
        ${whereClause}
      `;
      const [durationRaw] = await pool.promise().query(durationQuery, values);
  
      const durationBuckets = {
        "0–1 days": 0,
        "2–3 days": 0,
        "4–5 days": 0,
        "6+ days": 0,
      };
  
      for (const row of durationRaw) {
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
  
      sendResponse(res, 200, {
        costData: costResult,
        durationData,
      });
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

    const {
      Maintenance_ID,
      Maintenance_EmployeeID,
      End_Date,
      Description,
      Status,
      Cost,
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
    if (Cost) {
      updates.push("Cost = ?");
      values.push(Cost);
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


  maintenanceView: async (req, res) => {
    const sql = `SELECT * FROM MAINTENANCE_REQUESTS`;

    try {
        const [result] = await pool.promise().query(sql);

        if (result.length === 0) {
            console.log("No maintenance requests found.");
            return sendResponse(res, 404, { error: "No maintenance requests found." });
        }

        sendResponse(res, 200, { maintenance_requests: result });
    } catch (err) {
        console.error("Error fetching maintenance view:", err);
        sendResponse(res, 500, { error: "Database error" });
    }
  }
};

// **Helper function to send JSON responses**
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}


export default maintenanceController;



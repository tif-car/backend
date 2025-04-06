import pool from "../db.js";

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const maintenanceController = {
  getMaintenanceFormInfo: async (req, res) => {
    try {
      const [departments] = await pool
        .promise()
        .query("SELECT Department_ID, name FROM department");
      const [vendors] = await pool
        .promise()
        .query("SELECT Vendor_ID, name FROM vendor");
      const [attractions] = await pool
        .promise()
        .query("SELECT Attraction_ID, Attraction_Name FROM attraction");
      const [habitats] = await pool
        .promise()
        .query("SELECT Habitat_ID, Habitat_Name FROM habitat");
      const [workers] = await pool
        .promise()
        .query("SELECT Employee_ID, first_name, last_name FROM employee");

      sendResponse(res, 200, {
        departments,
        vendors,
        attractions,
        habitats,
        workers,
      });
    } catch (error) {
      console.error("Error fetching maintenance form info:", error);
      sendResponse(res, 500, { error: "Failed to fetch form data" });
    }
  },

  getMaintenanceReport: async (req, res) => {
    try {
      const {
        departmentID,
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
  
      console.log("🧠 Parsed request body:", req.body);
  
      let costQuery = `
        SELECT Start_Date, End_Date, SUM(cost) AS cost
        FROM maintenance
        WHERE Start_Date BETWEEN ? AND ?
      `;
  
      const conditions = [];
      const values = [startDate, endDate];
  
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
  
      if (conditions.length > 0) {
        costQuery += " AND " + conditions.join(" AND ");
      }
  
      costQuery += " GROUP BY Start_Date, End_Date ORDER BY Start_Date";
  
      console.log("🧪 Running query:", costQuery);
      console.log("🔧 With values:", values);
  
      const [costResult] = await pool.promise().query(costQuery, values);
  
      const durationData = [];
  
      // You can keep your existing duration logic below if needed
  
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          costData: costResult,
          durationData,
        })
      );
    } catch (error) {
      console.error("❌ Error in getMaintenanceReport:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to generate report" }));
    }
  }
  
};

export default maintenanceController;
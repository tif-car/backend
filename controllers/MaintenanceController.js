
import pool from "../db.js";

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const maintenanceController = {
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
  }
};

export default maintenanceController;


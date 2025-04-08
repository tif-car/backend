import pool from "../db.js";

const vendorReportController = {
  getVendorReportFormInfo: async (req, res) => {
    const deptSql = `SELECT d.Department_ID, d.name AS Department_name FROM department d;`;
    const vendSql = `SELECT v.Vendor_ID, v.name, v.Dept_ID FROM vendor v;`;
    const itemTSql = `SELECT i.item_typeID, i.item_types FROM item_types i;`;
    const merchSql = `SELECT m.Merchandise_ID, m.Item_Name, m.Item_Type FROM merchandise m;`;

    try {
      const [deptResult] = await pool.promise().query(deptSql);
      const [vendResult] = await pool.promise().query(vendSql);
      const [itemTResult] = await pool.promise().query(itemTSql);
      const [merchResult] = await pool.promise().query(merchSql);

      sendResponse(res, 200, {
        Departments: deptResult,
        Vendors: vendResult,
        ItemTypes: itemTResult,
        Merchandise: merchResult,
      });
    } catch (err) {
      console.error("Database query error:", err);
      sendResponse(res, 500, { error: "Database error" });
    }
  },

  getReport: async (req, res) => {
    try {
      const {
        Department_ID,
        Vendor_ID,
        item_typeID,
        Merchandise_ID,
        start_date,
        end_date,
      } = req.body || {};

      if (!start_date || !end_date) {
        return sendResponse(res, 400, { error: "Start date and end date are required" });
      }

      const conditions = [];
      const params = [start_date, end_date];

      if (Department_ID) {
        conditions.push("v.Dept_ID = ?");
        params.push(Department_ID);
      }

      if (Vendor_ID) {
        conditions.push("v.Vendor_ID = ?");
        params.push(Vendor_ID);
      }

      if (item_typeID) {
        conditions.push("m.Item_Type = ?");
        params.push(item_typeID);
      }

      if (Merchandise_ID) {
        conditions.push("m.Merchandise_ID = ?");
        params.push(Merchandise_ID);
      }

      const whereClause = conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

      const reportData = {
        vendorSales: [],
        itemSales: [],
        deptSales: [],
        itemTypeSales: [],
      };

      // Vendor Sales
      const vendorQuery = `
        SELECT
          DATE(o.Order_Date) AS sale_date,
          SUM(m.Item_Price) AS total_sales,
          v.name AS vendor_name
        FROM orders o
        JOIN single_item si ON o.Order_ID = si.order_ID
        JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
        JOIN vendor v ON m.V_ID = v.Vendor_ID
        WHERE DATE(o.Order_Date) BETWEEN ? AND ?
        ${whereClause}
        GROUP BY sale_date, v.Vendor_ID
        ORDER BY sale_date;
      `;
      const [vendorResults] = await pool.promise().query(vendorQuery, params);
      reportData.vendorSales = vendorResults;

      // Item Sales
      const itemQuery = `
  SELECT
    DATE(o.Order_Date) AS sale_date,
    SUM(m.Item_Price) AS total_sales,
    m.Item_Name,
    m.Merchandise_ID,
    m.Item_Type AS item_typeID,
    v.Dept_ID AS Department_ID
  FROM orders o
  JOIN single_item si ON o.Order_ID = si.order_ID
  JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
  JOIN vendor v ON m.V_ID = v.Vendor_ID
  WHERE DATE(o.Order_Date) BETWEEN ? AND ?
  ${whereClause}
  GROUP BY sale_date, m.Merchandise_ID
  ORDER BY sale_date;
`;
const [itemResults] = await pool.promise().query(itemQuery, params);
reportData.itemSales = itemResults;


      // Department Sales (only if Vendor_ID is not selected)
      // Department Sales (always included now)
const deptQuery = `
SELECT
  DATE(o.Order_Date) AS sale_date,
  SUM(m.Item_Price) AS total_sales,
  d.name AS department_name
FROM orders o
JOIN single_item si ON o.Order_ID = si.order_ID
JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
JOIN vendor v ON m.V_ID = v.Vendor_ID
JOIN department d ON v.Dept_ID = d.Department_ID
WHERE DATE(o.Order_Date) BETWEEN ? AND ?
${whereClause}
GROUP BY sale_date, d.Department_ID
ORDER BY sale_date;
`;
const [deptResults] = await pool.promise().query(deptQuery, params);
reportData.deptSales = deptResults;

// Item Type Sales (only if Merchandise_ID is not selected)
if (!Merchandise_ID) {
const itemTypeQuery = `
  SELECT
    DATE(o.Order_Date) AS sale_date,
    SUM(m.Item_Price) AS total_sales,
    it.item_types,
    it.item_typeID
  FROM orders o
  JOIN single_item si ON o.Order_ID = si.order_ID
  JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
  JOIN vendor v ON m.V_ID = v.Vendor_ID
  JOIN item_types it ON m.Item_Type = it.item_typeID
  WHERE DATE(o.Order_Date) BETWEEN ? AND ?
  ${whereClause}
  GROUP BY sale_date, it.item_typeID
  ORDER BY sale_date;
`;
const [itemTypeResults] = await pool.promise().query(itemTypeQuery, params);
reportData.itemTypeSales = itemTypeResults;
}

      sendResponse(res, 200, reportData);
    } catch (error) {
      console.error("Error generating sales report:", error);
      sendResponse(res, 500, { error: "Internal server error" });
    }
  },
};

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export default vendorReportController;

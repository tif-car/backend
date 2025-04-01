import pool from "../db.js";

const vendorReportController = {
    getVendorQueryFormInfo: async (req, res) => {

        const deptSql = `select d.Department_ID, d.name from department d;`;
        const vendSql = `select v.Vendor_ID, v.name, v.Dept_ID from vendor v;`; 
        const itemTSql = `select i.item_typeID, i.item_types from item_types i;`; 
        const merchSql = `select m.Merchandise_ID, m.Item_Name, m.Item_Type from merchandise m;`;

        try {
            const [deptResult] = await pool.promise().query(deptSql);
            const [vendResult] = await pool.promise().query(vendSql);
            const [itemTResult] = await pool.promise().query(itemTSql);
            const [merchResult] = await pool.promise().query(merchSql);

            const combinedResults = {
                Departments: deptResult, // [Department_ID, name]
                Vendors: vendResult, // [Vendor_ID, name, Dept_ID]
                Item_types: itemTResult, // [item_typeID, item_types]
                Merchandise: merchResult, // [Merchandise_ID, Item_Name, Item_Type]
            };

            sendResponse(res, 200, combinedResults);
        } catch (err) {
            console.error("Database query error:", err);
            return sendResponse(res, 500, { error: "Database error" });
        }
    },
    
    getReport: async (req, res) => {
        try {
            const {
                Dept_ID,
                Vendor_ID,
                Item_type_ID,
                Merchandise_ID,
                start_date,
                end_date
            } = req.body;

            if (!start_date || !end_date) {
                return sendResponse(res, 400, { error: "Start date and end date are required" });
            }

            let conditions = [];
            let params = [];

            conditions.push("o.Order_date BETWEEN ? AND ?");
            params.push(start_date, end_date);

            if (Dept_ID) {
                conditions.push("v.Dept_ID = ?");
                params.push(Dept_ID);
            }

            if (Vendor_ID) {
                conditions.push("o.vendor_ID = ?");
                params.push(Vendor_ID);
            }

            if (Item_type_ID) {
                conditions.push("m.Item_Type = ?");
                params.push(Item_type_ID);
            }

            if (Merchandise_ID) {
                conditions.push("o.Merch_ItemID = ?");
                params.push(Merchandise_ID);
            }

            let whereClause = conditions.length > 0 
                ? "WHERE " + conditions.join(" AND ") 
                : "";

            let reportData = {
                title: "Vendor and Merchandise Sales",
                parameters: {
                    start_date,
                    end_date,
                    Dept_ID,
                    Vendor_ID,
                    Item_type_ID,
                    Merchandise_ID
                },
                vendorSales: [],
                itemSales: [],
                deptSales: [],
                itemTypeSales: []
            };

            if (!Merchandise_ID) {
                let vendorQuery = `
                    SELECT 
                      MIN(DATE(o.Order_date)) AS start_date,
                      MAX(DATE(o.Order_date)) AS end_date,
                      CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                      o.vendor_ID
                      
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY o.vendor_ID
                    ORDER BY o.vendor_ID
                `;
                
                let [vendorResults] = await pool.promise().query(vendorQuery, params);
                reportData.vendorSales = vendorResults;
            }

            let itemQuery = `
                SELECT 
                    MIN(DATE(o.Order_date)) AS start_date,
                    MAX(DATE(o.Order_date)) AS end_date,
                    CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                    o.Merch_ItemID
                FROM orders o
                JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                ${whereClause}
                GROUP BY  o.Merch_ItemID
                ORDER BY o.Merch_ItemID
            `;
            
            let [itemResults] = await pool.promise().query(itemQuery, params);
            reportData.itemSales = itemResults;

            if (!Merchandise_ID) {
                let deptQuery = `
                    SELECT 
                        MIN(DATE(o.Order_date)) AS start_date,
                        MAX(DATE(o.Order_date)) AS end_date,
                        CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                        v.Dept_ID
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY  v.Dept_ID
                    ORDER BY v.Dept_ID
                `;
                
                let [deptResults] = await pool.promise().query(deptQuery, params);
                reportData.deptSales = deptResults;
            }

            if (!Merchandise_ID) {
                let itemTypeQuery = `
                    SELECT 
                        MIN(DATE(o.Order_date)) AS start_date,
                        MAX(DATE(o.Order_date)) AS end_date,
                        CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                        m.Item_Type
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY  m.Item_Type
                    ORDER BY m.Item_Type
                `;
                
                let [itemTypeResults] = await pool.promise().query(itemTypeQuery, params);
                reportData.itemTypeSales = itemTypeResults;
            }

            sendResponse(res, 200, reportData);
        } catch (error) {
            console.error('Error generating sales report:', error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    }

};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default vendorReportController;
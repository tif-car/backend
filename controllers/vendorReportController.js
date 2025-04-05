import pool from "../db.js";

const vendorReportController = {
    getVendorReportFormInfo: async (req, res) => {
    
            const deptSql = `select d.Department_ID, d.name AS Department_name from department d;`;
            const vendSql = `select a.Attraction_Name, a.Attraction_ID, a.Dept_ID  from attraction a;`; 
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
                    ItemTypes: itemTResult, // [item_typeID, item_types]
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
            let params = [start_date, end_date];

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

            const whereClause = conditions.length ? "AND " + conditions.join(" AND ") : "";

            let reportData = {
                title: "Vendor and Merchandise Sales Report",
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

           
            const vendorQuery = `
               SELECT
                    DATE(o.Order_Date) AS sale_date,
                    CONCAT('$', FORMAT(SUM(m.Item_Price), 2)) AS total_sales,
                    o.vendor_ID
                FROM orders o
                JOIN bought_item bi ON o.Order_ID = bi.Order_ID
                JOIN merchandise m ON bi.Item_ID = m.Merchandise_ID
                JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                WHERE DATE(o.Order_Date) BETWEEN ? AND ?
                ${conditions.length ? ' AND ' + conditions.join(' AND ') : ''}

                GROUP BY sale_date, o.vendor_ID
                ORDER BY o.vendor_ID, sale_date;
            
            `;
            const [vendorResults] = await pool.promise().query(vendorQuery, params);
            reportData.vendorSales = vendorResults;

            
            const itemQuery = `
                 SELECT
                    DATE(o.Order_Date) AS sale_date,
                    CONCAT('$', FORMAT(SUM(m.Item_Price), 2)) AS total_sales,
                    m.Merchandise_ID
                FROM orders o
                JOIN bought_item bi ON o.Order_ID = bi.Order_ID
                JOIN merchandise m ON bi.Item_ID = m.Merchandise_ID
                JOIN vendor v ON o.vendor_ID = v.Vendor_ID
               WHERE DATE(o.Order_Date) BETWEEN ? AND ?
                ${conditions.length ? ' AND ' + conditions.join(' AND ') : ''}

                GROUP BY sale_date, m.Merchandise_ID
                ORDER BY m.Merchandise_ID, sale_date;
            `;
            const [itemResults] = await pool.promise().query(itemQuery, params);
            reportData.itemSales = itemResults;

           
            const deptQuery = `
                
                   SELECT
                    DATE(o.Order_Date) AS sale_date,
                    CONCAT('$', FORMAT(SUM(m.Item_Price), 2)) AS total_sales,
                    v.Dept_ID
                FROM orders o
                JOIN bought_item bi ON o.Order_ID = bi.Order_ID
                JOIN merchandise m ON bi.Item_ID = m.Merchandise_ID
                JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                WHERE DATE(o.Order_Date) BETWEEN ? AND ?
                ${conditions.length ? ' AND ' + conditions.join(' AND ') : ''}

                GROUP BY sale_date, v.Dept_ID
                ORDER BY v.Dept_ID, sale_date;
            `;
            const [deptResults] = await pool.promise().query(deptQuery, params);
            reportData.deptSales = deptResults;

           
            if (!Merchandise_ID) {
                const itemTypeQuery = `
                   SELECT
                        DATE(o.Order_Date) AS sale_date,
                        CONCAT('$', FORMAT(SUM(m.Item_Price), 2)) AS total_sales,
                        m.Item_Type
                    FROM orders o
                    JOIN bought_item bi ON o.Order_ID = bi.Order_ID
                    JOIN merchandise m ON bi.Item_ID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    WHERE DATE(o.Order_Date) BETWEEN ? AND ?
                    ${conditions.length ? ' AND ' + conditions.join(' AND ') : ''}

                    GROUP BY sale_date, m.Item_Type
                    ORDER BY m.Item_Type, sale_date;
                `;
                const [itemTypeResults] = await pool.promise().query(itemTypeQuery, params);
                reportData.itemTypeSales = itemTypeResults;
            }

            sendResponse(res, 200, reportData);
        } catch (error) {
            console.error("Error generating sales report:", error);
            sendResponse(res, 500, { error: "Internal server error" });
        }
    }
};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default vendorReportController;

import pool from "../db.js";

const vendorandmerchsalesreportController = {
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
                        DATE(o.Order_date) AS sale_date,
                        CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                        SUM(o.Total_Amount) AS raw_total,
                        o.vendor_ID
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY sale_date, o.vendor_ID
                    ORDER BY o.vendor_ID, sale_date
                `;
                
                let [vendorResults] = await pool.promise().query(vendorQuery, params);
                reportData.vendorSales = vendorResults;
            }

            let itemQuery = `
                SELECT 
                    DATE(o.Order_date) AS sale_date,
                    CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                    SUM(o.Total_Amount) AS raw_total,
                    o.Merch_ItemID
                FROM orders o
                JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                ${whereClause}
                GROUP BY sale_date, o.Merch_ItemID
                ORDER BY o.Merch_ItemID, sale_date
            `;
            
            let [itemResults] = await pool.promise().query(itemQuery, params);
            reportData.itemSales = itemResults;

            if (!Merchandise_ID) {
                let deptQuery = `
                    SELECT 
                        DATE(o.Order_date) AS sale_date,
                        CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                        SUM(o.Total_Amount) AS raw_total,
                        v.Dept_ID
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY sale_date, v.Dept_ID
                    ORDER BY v.Dept_ID, sale_date
                `;
                
                let [deptResults] = await pool.promise().query(deptQuery, params);
                reportData.deptSales = deptResults;
            }

            if (!Merchandise_ID) {
                let itemTypeQuery = `
                    SELECT 
                        DATE(o.Order_date) AS sale_date,
                        CONCAT('$', FORMAT(SUM(o.Total_Amount), 2)) AS total_sales,
                        SUM(o.Total_Amount) AS raw_total,
                        m.Item_Type
                    FROM orders o
                    JOIN merchandise m ON o.Merch_ItemID = m.Merchandise_ID
                    JOIN vendor v ON o.vendor_ID = v.Vendor_ID
                    ${whereClause}
                    GROUP BY sale_date, m.Item_Type
                    ORDER BY m.Item_Type, sale_date
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

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default vendorandmerchsalesreportController; 
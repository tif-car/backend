import pool from "../db.js";

const vendorReportController = {
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
                conditions.push("v.Vendor_ID = ?");
                params.push(Vendor_ID);
            }
            
            

            if (Item_type_ID) {
                conditions.push("m.Item_Type = ?");
                params.push(Item_type_ID);
            }

            if (Merchandise_ID) {
                conditions.push("m.Merchandise_ID = ?");
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
            v.Vendor_ID
            FROM orders o
            JOIN single_item si ON o.Order_ID = si.order_ID
            JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
            JOIN vendor v ON m.V_ID = v.Vendor_ID
            WHERE DATE(o.Order_Date) BETWEEN ? AND ?
            ${whereClause}
            GROUP BY sale_date, v.Vendor_ID
            ORDER BY v.Vendor_ID, sale_date;


            
            `;
            const [vendorResults] = await pool.promise().query(vendorQuery, params);
            reportData.vendorSales = vendorResults;

            
            const itemQuery = `
              SELECT
         DATE(o.Order_Date) AS sale_date,
         CONCAT('$', FORMAT(SUM(m.Item_Price), 2)) AS total_sales,
        m.Merchandise_ID
        FROM orders o
        JOIN single_item si ON o.Order_ID = si.order_ID
        JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
        JOIN vendor v ON m.V_ID = v.Vendor_ID
        WHERE DATE(o.Order_Date) BETWEEN ? AND ?
        ${whereClause}
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
        JOIN single_item si ON o.Order_ID = si.order_ID
        JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
        JOIN vendor v ON m.V_ID = v.Vendor_ID
        WHERE DATE(o.Order_Date) BETWEEN ? AND ?
        ${whereClause}
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
                 si.Item_ID
                FROM orders o
                JOIN single_item si ON o.Order_ID = si.order_ID
                JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
                JOIN vendor v ON m.V_ID = v.Vendor_ID
                WHERE DATE(o.Order_Date) BETWEEN ? AND ?
                ${whereClause}
                GROUP BY sale_date, si.Item_ID
                ORDER BY si.Item_ID, sale_date;


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

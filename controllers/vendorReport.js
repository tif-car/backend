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

};

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

export default vendorReportController;
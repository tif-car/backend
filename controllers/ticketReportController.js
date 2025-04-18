import pool from "../db.js";

const ticketReportController = {
    getTicketReportFormInfo: async (req, res) => {

        const deptSql = `select d.Department_ID, d.name AS department_name from department d where d.name <> 'General';`;
        const attSql = `select a.Attraction_Name, a.Attraction_ID, a.Dept_ID  from attraction a where Dept_ID <> '6';`; 
        const pTypeSql = `select tp.PersonType_ID, tp.ticket_person from ticket_person tp;`; 
        const memTypeSql = `select membership_TypeID, membership_Type from membership_type;`;

        try {
            const [deptResult] = await pool.promise().query(deptSql);
            const [attResult] = await pool.promise().query(attSql);
            const [pTypeResult] = await pool.promise().query(pTypeSql);
            const [memTypeResult] = await pool.promise().query(memTypeSql);

            const combinedResults = {
                departments: deptResult, 
                attractions: attResult, 
                personTypes: pTypeResult, 
                membershipStatuses: memTypeResult, 
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
                IsMoney,
                IsGeneral,
                Department,
                Attraction,
                Person_Type,
                Membership_type,
                start_date,
                end_date
            } = req.body || {};

            if (!start_date || !end_date) {
                return sendResponse(res, 400, { error: "Start date and end date are required" });
            }

            let conditions = [];
            let params = [];

            conditions.push("sale_date BETWEEN ? AND ?");
            params.push(start_date, end_date);

            if (!IsGeneral){
                if (Department) {
                    conditions.push("department_name = ?");
                    params.push(Department);
                }
    
                if (Attraction) {
                    conditions.push("Attraction_Name = ?");
                    params.push(Attraction);
                }
            } else {
                conditions.push("department_name = \'General\' ");
            }

            if (Person_Type) {
                conditions.push("ticket_person = ?");
                params.push(Person_Type);
            }

            if (Membership_type) {
                conditions.push("Membership_status = ?");
                params.push(Membership_type);
            }

            let whereClause = conditions.length > 0 
                ? "WHERE " + conditions.join(" AND ") 
                : "";

            let reportData = {
                GeneralSales: [],
                DeptSales: [],
                AttSales: [],
                PTypeSales: [],
                MemTypeSales: []
            };

            if (!IsGeneral) {
                let deptQuery = `SELECT
                                    sale_date,
                                    COUNT(*) AS tickets_sold,
                                    department_name
                                FROM
                                    ticket_report
                                ${whereClause}
                                GROUP BY
                                    sale_date,
                                    department_name
                                ORDER BY
                                    sale_date;`;

                let [deptResults] = await pool.promise().query(deptQuery, params);
                reportData.DeptSales = deptResults;

                let attQuery = `SELECT
                                    sale_date,
                                    COUNT(*) AS tickets_sold,
                                    Attraction_Name
                                FROM
                                    ticket_report
                                ${whereClause}
                                GROUP BY
                                    sale_date,
                                    Attraction_Name
                                ORDER BY
                                    sale_date;`;

                let [attResults] = await pool.promise().query(attQuery, params);
                reportData.AttSales = attResults;

            } else {
                let genQuery = `SELECT
                                    sale_date,
                                    COUNT(*) AS tickets_sold,
                                    Attraction_Name
                                FROM
                                    ticket_report
                                ${whereClause}
                                GROUP BY
                                    sale_date,
                                    Attraction_Name
                                ORDER BY
                                    sale_date;`;
                
                let [genResults] = await pool.promise().query(genQuery, params);
                reportData.GeneralSales = genResults;
                
            }
            

            let pTypeQuery =  `SELECT
                                    sale_date,
                                    COUNT(*) AS tickets_sold,
                                    ticket_Person
                                FROM
                                    ticket_report
                                ${whereClause}
                                GROUP BY
                                    sale_date,
                                    ticket_Person
                                ORDER BY
                                    sale_date;`;

            let [pTypeResults] = await pool.promise().query(pTypeQuery, params);
            reportData.PTypeSales = pTypeResults;
            
            let memTypeQuery = `SELECT
                                    sale_date,
                                    COUNT(*) AS tickets_sold,
                                    membership_type
                                FROM
                                    ticket_report
                                ${whereClause}
                                GROUP BY
                                    sale_date,
                                    membership_type
                                ORDER BY
                                    sale_date;`;
            
            
            let [memTypeResults] = await pool.promise().query(memTypeQuery, params);
            reportData.MemTypeSales = memTypeResults;  

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

export default ticketReportController;
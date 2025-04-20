import pool from "../db.js";

const ticketReportController = {
  getTicketReportFormInfo: async (req, res) => {
    const deptSql = `
      SELECT d.Department_ID, d.name AS department_name 
      FROM department d 
      WHERE d.name <> 'General';
    `;
    const attSql = `
      SELECT a.Attraction_Name, a.Attraction_ID, a.Dept_ID 
      FROM attraction a 
      WHERE Dept_ID <> 6;
    `;
    const pTypeSql = `
      SELECT tp.PersonType_ID, tp.ticket_person 
      FROM ticket_person tp;
    `;
    const memTypeSql = `
      SELECT membership_TypeID, membership_Type 
      FROM membership_type;
    `;

    try {
      const [deptResult] = await pool.promise().query(deptSql);
      const [attResult] = await pool.promise().query(attSql);
      const [pTypeResult] = await pool.promise().query(pTypeSql);
      const [memTypeResult] = await pool.promise().query(memTypeSql);

      sendResponse(res, 200, {
        departments: deptResult,
        attractions: attResult,
        personTypes: pTypeResult,
        membershipStatuses: memTypeResult,
      });
    } catch (err) {
      console.error("Database query error:", err);
      return sendResponse(res, 500, { error: "Database error" });
    }
  },

  getReport: async (req, res) => {
    try {
      const {
        IsGeneral,
        Department,
        Attraction,
        Person_Type,
        Membership_type,
        start_date,
        end_date,
      } = req.body || {};

      if (!start_date || !end_date) {
        return sendResponse(res, 400, { error: "Start and end dates required" });
      }

      let conditions = [`t.Bought_Date BETWEEN ? AND ?`];
      let params = [start_date, end_date];

      if (!IsGeneral) {
        if (Department) {
          conditions.push(`d.Department_ID = ?`);
          params.push(Department);
        }
        if (Attraction) {
          conditions.push(`a.Attraction_ID = ?`);
          params.push(Attraction);
        }
      } else {
        conditions.push(`d.name = 'General'`);
      }

      if (Person_Type) {
        conditions.push(`tp.PersonType_ID = ?`);
        params.push(Person_Type);
      }

      if (Membership_type) {
        conditions.push(`v.membership_status = ?`);
        params.push(Membership_type);
      }
      

      const whereClause = `WHERE ${conditions.join(" AND ")}`;

      const baseSelect = `
        FROM ticket t
        JOIN ticket_price pr ON t.Ticket_Price_ID = pr.Price_ID
        JOIN ticket_person tp ON pr.ticket_Person = tp.PersonType_ID
        JOIN attraction a ON pr.Attraction_ID = a.Attraction_ID
        JOIN department d ON a.Dept_ID = d.Department_ID
        JOIN visitor v ON t.Visitor_ID = v.Visitor_ID
        LEFT JOIN membership_type m ON v.membership_status = m.membership_TypeID
        ${whereClause}
      `;

      const allSalesQuery = `
        SELECT
          t.Bought_Date AS sale_date,
          d.name AS department_name,
          a.Attraction_Name,
          tp.ticket_person,
          m.membership_Type AS membership_type,
          COUNT(*) AS tickets_sold,
          SUM(pr.price) AS revenue
        ${baseSelect}
        GROUP BY sale_date, department_name, Attraction_Name, ticket_person, membership_type
        ORDER BY sale_date;
      `;

      const deptQuery = `
        SELECT
          t.Bought_Date AS sale_date,
          d.name AS department_name,
          COUNT(*) AS tickets_sold
        ${baseSelect}
        GROUP BY sale_date, department_name
        ORDER BY sale_date;
      `;

      const attQuery = `
        SELECT
          t.Bought_Date AS sale_date,
          a.Attraction_Name,
          COUNT(*) AS tickets_sold
        ${baseSelect}
        GROUP BY sale_date, a.Attraction_Name
        ORDER BY sale_date;
      `;

      const pTypeQuery = `
        SELECT
          t.Bought_Date AS sale_date,
          tp.ticket_person,
          COUNT(*) AS tickets_sold
        ${baseSelect}
        GROUP BY sale_date, tp.ticket_person
        ORDER BY sale_date;
      `;

      const memTypeQuery = `
        SELECT
          t.Bought_Date AS sale_date,
          m.membership_Type AS membership_type,
          COUNT(*) AS tickets_sold
        ${baseSelect}
        GROUP BY sale_date, membership_type
        ORDER BY sale_date;
      `;

      const [allSales] = await pool.promise().query(allSalesQuery, params);
      const [deptResults] = await pool.promise().query(deptQuery, params);
      const [attResults] = await pool.promise().query(attQuery, params);
      const [pTypeResults] = await pool.promise().query(pTypeQuery, params);
      const [memTypeResults] = await pool.promise().query(memTypeQuery, params);

      sendResponse(res, 200, {
        AllSales: allSales,
        DeptSales: deptResults,
        AttSales: attResults,
        PTypeSales: pTypeResults,
        MemTypeSales: memTypeResults,
      });
    } catch (error) {
      console.error("❌ Error generating ticket report:", error);
      sendResponse(res, 500, { error: "Internal server error" });
    }
  },
};

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export default ticketReportController;

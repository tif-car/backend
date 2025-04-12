import pool from "../db.js";

const orderHistoryController = {
  getOrderHistory: async (req, res) => {
    const visitorId = parseInt(req.url.split("?visitorId=")[1]);
    if (!visitorId || isNaN(visitorId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid visitor ID" }));
    }

    const conn = await pool.promise().getConnection();

    try {
      // Get all orders for the visitor
      const [orders] = await conn.query(
        `SELECT Order_ID, Order_Date FROM orders WHERE Visitor_ID = ?`,
        [visitorId]
      );

      const orderHistory = [];

      for (const order of orders) {
        const { Order_ID, Order_Date } = order;

        // Fetch tickets for the order
        const [ticketRows] = await conn.query(
          `SELECT tp.ticket_Person AS person_type, tp.Attraction_ID AS attraction
           FROM ticket t
           JOIN ticket_price tp ON t.Ticket_Price_ID = tp.Price_ID
           WHERE t.Visitor_ID = ? AND EXISTS (
             SELECT 1 FROM orders o WHERE o.Order_ID = ? AND o.Visitor_ID = t.Visitor_ID
           )`,
          [visitorId, Order_ID]
        );

        // Aggregate ticket quantities
        const ticketMap = {};
        for (const row of ticketRows) {
          const key = `${row.person_type}-${row.attraction}`;
          ticketMap[key] = ticketMap[key] || {
            person_type: row.person_type,
            attraction: row.attraction,
            quantity: 0
          };
          ticketMap[key].quantity++;
        }

        const tickets = Object.values(ticketMap);

        // Fetch merchandise for the order
        const [merchRows] = await conn.query(
          `SELECT m.Item_Name AS name
           FROM single_item s
           JOIN merchandise m ON s.merch_ID = m.Merchandise_ID
           WHERE s.order_ID = ?`,
          [Order_ID]
        );

        // Aggregate merchandise quantities
        const merchMap = {};
        for (const row of merchRows) {
          merchMap[row.name] = merchMap[row.name] || { name: row.name, quantity: 0 };
          merchMap[row.name].quantity++;
        }

        const merchandise = Object.values(merchMap);

        // Build final order entry
        const orderData = {
          order_id: Order_ID,
          date: Order_Date.toISOString().split("T")[0],
        };

        if (tickets.length > 0) orderData.tickets = tickets;
        if (merchandise.length > 0) orderData.merchandise = merchandise;

        orderHistory.push(orderData);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(orderHistory));
    } catch (error) {
      console.error("❌ Failed to fetch order history:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    } finally {
      conn.release();
    }
  }
};

export default orderHistoryController;

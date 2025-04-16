import pool from "../db.js";

const orderSummaryController = {
  getOrderSummaries: async (req, res) => {
    try {
      const [orders] = await pool.promise().query(`
        SELECT Order_ID, Order_Date FROM orders;
      `);

      const results = [];

      for (const order of orders) {
        const { Order_ID, Order_Date } = order;
        let totalPrice = 0.0;
        const items = [];

        
        const [tickets] = await pool.promise().query(`
          SELECT tp.price, tp.ticket_person, a.Attraction_Name
          FROM ticket t
          JOIN ticket_price tp ON t.Ticket_Price_ID = tp.Price_ID
          JOIN attraction a ON tp.Attraction_ID = a.Attraction_ID
          WHERE t.Order_ID = ?;
        `, [Order_ID]);

        for (const t of tickets) {
          items.push({
            Type: "Ticket",
            Person: t.ticket_person,
            Attraction: t.Attraction_Name,
            Price: parseFloat(t.price)
          });
          totalPrice += parseFloat(t.price);
        }

        
        const [merch] = await pool.promise().query(`
          SELECT m.Item_Name, m.Item_Price
          FROM single_item si
          JOIN merchandise m ON si.merch_ID = m.Merchandise_ID
          WHERE si.order_ID = ?;
        `, [Order_ID]);

        for (const m of merch) {
          items.push({
            Type: "Merchandise",
            Name: m.Item_Name,
            Price: parseFloat(m.Item_Price)
          });
          totalPrice += parseFloat(m.Item_Price);
        }

        results.push({
          Order_ID,
          Order_Date,
          Total_Price: parseFloat(totalPrice.toFixed(2)),
          Items: items
        });
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    } catch (error) {
      console.error(" Error fetching order summaries:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch order summaries" }));
    }
  },
};

export default orderSummaryController;

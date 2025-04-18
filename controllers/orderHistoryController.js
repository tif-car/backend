import pool from "../db.js";

const orderHistoryController = {
  getOrderHistory: async (req, res) => {
    console.log("📥 Incoming POST request to /api/order-history");

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const visitorId = parseInt(data.visitorId);
        console.log("🧾 Parsed visitor ID:", visitorId);

        if (!visitorId || isNaN(visitorId)) {
          console.warn("⚠️ Invalid visitor ID:", data.visitorId);
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Invalid visitor ID" }));
        }

        const conn = await pool.promise().getConnection();

        try {
          const [orders] = await conn.query(
            `SELECT Order_ID, Order_Date, Discount_Applied FROM orders WHERE Visitor_ID = ?`,
            [visitorId]
          );

          const orderHistory = [];

          for (const order of orders) {
            const { Order_ID, Order_Date, Discount_Applied } = order;
            let totalPrice = 0;

            // ✅ JOIN ticket_person to get readable person type
            const [ticketRows] = await conn.query(
              `SELECT p.ticket_person AS person_type, tp.price, a.Attraction_Name
               FROM ticket t
               JOIN ticket_price tp ON t.Ticket_Price_ID = tp.Price_ID
               JOIN attraction a ON tp.Attraction_ID = a.Attraction_ID
               JOIN ticket_person p ON tp.ticket_Person = p.PersonType_ID
               WHERE t.Order_ID = ? AND t.Visitor_ID = ?`,
              [Order_ID, visitorId]
            );

            const ticketMap = {};
            for (const row of ticketRows) {
              const key = `${row.person_type}-${row.Attraction_Name}`;
              ticketMap[key] = ticketMap[key] || {
                person_type: row.person_type,
                attraction: row.Attraction_Name,
                quantity: 0,
                price: parseFloat(row.price)
              };
              ticketMap[key].quantity++;
              totalPrice += parseFloat(row.price);
            }

            const tickets = Object.values(ticketMap);

            const [merchRows] = await conn.query(
              `SELECT m.Item_Name AS name, m.Item_Price AS price
               FROM single_item s
               JOIN merchandise m ON s.merch_ID = m.Merchandise_ID
               WHERE s.order_ID = ?`,
              [Order_ID]
            );

            const merchMap = {};
            for (const row of merchRows) {
              merchMap[row.name] = merchMap[row.name] || {
                name: row.name,
                quantity: 0,
                price: parseFloat(row.price)
              };
              merchMap[row.name].quantity++;
              totalPrice += parseFloat(row.price);
            }

            const merchandise = Object.values(merchMap);

            // ✅ Tax + subtotal breakdown
            const discountMultiplier = Discount_Applied ? (1 - Discount_Applied / 100) : 1;
            const subtotal = totalPrice * discountMultiplier;
            const taxRate = 0.0825;
            const tax = subtotal * taxRate;
            const finalPrice = parseFloat((subtotal + tax).toFixed(2));

            orderHistory.push({
              order_id: Order_ID,
              date: Order_Date.toISOString().split("T")[0],
              subtotal: subtotal.toFixed(2),
              tax: tax.toFixed(2),
              total: finalPrice,
              discount: Discount_Applied || 0,
              tickets: tickets.length > 0 ? tickets : undefined,
              merchandise: merchandise.length > 0 ? merchandise : undefined,
            });
          }

          console.log("✅ Sending order history:", orderHistory.length, "orders");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(orderHistory));
        } catch (error) {
          console.error("❌ Failed to fetch order history:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        } finally {
          conn.release();
        }
      } catch (parseError) {
        console.error("❌ Failed to parse JSON body:", parseError);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });

    req.on("error", (err) => {
      console.error("❌ Request error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Stream error" }));
    });
  }
};

export default orderHistoryController;





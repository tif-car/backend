import vendorandmerchsalesreportController from '../controllers/vendorandmerchsalesreportController.js';

const vendorandmerchsalesreportRoutes = {
    "/api/vendorandmerchsalesreport": (req, res) => {
        if (req.method === "POST") {
            let body = "";
            
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                try {
                    req.body = JSON.parse(body);
                } catch (error) {
                    req.body = {};
                }
                
                vendorandmerchsalesreportController.getReport(req, res);
            });
        } 
        else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    }
};

export default vendorandmerchsalesreportRoutes; 
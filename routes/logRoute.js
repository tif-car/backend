import animalFeedingController from '../controllers/animalFeeding.js';

/*
Endpoints Available:
- `POST /api/feeding/employeeFeedingLogView`: Fetches all feeding logs from the FEEDINGLOG_View, frontend sends Employee_ID to backend.
*/

const feedingLogRoutes = {
    "/api/feeding/details": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req,res, animalFeedingController.getFeedingDetails);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },

    "/api/feeding/form-info": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req,res, animalFeedingController.getFeedingFormInfo);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },

    "/api/feeding/create": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req,res, animalFeedingController.createFeedingLog);
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },

    "/api/employeeFeedingLogView": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.employeeFeedingLogView)
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },

    "/api/editFeedingLog": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.editFeedingLog)
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },
    "/api/deleteFeedingLog": (req, res) => {
        if (req.method === "POST") {
            handleRequestBody(req, res, animalFeedingController.deleteFeedingLog)
        } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method Not Allowed. Use POST." }));
        }
    },
};

// Helper function to parse request body and call the appropriate controller
function handleRequestBody(req, res, callback) {
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
        callback(req, res);
    });
}

export default feedingLogRoutes;
 
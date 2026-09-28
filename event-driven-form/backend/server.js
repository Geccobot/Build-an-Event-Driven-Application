require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const crypto = require("crypto");

const {
    sendMessage,
    logToCloudWatch,
    LOG_GROUPS,
} = require("./aws");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Store connected WebSocket clients
const clients = new Set();

// WebSocket server
const wss = new WebSocket.Server({
  port: WEBSOCKET_PORT,
});

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  clients.add(ws);

  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Connected to the real-time server.",
    })
  );

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    clients.delete(ws);
  });
});

// Send a message to every connected client
function broadcast(message) {
  const data = JSON.stringify(message);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

// Form submission endpoint
app.post("/submit-form", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email, and message are required.",
        });
    }

    const submission = {
        id: crypto.randomUUID(),
        name,
        email,
        message,
        submittedAt: new Date().toISOString(),
    };

    try {
        await sendMessage(submission);

        console.log("Form submission sent to SQS:", submission);

        // Log the form submission to CloudWatch
        await logToCloudWatch(
            LOG_GROUPS.submissions,
            "form-submissions",
            {
                event: "form-submitted",
                submissionId: submission.id,
                name: submission.name,
                email: submission.email,
                submittedAt: submission.submittedAt,
            }
        );

        broadcast({
            type: "form-queued",
            message: `Your form has been queued for processing, ${name}.`,
        });      

        res.status(200).json({
            success: true,
            message: "Form submitted and queued for processing.",
        });

    } catch (error) {
        console.error("Error sending message to SQS:", error);

        res.status(500).json({
            success: false,
            message: "Failed to queue form submission.",
        });
    }
});

// Internal endpoint for worker notifications

app.post("/internal/notify", (req, res) => {
    const { submissionId, name, status, message } = req.body;

    console.log("Worker notification received:", {
        submissionId,
        name,
        status,
        message,
    });

    broadcast({
        type: "processing-update",
        submissionId,
        status,
        message,
    });

    res.status(200).json({
        success: true,
    });
});

// Start Express
server.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${WEBSOCKET_PORT}`);
});
require("dotenv").config();

async function notifyServer(submission) {
    try {
        const response = await fetch("http://localhost:3000/internal/notify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                submissionId: submission.id,
                name: submission.name,
                status: "processed",
                message: `Your submission has been processed successfully, ${submission.name}.`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        console.log("WebSocket notification sent to server.");
    } catch (error) {
        console.error("Failed to notify server:", error);
    }
}

const {
    receiveMessages,
    deleteMessage,
    logToCloudWatch,
    LOG_GROUPS,
} = require("./aws");;

async function processMessage(message) {
    try {
        const submission = JSON.parse(message.Body);

        console.log("Processing form submission:");
        console.log(submission);

        // Log that processing has started
        await logToCloudWatch(
            LOG_GROUPS.processing,
            "processing-events",
            {
                event: "processing-started",
                submissionId: submission.id,
                name: submission.name,
                timestamp: new Date().toISOString(),
            }
        );

        // Simulate processing work
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(
            `Successfully processed submission ${submission.id}`
        );

        // Log successful processing
        await logToCloudWatch(
            LOG_GROUPS.processing,
            "processing-events",
            {
                event: "processing-completed",
                submissionId: submission.id,
                name: submission.name,
                timestamp: new Date().toISOString(),
            }
        );

        await notifyServer(submission);

        return true;

    } catch (error) {
        console.error("Error processing message:", error);

        await logToCloudWatch(
            LOG_GROUPS.processing,
            "processing-errors",
            {
                event: "processing-failed",
                error: error.message,
                timestamp: new Date().toISOString(),
            }
        );

        return false;
    }
}

async function pollQueue() {
    console.log("Worker started.");
    console.log("Waiting for messages...");

    while (true) {
        try {
            const messages = await receiveMessages();

            if (messages.length === 0) {
                continue;
            }

            for (const message of messages) {
                console.log("\nReceived message from SQS.");

                const processed = await processMessage(message);

                if (processed) {
                    await deleteMessage(message.ReceiptHandle);

                    console.log("Message deleted from SQS.");
                } else {
                    console.log(
                        "Message was not deleted because processing failed."
                    );
                }
            }

        } catch (error) {
            console.error("Error polling SQS:", error);

            // Prevent the worker from hammering AWS if something goes wrong.
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

pollQueue();
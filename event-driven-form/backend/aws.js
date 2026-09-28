require("dotenv").config();

const {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

const {
    CloudWatchLogsClient,
    CreateLogStreamCommand,
    DescribeLogStreamsCommand,
    PutLogEventsCommand,
} = require("@aws-sdk/client-cloudwatch-logs");

const sqs = new SQSClient({
    region: process.env.AWS_REGION,
});

const cloudWatchLogs = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
});

const queueUrl = process.env.SQS_QUEUE_URL;

if (!queueUrl) {
    throw new Error("SQS_QUEUE_URL is not configured in .env");
}

// CloudWatch log groups
const LOG_GROUPS = {
    submissions: "/event-driven-form/submissions",
    sqs: "/event-driven-form/sqs",
    processing: "/event-driven-form/processing",
};

// Create a log stream if it doesn't already exist
async function ensureLogStream(logGroupName, logStreamName) {
    const response = await cloudWatchLogs.send(
        new DescribeLogStreamsCommand({
            logGroupName,
            logStreamNamePrefix: logStreamName,
        })
    );

    const streamExists = response.logStreams?.some(
        (stream) => stream.logStreamName === logStreamName
    );

    if (!streamExists) {
        await cloudWatchLogs.send(
            new CreateLogStreamCommand({
                logGroupName,
                logStreamName,
            })
        );
    }
}

// Write an event to CloudWatch Logs
async function logToCloudWatch(logGroupName, logStreamName, message) {
    try {
        await ensureLogStream(logGroupName, logStreamName);

        await cloudWatchLogs.send(
            new PutLogEventsCommand({
                logGroupName,
                logStreamName,
                logEvents: [
                    {
                        timestamp: Date.now(),
                        message: JSON.stringify(message),
                    },
                ],
            })
        );
    } catch (error) {
        console.error("CloudWatch logging error:", error);
    }
}

// SQS: send message
async function sendMessage(message) {
    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
    });

    const response = await sqs.send(command);

    await logToCloudWatch(
        LOG_GROUPS.sqs,
        "send-message",
        {
            event: "SQS message sent",
            messageId: response.MessageId,
            submissionId: message.id,
            timestamp: new Date().toISOString(),
        }
    );

    return response;
}

// SQS: receive messages
async function receiveMessages() {
    const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 30,
    });

    const response = await sqs.send(command);

    return response.Messages || [];
}

// SQS: delete message
async function deleteMessage(receiptHandle) {
    const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
    });

    return await sqs.send(command);
}

module.exports = {
    sendMessage,
    receiveMessages,
    deleteMessage,
    logToCloudWatch,
    LOG_GROUPS,
};
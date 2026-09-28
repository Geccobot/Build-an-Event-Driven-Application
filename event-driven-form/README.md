# Event-Driven Form Application

A full-stack event-driven form application built with **Node.js, Express, AWS SQS, AWS CloudWatch Logs, and WebSockets**.

The application demonstrates how a form submission can be placed onto an AWS SQS queue, processed asynchronously by a worker, logged to CloudWatch, and reported back to the user in real time through a WebSocket connection.

---

## Architecture

```text
                         ┌──────────────────┐
                         │     Frontend     │
                         │   HTML / CSS /   │
                         │    JavaScript    │
                         └────────┬─────────┘
                                  │
                             HTTP POST
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Express      │
                         │      API         │
                         └────────┬─────────┘
                                  │
                           SendMessage
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     AWS SQS      │
                         │      Queue       │
                         └────────┬─────────┘
                                  │
                         ReceiveMessage
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Node.js Worker  │
                         │   Processing     │
                         └────────┬─────────┘
                                  │
                         Processing complete
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Express      │
                         │   Notification   │
                         └────────┬─────────┘
                                  │
                              WebSocket
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Browser      │
                         │ Real-time Update │
                         └──────────────────┘


       ┌─────────────────────────────────────────────┐
       │              AWS CloudWatch Logs            │
       │                                             │
       │  /event-driven-form/submissions            │
       │  /event-driven-form/sqs                     │
       │  /event-driven-form/processing             │
       └─────────────────────────────────────────────┘
```

---

## Features

- HTML/CSS/JavaScript frontend form
- Express REST API
- AWS SQS message queue
- Asynchronous Node.js worker
- WebSocket real-time communication
- AWS CloudWatch logging
- Separate CloudWatch log groups for:
  - Form submissions
  - SQS events
  - Processing events
- AWS IAM permissions with least-privilege access for application operations
- Environment-based configuration using `.env`

---

## Technologies

### Application

- Node.js
- Express
- WebSockets
- JavaScript
- HTML
- CSS

### AWS

- Amazon SQS
- Amazon CloudWatch Logs
- AWS IAM
- AWS SDK for JavaScript v3

---

## Project Structure

```text
event-driven-form/
│
├── backend/
│   ├── aws.js
│   ├── server.js
│   └── worker.js
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Backend Files

**`server.js`**

Runs the Express HTTP server and WebSocket server. It receives form submissions, sends them to SQS, and broadcasts processing updates to connected clients.

**`worker.js`**

Continuously polls the SQS queue, processes incoming form submissions, logs processing events, and notifies the Express server when processing is complete.

**`aws.js`**

Contains AWS SDK functionality for interacting with SQS and CloudWatch Logs.

### Frontend Files

**`index.html`**

Contains the form interface and status displays.

**`app.js`**

Handles form submission and WebSocket communication.

**`style.css`**

Provides the application's visual styling.

---

## AWS Configuration

The application uses the following AWS resources.

### SQS

Queue:

```text
event-driven-form-queue
```

The queue is used to decouple form submission from processing.

The Express API sends form submissions to SQS, while the worker independently polls the queue for messages.

### CloudWatch Logs

The application uses three log groups:

```text
/event-driven-form/submissions
/event-driven-form/sqs
/event-driven-form/processing
```

These provide visibility into different stages of the event-driven workflow.

### IAM

The application uses a dedicated IAM user rather than AWS root credentials.

The IAM permissions allow the application to:

- Send SQS messages
- Receive SQS messages
- Delete processed SQS messages
- Read SQS queue attributes
- Create CloudWatch log groups and streams
- Write CloudWatch log events

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
AWS_REGION=us-east-1
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/YOUR_ACCOUNT_ID/event-driven-form-queue
CLOUDWATCH_LOG_GROUP=/event-driven-form
CLOUDWATCH_LOG_STREAM=application
WEBSOCKET_PORT=3001
```

Replace `YOUR_ACCOUNT_ID` with the AWS account ID associated with your SQS queue.

### AWS Credentials

AWS credentials should **not** be stored in `.env` or committed to GitHub.

The AWS SDK uses the AWS credential configuration provided by the AWS CLI.

Verify your credentials with:

```bash
aws sts get-caller-identity
```

---

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

The project uses the following primary dependencies:

```text
@aws-sdk/client-sqs
@aws-sdk/client-cloudwatch-logs
express
ws
dotenv
```

---

## Running the Application

The application requires two Node.js processes: the Express/WebSocket server and the SQS worker.

### Start the backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

The WebSocket server runs on:

```text
ws://localhost:3001
```

### Start the worker

In a second terminal:

```bash
npm run worker
```

The worker will continuously poll the SQS queue for new messages.

### Open the application

Visit:

```text
http://localhost:3000
```

---

## Event Flow

When a user submits the form, the following sequence occurs:

### 1. Form submission

The browser sends the form data to:

```text
POST /submit-form
```

### 2. Message creation

The Express server creates a submission object containing:

- Submission ID
- Name
- Email
- Message
- Submission timestamp

### 3. SQS

The submission is serialized as JSON and sent to the AWS SQS queue.

### 4. CloudWatch

The submission and SQS activity are logged to CloudWatch.

### 5. Worker

The separate worker process polls SQS and receives the message.

### 6. Processing

The worker simulates asynchronous processing and records processing events in CloudWatch.

### 7. Notification

After successful processing, the worker notifies the Express server.

### 8. WebSocket

The Express server broadcasts a WebSocket message to connected clients.

### 9. Frontend

The browser receives the WebSocket event and updates the status displayed to the user.

### 10. SQS cleanup

After successful processing, the worker deletes the message from the SQS queue.

---

## CloudWatch Events

The application records events in three separate CloudWatch log groups.

### Submissions

```text
/event-driven-form/submissions
```

Records when a form is submitted and queued.

Example:

```json
{
  "event": "form-submitted",
  "submissionId": "example-id",
  "name": "Austin",
  "email": "example@email.com",
  "submittedAt": "2026-09-28T01:20:14.001Z"
}
```

### SQS

```text
/event-driven-form/sqs
```

Records messages sent to the SQS queue.

Example:

```json
{
  "event": "SQS message sent",
  "messageId": "example-message-id",
  "submissionId": "example-submission-id",
  "timestamp": "2026-09-28T01:20:14.001Z"
}
```

### Processing

```text
/event-driven-form/processing
```

Records worker processing activity.

Examples include:

```text
processing-started
processing-completed
```

Failed processing attempts are also recorded.

---

## Testing

The application can be tested by submitting a form through:

```text
http://localhost:3000
```

A successful submission should produce the following behavior:

```text
Submitting...
      ↓
Form queued for processing
      ↓
Worker receives SQS message
      ↓
Submission processed
      ↓
WebSocket notification
      ↓
Processing completed message
```

The worker terminal should also show the message being received, processed, and deleted.

CloudWatch should contain corresponding events in all three log groups.

---

## Security Considerations

- AWS credentials are not stored in the project.
- `.env` is excluded from Git using `.gitignore`.
- AWS root credentials are not used by the application.
- A dedicated IAM user is used for AWS CLI/application access.
- SQS permissions are limited to the queue used by this application.
- CloudWatch permissions are limited to the application's logging resources where possible.

---

## Learning Objectives

This project demonstrates several important concepts in cloud and distributed application development:

- Event-driven architecture
- Asynchronous processing
- Message queues
- AWS SQS
- Worker-based processing
- WebSocket communication
- Real-time frontend updates
- CloudWatch application monitoring
- IAM permissions
- AWS SDK integration
- Separation of application components

The project demonstrates how an application can decouple user requests from backend processing while still providing real-time feedback to users.

---

## Author

Built as an event-driven application project using Node.js and AWS.
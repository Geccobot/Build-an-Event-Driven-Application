# Assignment: Building an Event-Driven Application

## Introduction

In this assignment, we will build a real-time form submission system using AWS SQS (Simple Queue Service), CloudWatch Logs, and WebSockets. This system decouples the frontend and backend, processes form submissions asynchronously, and provides real-time updates to users. By completing this assignment, you will practice integrating AWS services into a full-stack application while understanding how queues, logging, and real-time communication work together in distributed systems. These skills are essential for building scalable and robust applications that can handle asynchronous workflows efficiently.

----

## **Working with Dev Container**

To complete this assignment in a reliable and fully configured environment, please refer to the instructions in the file: **`README-devcontainer.md`**. This guide walks you through opening the assignment in **Visual Studio Code** using a **Dev Container**, which automatically installs all necessary Python libraries and tools. Following that setup ensures that the notebook runs smoothly without manual configuration or missing dependencies. Make sure to open the **main assignment folder** in VS Code and follow the steps outlined in the Dev Container guide before starting the notebook.

-----

## Starter Files

The initial code is available inside the `start` folder under the `code` folder associated with this exercise.

---

## Requirements

We'll be working with AWS SQS, CloudWatch Logs, and WebSockets to develop our event-driven application. Here's what we need to accomplish:

### Set Up the Development Environment

We need to:

- Sign up for an AWS account at [AWS Console](https://aws.amazon.com/).
- Install and configure the AWS CLI.
- Install Node.js and npm if not already installed.

Additionally, install the following dependencies:

```bash
npm install @aws-sdk/client-sqs @aws-sdk/client-cloudwatch-logs ws express
```

### Build the Core Features

We need to implement the following functionalities:

1. **AWS SQS Integration:**  
   
   - Create and configure an SQS queue to decouple the backend and worker processes.  
   - Send form submission data from the backend API to the SQS queue.  
   - Ensure proper error handling when sending messages to the queue.

2. **CloudWatch Logs:**  
   
   - Configure CloudWatch Logs to monitor events in the system.  
   - Log all form submissions, SQS notifications, and processing events to separate log groups.  
   - Ensure proper IAM permissions are set up for logging.

3. **Backend API:**  
   
   - Build a backend API using Node.js and Express that handles form submissions, sends messages to SQS, logs events to CloudWatch, and establishes WebSocket connections.  
   - Implement an endpoint (`/submit-form`) to process form data and notify users via WebSocket.

4. **Worker Script:**  
   
   - Create a worker script to poll the SQS queue for messages.  
   - Process form data, log events to CloudWatch, and send real-time updates to users via WebSocket.  
   - Delete processed messages from the queue after successful handling.

5. **Frontend Application:**  
   
   - Develop a frontend interface that allows users to submit forms and receive real-time status updates via WebSocket.  
   - Ensure proper error handling and user feedback mechanisms.

6. **Real-Time Communication with WebSockets:**  
   
   - Establish WebSocket connections between the backend and frontend to enable real-time updates.  
   - Notify users about the status of their form submissions in real time.

### Test the Application

We need to verify:

- Users can submit forms successfully via the frontend.  
- Form submissions are logged in CloudWatch Logs.  
- The worker processes messages from the SQS queue and sends real-time updates to users via WebSocket.  
- The app runs smoothly locally and integrates seamlessly with AWS services.

---

## Deliverables

The deliverable of this exercise is a working event-driven application that meets all the requirements above. We need to submit:

- The public GitHub repository containing the source code.  
- Screenshots showing:  
  - Successful form submission via the frontend.  
  - Real-time updates received by the user via WebSocket.  
  - Logs captured in CloudWatch for form submissions, SQS notifications, and processing events.  
- A brief README file explaining how to set up and run the application locally, including AWS configuration and environment variable setup.

---

## Conclusion

Building a real-time form submission system using AWS SQS, CloudWatch Logs, and WebSockets is an excellent way to practice backend development, distributed system design, and real-time communication. By completing this assignment, you've learned how to decouple services, process tasks asynchronously, and provide real-time feedback to users. These skills are essential for building scalable and robust applications in modern cloud-based architectures.

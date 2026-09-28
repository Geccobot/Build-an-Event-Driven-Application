const form = document.getElementById("form");
const status = document.getElementById("status");
const connectionStatus = document.getElementById("connection-status");

// Connect to WebSocket server
const socket = new WebSocket("ws://localhost:3001");

socket.addEventListener("open", () => {
    console.log("WebSocket connected");

    connectionStatus.textContent = "WebSocket connected.";
});

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    console.log("WebSocket message:", data);

    if (data.type === "connected") {
        connectionStatus.textContent = data.message;
    }

    if (data.type === "form-queued") {
        status.textContent = data.message;
    }

    if (data.type === "processing-update") {
        status.textContent = data.message;
    }
});

socket.addEventListener("close", () => {
    connectionStatus.textContent = "WebSocket disconnected.";
});

socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);

    connectionStatus.textContent = "WebSocket connection error.";
});

// Handle form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };

    status.textContent = "Submitting...";

    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        console.log("API response:", data);

        status.textContent = data.message;

        form.reset();

    } catch (error) {
        console.error("Submission error:", error);

        status.textContent = `Error: ${error.message}`;
    }
});
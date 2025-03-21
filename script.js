const localAPI = "http://localhost:8080/api"; // Local API URL 
const azureAPI = "https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api"; // Azure backend URL

// Dynamically detect the environment
const API_URL = window.location.hostname === "localhost" ? localAPI : azureAPI;

// **Function to log in a user**
function loginUser() {
    const email = "john.doe@email.com";  // Hardcoded test email
    const password = "hashed_password1"; // Hardcoded test password

    const requestURL = `${API_URL}/login`;

    console.log(`Attempting login with: ${email}`);

    fetch(requestURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }) // Send hardcoded credentials
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Login error: ${data.error}`);
            document.getElementById("output").innerText = `Error: ${data.error}`;
        } else {
            console.log("Login successful!");
            document.getElementById("output").innerText = `Login successful! Role: ${data.role_type}`;
            localStorage.setItem("userEmail", email); // Store email for role checking

            // **Fetch user role after successful login**
            fetchRole(email);
        }
    })
    .catch(error => {
        console.error("Error logging in:", error);
        document.getElementById("output").innerText = "Login failed. Please try again.";
    });
}

// **Function to fetch user role**
function fetchRole(email) {
    if (!email) {
        email = localStorage.getItem("userEmail"); // Retrieve from storage if missing
        if (!email) {
            console.error("fetchRole() Error: No email provided.");
            document.getElementById("output").innerText = "Error: No email found.";
            return;
        }
    }

    const requestURL = `${API_URL}/getUserRole`; // Backend route

    console.log(`Fetching role for: ${email}`);

    fetch(requestURL, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email }) // Send email in the body
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Error fetching role: ${data.error}`);
            document.getElementById("output").innerText = `Error: ${data.error}`;
        } else {
            console.log(`Role retrieved: ${data.role_types}`);
            document.getElementById("output").innerText = `Role for ${email}: ${data.role_types}`;
        }
    })
    .catch(error => {
        console.error("Error fetching role:", error);
        document.getElementById("output").innerText = "Failed to retrieve role.";
    });
}

// Run `loginUser()` automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loginUser();
});

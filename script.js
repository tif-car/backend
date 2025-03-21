const localAPI = "http://localhost:8080/api"; // Local API URL 
const azureAPI = "https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api"; // Azure backend URL

// Dynamically detect the environment
const API_URL = window.location.hostname === "localhost" ? localAPI : azureAPI;

// For static testing
function loginUser() {
    const email = "john.doe@email.com";  // Hardcoded test email
    const password = "hashed_password1"; // Hardcoded test password

    const requestURL = `${API_URL}/login`;

    console.log(`Logging in with: ${email}`);

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
            console.log("Login successful, fetching role...");
            document.getElementById("output").innerText = `Login successful! Role: ${data.role_type}`;
            localStorage.setItem("userRole", data.role_type);

            // Fetch user role after successful login
            fetchRole(email);
        }
    })
    .catch(error => {
        console.error("Error logging in:", error);
        document.getElementById("output").innerText = "Login failed. Please try again.";
    });
}

function fetchRole(email) {
    if (!email) {
        console.error("fetchRole() Error: No email provided.");
        return;
    }

    // Send email in the query string using a GET request
    const requestURL = `${API_URL}/loginUser?email=${encodeURIComponent(email)}`;

    console.log(`Fetching role from: ${requestURL}`); // Debugging log

    fetch(requestURL, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Error fetching role: ${data.error}`);
            document.getElementById("output").innerText = `Error: ${data.error}`;
        } else {
            document.getElementById("output").innerText = `Role for ${email} is: ${data.role_type}`;
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Run loginUser() automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loginUser();
});

/*for testing
http://192.168.1.210:8080/api/loginUser?email=john.doe@email.com
*/
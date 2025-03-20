
//additional backend logic and for frontend fetch requests.
const localAPI = "http://localhost:8080/api"; // Local API URL
const azureAPI = "https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api"; // Azure backend URL

// Dynamically detect the environment
const API_URL = window.location.hostname === "localhost" ? localAPI : azureAPI;

/*
//email for the request
function fetchRole() {
    const email = document.getElementById("emailInput").value.trim();
    if (!email) {
        alert("Please enter an email.");
        return;
    }

    const requestURL = `${API_URL}/getUserRole?email=${encodeURIComponent(email)}`;

    fetch(requestURL, { headers: { "Accept": "application/json" } })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("output").innerText = `Error: ${data.error}`;
            } else {
                document.getElementById("output").innerText = `Role for ${email} is: ${data.role_type}`;
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

*/

// Automatically fetch role when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const email = "john.doe@email.com"; // Manually set the email here

    const emailInput = document.getElementById("emailInput");
    if (emailInput) emailInput.value = email; // Pre-fill the input field

    const requestURL = `${API_URL}/getUserRole?email=${encodeURIComponent(email)}`;

    fetch(requestURL, { headers: { "Accept": "application/json" } })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("output").innerText = `Error: ${data.error}`;
            } else {
                document.getElementById("output").innerText = `Role for ${email} is: ${data.role_type}`;
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});


// Call the function when the page loads
//fetchRole();


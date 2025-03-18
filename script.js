//To Fetch data from the backend API
/*
async function fetchData() {
    try {
       //new one that needs to be applied.
       //const response = await fetch('https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api/data');
        
       //works but is empty
       const response = await fetch('http://localhost:3000/api/data'); // Fetch from backend
        const data = await response.json();

        const list = document.getElementById('data-list'); // Make sure your HTML has <ul id="data-list">
        list.innerHTML = ""; // Clear old data

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id} - Name: ${item.name}`; // Modify based on DB columns
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Run fetchData() when the page loads
window.onload = fetchData;

*/

//Default domain:  zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net
// To Fetch data from the backend API
async function fetchData() {
    try {
        // ✅ Fetch from the deployed Azure backend
        const response = await fetch('https://zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net/api/data', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // ✅ Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Check if data is empty
        if (data.length === 0) {
            console.warn("⚠ No data found in the database.");
        }

        // ✅ Make sure your HTML has <ul id="data-list">
        const list = document.getElementById('data-list');
        if (!list) {
            throw new Error("⚠ Element with ID 'data-list' not found in HTML.");
        }

        list.innerHTML = ""; // Clear old data

        // ✅ Dynamically create list items
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id} - Name: ${item.name}`; // Modify based on DB columns
            list.appendChild(li);
        });

        console.log("✅ Data successfully fetched and displayed.");

    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
}

// Run fetchData() when the page loads
window.onload = fetchData;

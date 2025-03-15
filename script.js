//To Fetch data from the backend API
async function fetchData() {
    try {
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

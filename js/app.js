// Main application logic

console.log("Smart School App Initialized");

// DOM Ready event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded");

    // Example: Add event listeners or fetch initial data here
    const maintenanceForm = document.getElementById('maintenance-form');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', handleMaintenanceSubmit);
    }

    // Load initial maintenance issues (placeholder for now)
    loadMaintenanceIssues();
});

// --- Maintenance Form Handling ---
function handleMaintenanceSubmit(event) {
    event.preventDefault(); // Prevent default form submission (page reload)

    const form = event.target;
    const formData = new FormData(form);

    const issueData = {
        location: formData.get('location'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        status: 'submitted', // Add a default status
        timestamp: new Date().toISOString()
    };

    console.log("Maintenance Request Submitted:", issueData);

    // --- Send data to backend API ---
    fetch('http://localhost:3000/api/maintenance', { // Use full URL for local dev
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData) // Send the structured data
    })
    .then(response => {
        if (!response.ok) {
            // Handle HTTP errors (e.g., 400, 500)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Add the new issue (returned from server with ID) to the list visually
        addIssueToList(data, true); // Add to top as it's new
        form.reset(); // Clear the form only on success
        alert('Request submitted successfully!');
    })
    .catch((error) => {
        console.error('Error submitting maintenance request:', error);
        alert('Failed to submit request. Check console for details and ensure backend server is running.');
    });

    // Remove temporary local handling
    // addIssueToList(issueData, true); // Add to list locally (temporary)
    // form.reset();
    // alert('Request submitted (logged to console for now)!');
}

// --- Maintenance List Handling ---

// Function to load issues from the backend
function loadMaintenanceIssues() {
    const issueList = document.querySelector('#maintenance-list ul');
    if (!issueList) return;

    fetch('http://localhost:3000/api/maintenance') // GET request by default
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(issues => {
            console.log("Loaded issues:", issues);
            issueList.innerHTML = ''; // Clear placeholder/previous content
            if (issues.length === 0) {
                const noIssuesMsg = document.createElement('li');
                noIssuesMsg.textContent = 'No current issues reported.';
                noIssuesMsg.style.fontStyle = 'italic';
                issueList.appendChild(noIssuesMsg);
            } else {
                issues.forEach(issue => addIssueToList(issue)); // Add each issue
            }
        })
        .catch(error => {
            console.error('Error loading maintenance issues:', error);
            issueList.innerHTML = ''; // Clear placeholder
            const errorMsg = document.createElement('li');
            errorMsg.textContent = 'Error loading issues. Please ensure the backend server is running.';
            errorMsg.style.color = 'red';
            issueList.appendChild(errorMsg);
        });
}

// Function to add a single issue to the list (can be called after submit or load)
function addIssueToList(issue, isNew = false) {
    const issueList = document.querySelector('#maintenance-list ul');
    if (!issueList) return;

    // Remove the 'No current issues' message if it exists
    const noIssuesMsg = issueList.querySelector('li:only-child');
    if (noIssuesMsg && noIssuesMsg.textContent === 'No current issues reported.') {
        issueList.innerHTML = ''; 
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${issue.location}</strong> (${issue.priority}) - ${issue.status}<br>
        <em>${issue.description}</em>
        ${isNew ? '<small> (Submitted just now)</small>' : ''}
    `; // Basic display
    // TODO: Add status updates, timestamps, etc.

    // Add to the top of the list if new
    if (isNew) {
        issueList.insertBefore(listItem, issueList.firstChild);
    } else {
        issueList.appendChild(listItem);
    }
}

// Add functions for handling user interactions, API calls, etc.

// function exampleFunction() {
//     // ...
// } 
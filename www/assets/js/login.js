document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // Get form data
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // Make request to backend API
    fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            // If first login attempt fails, try association login
            return fetch("http://localhost:3000/associations/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
        }
        return response;
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to login");
        }
        return response.json();
    })
    .then(data => {
        // Check if login was successful
        if (data.message === 'Login successful') {
            // Save the username to localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("currentUser", data.role);

            // redirect according to user type
            if (data.role === "user") {
                window.location.href = "home_page_user.html";
            } else if (data.role === "association") {
                window.location.href = "home_page_association.html";
            }
        } else {
            // Unsuccessful login
            showError("Invalid username or password");
        }
    })
    .catch(error => {
        // Login error
        showError("Failed to login. Please try again later.");
        console.error("Login error:", error);
    });
});

function showError(message) {
    // Display error message to the user
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = "block"; 
}
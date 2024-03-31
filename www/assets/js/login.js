
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // Get form data
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // Make request to backend API
    fetch("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            // If first login attempt fails, try association login
            return fetch("/associations/login", {
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

            // Check if there is a redirect URL stored in sessionStorage
            const redirectURL = sessionStorage.getItem('redirectURL');
            if (redirectURL) {
                // Clear the redirect URL from sessionStorage
                sessionStorage.removeItem('redirectURL');
                // Redirect the user to the stored URL
                window.location.href = redirectURL;
            } else {
                // redirect according to user type
                if (data.role === "user") {
                    window.location.href = "assets/html/sadna_Home.html";
                } else if (data.role === "association") {
                    window.location.href = "assets/html/sadna_Home_Association.html";
                }
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
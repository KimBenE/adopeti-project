document.getElementById("userRegistrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // Get form data
    const formData = new FormData(event.target);
    const username = formData.get("user_name");
    const password = formData.get("password");
    const name = formData.get("name");
    const lastName = formData.get("last_name");
    const fullName = name+" "+lastName
    const residentialArea = formData.get("city");
    const emailAddress = formData.get("email");
    const familySituation = formData.get("family_status");
    const phone = formData.get("phone");
    const type = formData.get("user_type");
    const age = formData.get("age");

    // Make request to backend API
    fetch("http://adopeti.xyz:3000/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, type, fullName, familySituation, phone, emailAddress, age, residentialArea })
    })
    .then(response => {
        // Username already exist
        if (response.status == 409) {
            showError("Username already exists.", "username_error");
            console.error("Register error:", response.json());
        }
        // Register successful
        else if (response.status == 201){
            window.location.href = "../html/sadna_Login_Registered.html";
        }
        // Any other error
        else if (!response.ok){
            throw new Error("Failed to login "+response.json());
        }
    })
    .catch(error => {
        // Register error
        showError("Failed to register. Please try again later.", "error");
        console.error("Register error:", error);
    });
});

function showError(message, id) {
    // Display error message to the user
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block"; 

}
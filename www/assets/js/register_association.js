document.getElementById("associationRegistrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // Get form data
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const association_name = formData.get("association_name");
    const residentialArea = formData.get("city");
    const street_name = formData.get("street_name");
    const street_number = formData.get("street_number");
    const address = residentialArea+" "+street_name+" "+street_number;
    const emailAddress = formData.get("email");
    const phone = formData.get("phone");
    const surveyLink = null;

    // Make request to backend API
    fetch("http://adopeti.xyz:3000/associations/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password, association_name, address, phone, emailAddress, surveyLink })
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
            throw new Error("Failed to register "+response.json());
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
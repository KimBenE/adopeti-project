
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Retrieve form values
        var userName = document.getElementById('user_name').value.trim();
        var password = document.getElementById('password').value.trim();
        var name = document.getElementById('name').value.trim();
        var lastName = document.getElementById('last_name').value.trim();
        var city = document.getElementById('city').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var age = document.getElementById('age').value.trim();

        // Check if any field is empty
        if (!userName || !password || !name || !lastName || !city || !email || !phone || !age ) {
            alert('Please fill in all fields.');
            return;
        }

        // Validation for email format
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(emailRegex)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validation for phone format
        var phoneRegex = /^\d{3}-\d{7}$/;
        if (!phone.match(phoneRegex)) {
            alert('Please enter a valid phone number in the format 050-0000000.');
            return;
        }


        // Make request to backend API for registration
        fetch("/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username: userName, 
                password: password,
                association_name: association_name,
                city: city,
                street_name: street_name,
                street_number: street_number,
                email: email,
                phone: phone
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to register");
            }
            return response.json();
        })
        .then(data => {
            // Check if registration was successful
            if (data.message === 'Registration successful') {
                // Redirect to home page after successful registration
                window.location.href = "../sadna_Haome_Association.html";
            } else {
                // Unsuccessful registration
                showError("Failed to register. Please try again later.");
            }
        })
        .catch(error => {
            // Registration error
            showError("Failed to register. Please try again later.");
            console.error("Registration error:", error);
        });
    });
});

function showError(message) {
    // Display error message to the user
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = "block"; 
}


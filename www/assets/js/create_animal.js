
let encodedImages = [];

document.getElementById("createAnimalForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    try {
        // Get association details
        const { associationId, residentialArea } = await getAssociationDetails();

        // Get form data
        const formData = new FormData(event.target);
        const animalType = formData.get("animal_type").toLowerCase();
        const gender = formData.get("animal_gender").toLowerCase();
        const breed = selectedBreed = document.getElementById('breed').value;
        const age = formData.get("animalage");

        const selectedOption = document.querySelector('input[name="children"]:checked');
        const medicalHistorySelection = selectedOption.value;
        const name = formData.get("animalname");
        const description = formData.get("details_text");

        let medicalHistory = null;
        if (medicalHistorySelection === "Yes"){
            medicalHistory = formData.get("medical_issues_details_text");
        }

        // Make request to backend API
        const response = await fetch("/animals/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ associationId, animalType, gender, name, breed, age, medicalHistory, residentialArea, description, encodedImages})
        });

        // Handle response
        if (response.status == 409) {
            showError("Username already exists.", "username_error");
            console.error("Register error:", await response.json());
        } else if (response.status == 201) {
            const data = await response.json();

            window.location.href = "../html/sadna_Home_Association.html";
        } else if (!response.ok) {
            throw new Error("Failed to create animal " + await response.json());
        }
    } catch (error) {
        // Register error
        showError("Failed to register. Please try again later.", "error");
        console.error("Register error:", error);
    }
});

function showError(message, id) {
    // Display error message to the user
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block"; 
}

function checkFileSize(input) {
    const maxFileSize = 50 * 1024 * 1024;

    for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.size > maxFileSize) {
            alert("File size exceeds the maximum allowed size (10MB). Please choose a smaller file.");
            input.value = ''; 
            return;
        }
    }
}

async function getAssociationDetails() {
    try {
        // Get association details
        const response = await fetch(`/associations/${localStorage.getItem("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            // Association not found
            console.error("Association not found");
            throw new Error("Association not found");
        } else if (response.status === 200) {
            // Association found
            const data = await response.json();
            const associationId = data.AssociationID;
            const residentialArea = data.Area;
            return { associationId, residentialArea };
        } else {
            // Any other error
            const data = await response.json();
            throw new Error("Failed to find association: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


function handleImageUpload(event) {
    const files = event.target.files;

    // Clear existing encoded images
    encodedImages = [];

    // Loop through each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // Closure to capture the file information
        reader.onload = (function (file) {
            return function (e) {
                // Push base64 string to the global variable
                encodedImages.push(e.target.result.split(',')[1]);
            };
        })(file);

        // Read the image file as a data URL
        reader.readAsDataURL(file);
    }
}
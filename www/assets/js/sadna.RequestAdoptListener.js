document.getElementById("AdoptForm").addEventListener("submit",async function(event) {
    event.preventDefault(); 

    //get user data 
    const {UserID} =await getUserDetails();
    const {AssociationID} = await getAssociationID();
    const AnimalID = localStorage.getItem("AnimalID");
    const ApprovalStatus = "pending";
    // Get form data
    const formData = new FormData(event.target);
    const adopterRoutine = formData.get("routine")
    const houseType = formData.get("type_of_house")
    const tenantsType = formData.get("type_of_tenants")
    const selectedOption = document.querySelector('input[name="experience"]:checked');
    var experienceSelection = selectedOption.id;
    let experienceText = null;
    if (experienceSelection === "Yes"){
        experienceSelection="yes"
        experienceText = formData.get("experience_issues_details_text");
    }else{
        experienceSelection="no"
    }

    const checkboxContainer = document.getElementById('occupation');

    const checkboxes = checkboxContainer.querySelectorAll('.form-check-input');

    // String to store the occupation selections
    var occupationText = "";
    
    // Iterate over each checkbox
    checkboxes.forEach(checkbox => {
        // If checkbox is checked, add its value to the selectedCheckboxes array
        if (checkbox.checked) {
            occupationText =occupationText+checkbox.id+" " ;
        }
    });

    const RequestText = `Adopter routine: ${adopterRoutine}, House type: ${houseType}, Tenants: ${tenantsType}, Experience: ${experienceSelection}, Experience text: ${experienceText}, Occupation: ${occupationText}`
    
    // Make request to backend API
    fetch("/users/adopt-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({AnimalID, UserID, AssociationID, ApprovalStatus, RequestText })
    })
    .then(response => {

        // Register successful
        if (response.status == 200){
            window.location.href = "../html/sadna_Home.html";
        }
        // Any other error
        else if (!response.ok){
            throw new Error("Failed to create request "+response.json());
        }
    })
    .catch(error => {
        // Register error
        showError("Failed to submit request. Please try again later.", "error");
        console.error("request error:", error);
    });
});



async function getUserDetails() {
    try {
        // Get association details
        const response = await fetch(`/users/${localStorage.getItem("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            // Association not found
            console.error("User not found");
            throw new Error("User not found");
        } else if (response.status === 200) {
            // Association found
            const data = await response.json();
            const UserID = data.user.UserID;
            return { UserID};
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

async function getAssociationID() {
    const animalId = localStorage.getItem("AnimalID");
    try {
        // Get Animal details
        const response = await fetch("/animals/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ animalId })
        });
        if (response.status === 404) {
            // Animal not found
            console.error("Animal not found");
            throw new Error("Animal not found");
        } else if (response.status === 200) {
            // Animal found
            const data = await response.json();
            const AssociationID = data[0].AssociationID;
            return { AssociationID};
        } else {
            // Any other error
            const data = await response.json();
            throw new Error("Failed to find Animal: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

function showError(message, id) {
    // Display error message to the user
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block"; 

}
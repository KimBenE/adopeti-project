document.getElementById("GiveAwayForm").addEventListener("submit",async function(event) {
    event.preventDefault(); 

    //get user data 
    const {UserID,email,Phone} =await getUserDetails();
    // Get form data
    const contactdetails = email+" "+Phone
    const formData = new FormData(event.target);
    const AnimalType = formData.get("animal_type")
    const AnimalName= formData.get("animalname")
    const BreedName= formData.get("breedname")
    const AnimalAge= formData.get("DogAge")
    const selectedOption = document.querySelector('input[name="children"]:checked');
    var medicalHistorySelection = selectedOption.id;
    let medicalHistory = null;
    if (medicalHistorySelection === "Yes"){
        medicalHistorySelection="yes"
        medicalHistory = formData.get("medical_issues_details_text");
    }else{
        medicalHistorySelection="no"
    }

    const checkboxContainer = document.getElementById('reasons');

    const checkboxes = checkboxContainer.querySelectorAll('.form-check-input');

    // Array to store the selected checkboxes
    var reasonsForGivingAway = "";
    
    // Iterate over each checkbox
    checkboxes.forEach(checkbox => {
        // If checkbox is checked, add its value to the selectedCheckboxes array
        if (checkbox.checked) {
            reasonsForGivingAway =reasonsForGivingAway+checkbox.id+" " ;
        }
    });
    
    // Make request to backend API
    fetch("http://adopeti.xyz:3000/users/giveaway-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ UserID,AnimalType,contactdetails, AnimalName, BreedName, AnimalAge, medicalHistorySelection, medicalHistory, reasonsForGivingAway })
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
        const response = await fetch(`http://adopeti.xyz:3000/users/${localStorage.getItem("username")}`, {
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
            const  email = data.user.emailAddress;
            const  Phone = data.user.Phone;
            return { UserID,email,Phone};
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






function showError(message, id) {
    // Display error message to the user
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block"; 

}
function ValidateContactForm() {
    var isValid = true;

    // Check if "What are you doing in life?" is selected
    var workCheckbox = document.getElementById("work");
    var studentCheckbox = document.getElementById("student");
    var atHomeCheckbox = document.getElementById("at home");
    var otherCheckbox = document.getElementById("Other");
    if (!workCheckbox.checked && !studentCheckbox.checked && !atHomeCheckbox.checked && !otherCheckbox.checked) {
        alert("Please select what you are doing in life.");
        isValid = false;
    }

    // Check if "What type of house do you live in?" is selected
    var typeOfHouse = document.getElementById("type_of_house").value;
    if (typeOfHouse === "") {
        alert("Please select the type of house you live in.");
        isValid = false;
    }

    // Check if "Who are the tenants in the house?" is selected
    var typeOfTenants = document.getElementById("type_of_tenants").value;
    if (typeOfTenants === "") {
        alert("Please select who are the tenants in the house.");
        isValid = false;
    }

    // Check if "How many hours are you in your routine away from home?" is selected
    var routine = document.getElementById("routine").value;
    if (routine === "") {
        alert("Please select how many hours you are in your routine away from home.");
        isValid = false;
    }

    // Check if "Do you have experience with animals in the past?" is selected
    var experienceYesRadio = document.getElementById("Yes");
    var experienceNoRadio = document.getElementById("No");
    var experienceDetails = document.getElementById("experience_issues_details_text");
    if (experienceYesRadio.checked && experienceDetails.value === "") {
        alert("Please provide details of your experience with animals.");
        isValid = false;
    }



    // Check if all fields are filled out
    var allFieldsFilled = checkAllFieldsFilled();
    if (!allFieldsFilled) {
        alert("Please fill out all fields in the form.");
        isValid = false;
    }

    // Redirect the user if all fields are filled out
    if (isValid && allFieldsFilled) {
        window.location.href = "../html/sadna_RegistrationConfirmation.html";
    }

    return isValid;


    
}

function checkAllFieldsFilled() {
    var form = document.getElementById("Form");
    var inputs = form.querySelectorAll("input, select, textarea");

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.value === "" && input.required) {
            return false;
        }
    }

    return true;
}

function showNextQuestion() {
    document.getElementById('nextQuestion').style.display = 'block';
}

function hideNextQuestion() {
    document.getElementById('nextQuestion').style.display = 'none';
}

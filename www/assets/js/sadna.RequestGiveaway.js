function ValidateContactForm() {
    var isValid = true;

    // Check if animal name is filled out
    var animalName = document.getElementById("InputanimalName").value.trim();
    if (animalName === "") {
        alert("Please provide the animal's name.");
        isValid = false;
    }

    // Check if breed name is filled out
    var breedName = document.getElementById("InputbreedName").value.trim();
    if (breedName === "") {
        alert("Please provide the breed of the animal.");
        isValid = false;
    }

    // Check if animal type is selected
    var animalType = document.getElementById("animal_type").value;
    if (animalType === "") {
        alert("Please select the type of animal.");
        isValid = false;
    }

    // Check if age of the animal is filled out
    var animalAge = document.getElementById("DogAge").value.trim();
    if (animalAge === "") {
        alert("Please provide the age of the animal.");
        isValid = false;
    }

    // Check if at least one reason for giving away the animal is selected
    var characterCheckbox = document.getElementById("character");
    var medicalCheckbox = document.getElementById("medical");
    var residentsCheckbox = document.getElementById("residents");
    var abroadCheckbox = document.getElementById("abroad");
    var otherCheckbox = document.getElementById("Other");
    var dontSayCheckbox = document.getElementById("dont_say");
    if (!characterCheckbox.checked && !medicalCheckbox.checked && !residentsCheckbox.checked && !abroadCheckbox.checked && !otherCheckbox.checked && !dontSayCheckbox.checked) {
        alert("Please select at least one reason for giving away the animal.");
        isValid = false;
    }

    // Check if the animal has medical problems
    var medicalYesRadio = document.getElementById("Yes");
    var medicalNoRadio = document.getElementById("No");
    var medicalDetails = document.getElementById("medical_issues_details_text");
    if (medicalYesRadio.checked && medicalDetails.value === "") {
        alert("Please provide details of the animal's medical problems.");
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

function onAssociationKeyup(event) {
  
  document.getElementById("Div Already Filled").style.display = "none";
  document.getElementById("submit").style.display = "inline";
  document.getElementById("reset").style.display = "inline";


  let enteredAssociation = event.target.value.trim();
  if (enteredAssociation.trim().length <= 1)
  {
    return;
  }

  fetch("/users/checkIfFeedbackAlreadyFilled", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ signedin_username, enteredAssociation })
})
.then(response => {
  
    if (response.status == 600){
      //alert("You already filled this form ");;
      document.getElementById("Div Already Filled").style.display = "block";
      document.getElementById("submit").style.display = "none";
      document.getElementById("reset").style.display = "none";
    }
})
.catch(error => {
  alert("Failure in Server");
    
});

}


function ValidateContactForm() {
  var association = document.forms["formFeedbackAnswers"]["association"].value;
    if (association == "") {
      alert("Please enter the name of the association.");
      return false;
    }
  return true; 
}

// JavaScript code for resetting the form
document.getElementById("reset").addEventListener("click", function() {
  document.getElementById("Form").reset();
});


document.getElementsByTagName("body")[0].addEventListener("load", function(event) {
  alert("body onload");
});




document.getElementById("formFeedbackAnswers").addEventListener("submit", function(event) {
  event.preventDefault(); 

  // Get form data
  const formData = new FormData(event.target);
  const signedin_username = formData.get("signedin_username");
  const association = formData.get("association");
  const satisfaction_1 = formData.get("satisfaction_1");
  const satisfaction_2 = formData.get("satisfaction_2");
  const satisfaction_3 = formData.get("satisfaction_3");
  const satisfaction_4 = formData.get("satisfaction_4");
  const satisfaction_5 = formData.get("satisfaction_5");
  const satisfaction_6 = formData.get("satisfaction_6");
  const satisfaction_7 = formData.get("satisfaction_7");

  // Make request to backend API
  fetch("/users/addFeedbackAnswers", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ signedin_username, association, satisfaction_1, satisfaction_2, 
        satisfaction_3, satisfaction_4, satisfaction_5, satisfaction_6, satisfaction_7 })
  })
  .then(response => {
      // Feeedback added successfully
      if (response.status == 201){
          document.getElementById("status").innerText = "Feedback added";
      }
      // Any other error
      else {
        document.getElementById("status").innerText = "Failed to add feedback";
      }
      
  })
  .catch(error => {
    document.getElementById("status").innerText = "Failed to add feedback";
      
  });
});

function showError(message, id) {
  // Display error message to the user
  const errorElement = document.getElementById(id);
  errorElement.textContent = message;
  errorElement.style.display = "block"; 

}



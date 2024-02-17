$(document).ready(function(){
    $("#gif").hide();
  });


  
function ValidateContactForm()
{
    let name = document.Form.name;
    let email = document.Form.email;
    let phone = document.Form.phone;
    
    

    if (name.value === "")
    {
        window.alert("Please enter your name.");
        name.focus();
        return false;
    }


    if (email.value === "")
    {
        window.alert("Please enter a valid e-mail address.");
        email.focus();
        return false;
    }
    if (email.value.indexOf("@", 0) < 0)
    {
        window.alert("Please enter a valid e-mail address.");
        email.focus();
        return false;
    }
    if (email.value.indexOf(".", 0) < 0)
    {
        window.alert("Please enter a valid e-mail address.");
        email.focus();
        return false;
    }
    
    if (phone.value === "")
    {
        window.alert("Please enter your mobile number.");
        phone.focus();
        return false;
    }
    function validateAge(age) {
        // בדיקה אם ערך הגיל הוא מספר
        if (isNaN(age)) {
          window.alert("אנא הזן מספר גיל תקין");
          age.focus();
          return false;
        }
      
        // בדיקה אם ערך הגיל בטווח 0-30
        if (age < 1 || age > 30) {
          window.alert("הגיל חייב להיות בין 1 ל-30");
          age.focus();
          return false;
        }
      
        // הגיל תקין
        return true;}
        
      if (animalname.value === "")
      {
          window.alert("Please enter your animal name.");
          name.focus();
          return false;
      }
      if (breedname.value === "")
      {
          window.alert("Please enter your breed name.");
          name.focus();
          return false;
      }

    window.alert("Your details have been successfully sent");
    $("#gif").show();
    $("form input, form select, form textarea").prop("disabled", true);
    document.getElementById("reset").onclick=function(){
        $("#gif").hide();
    }
    return false;
    
    

    
}


function EnableDisable(chkbx)
{
    if(chkbx.checked === true)
    {
        document.Form.phone.disabled = true;
    }
    else
    {
        document.Form.phone.disabled = false;
    }
}

function showNextQuestion() {
    document.getElementById("nextQuestion").style.display = "block";
}
function hideNextQuestion() {
    document.getElementById("nextQuestion").style.display = "none";
}


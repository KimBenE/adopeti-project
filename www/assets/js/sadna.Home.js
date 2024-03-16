async function savePreferences() {
    var ResidentialArea = document.getElementById("Area").value === 'dont_care' ? null : document.getElementById("Area").value.toLowerCase();
    var AnimalType = document.getElementById("animal_type").value === 'dont_care' ? null : document.getElementById("animal_type").value.toLowerCase();
    var animalAge = document.getElementById("animal_age").value === 'dont_care' ? null : document.getElementById("animal_age").value; 
    var Breed = document.getElementById("breed").value === 'dont_care' ? null : document.getElementById("breed").value.toLowerCase(); 
    var Gender = document.getElementById("animal_gender").value === 'dont_care' ? null : document.getElementById("animal_gender").value.toLowerCase(); 

    let Age = null;

    if (animalAge === 'puppy_or_kitten')
        Age = [0,1];
    if (animalAge === 'adult')
        Age = [2,8];
    if (animalAge === 'senior')
        Age = [9,100];        

    const UserID = await getUserId();

        // Make request to backend API
    fetch("http://adopeti.xyz:3000/users/updatePreferences", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({  UserID, AnimalType, Gender, Breed, Age, ResidentialArea })
      })
      .then(async response => {
          // Preferences added
          if (response.status == 200){
            const popupContainer = document.getElementById('popupContainer');
            openPopup(popupContainer);
            // sleep 3 sec
            await new Promise(r => setTimeout(r, 3000));
            closePopup(popupContainer);

            
          }
          // Any error
          else if (!response.ok){
              throw new Error("Failed to save preferences "+response.json());
          }
      })
      .catch(error => {
          // preferences error
          console.error("Preferences error:", error);
      });


  }

async function getUserId() {
    try {
        // Get user details
        const response = await fetch(`http://adopeti.xyz:3000/users/${localStorage.getItem("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            // user not found
            console.error("user not found");
            throw new Error("user not found");
        } else if (response.status === 200) {
            // Association found
            const data = await response.json();
            const userId = data.user.UserID;
            return userId ;
        } else {
            // Any other error
            const data = response.json();
            throw new Error("Failed to find user: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Function to open the pop-up
function openPopup(popupContainer) {
    popupContainer.style.display = 'block';
  }

// Function to close the pop-up
function closePopup(popupContainer) {
    popupContainer.style.display = 'none';
}

/**/

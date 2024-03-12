document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('animal_type').addEventListener('change', function(event) {
      const selectedAnimal = event.target.value;
      if (selectedAnimal === 'dog') {
        fetchDogBreeds();
      } else if (selectedAnimal === 'cat') {
        fetchCatBreeds();
      } 
    });
  });
  
  function fetchDogBreeds() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => {
        const breeds = Object.keys(data.message);
        // Add "Other" and "Mixed" to the breeds array
        breeds.push("Other", "Mixed");
        buildSelectElement(breeds);
      })
      .catch(error => console.error('Error fetching dog breeds:', error));
  }
  
  function fetchCatBreeds() {
    fetch('https://api.thecatapi.com/v1/breeds')
      .then(response => response.json())
      .then(data => {
        const breeds = data.map(cat => cat.name);
        // Add "Other" and "Mixed" to the breeds array
        breeds.push("Other", "Mixed");
        buildSelectElement(breeds);
      })
      .catch(error => console.error('Error fetching cat breeds:', error));
  }
  
  function clearSelectElement() {
    document.getElementById('breed').innerHTML = '<option disabled selected>Breed</option>';
  }

  function buildSelectElement(breeds) {
    const selectElement = document.getElementById('breed');
    const leaveOptions =  selectElement.getAttribute('leave');
    
    // Clear existing options except the first one
    selectElement.innerHTML = '<option disabled selected>Breed</option>';

    if (leaveOptions === 'true'){
      const option1 = document.createElement('option');
      option1.value = 'dont_care';
      option1.textContent = 'I do not care';
      selectElement.appendChild(option1);      
    }
  
    // Add options for each breed
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed;
      option.textContent = breed;
      selectElement.appendChild(option);
    });
  }
  
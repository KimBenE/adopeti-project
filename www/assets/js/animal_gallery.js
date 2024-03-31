// Function to fetch data and update the gallery
function updateGallery() {
    const base_url = "/animals/search";
    const animalType = document.getElementById('animalType').value;
    const gender = document.getElementById('animalGender').value;

    fetch(base_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ animalType, gender })
    })
    .then(response => response.json())
    .then(data => {
        const defaultImagePath = '../נספחים/no_image.png';
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing content
        data.forEach(animal => {
            const encodedImages = JSON.parse(animal.encodedImages);

            const animalCard = document.createElement('li');
            animalCard.classList.add('animal-card');
            animalCard.dataset.animalId = animal.AnimalID;

            const imagePath = `data:image/png;base64, ${encodedImages[0]}`;
            imageExists(imagePath, function(exists) {
                if (exists) {
                    animalCard.innerHTML = `
                        <img src="${imagePath}" alt="${animal.Name}">
                        <h3>${animal.Name}</h3>
                        <p>${animal.Breed}</p>
                    `;
                } else {
                    animalCard.innerHTML = `
                        <img src="${defaultImagePath}" alt="Default Image">
                        <h3>${animal.Name}</h3>
                        <p>${animal.Breed}</p>
                    `;
                }

                animalCard.style.display = 'inline-block';
                animalCard.style.marginRight = '10px'; 

                gallery.appendChild(animalCard);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // Handle errors gracefully
    });
}

// Call the function to update the gallery when the page loads
window.onload = function() {
    updateGallery();

    // Listen for changes in filter inputs and update the gallery accordingly
    document.getElementById('animalType').addEventListener('change', updateGallery);
    document.getElementById('animalGender').addEventListener('change', updateGallery);
    // Add event listeners for other filter inputs as needed
};

// Check if the image file exists
function imageExists(url, callback) {
    const img = new Image();
    img.src = url;

    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
}



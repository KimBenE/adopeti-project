// Function to fetch data and update the gallery
function updateGallery() {
    const base_url = "http://adopeti.xyz:3000/animals/search";
    const animalType = document.getElementById('animalType').value;

    fetch(base_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ animalType })
    })
    .then(response => response.json())
    .then(data => {
        const defaultImagePath = '../נספחים/no_image.png';
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing content
        data.forEach(animal => {
            const listImagePath = animal.ImagePaths.replace(/[()']/g, '')  // Remove parentheses and single quotes
            .split(',') // Split by comma
            .map(filename => filename.trim());

            const animalCard = document.createElement('li');
            animalCard.classList.add('animal-card');
            animalCard.dataset.animalId = animal.AnimalID;

            const imagePath = `../../../uploads/image/${animal.AnimalID}/${listImagePath[0]}`;
            imageExists(imagePath, function(exists) {
                if (exists) {
                    animalCard.innerHTML = `
                        <img src="${imagePath}" alt="${animal.Name}">
                        <h3>${animal.Name}</h3>
                        <p>${animal.Breed}</p>
                        <!-- Add more information as needed -->
                    `;
                } else {
                    animalCard.innerHTML = `
                        <img src="${defaultImagePath}" alt="Default Image">
                        <h3>${animal.Name}</h3>
                        <p>${animal.Breed}</p>
                        <!-- Add more information as needed -->
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
    // Add event listeners for other filter inputs as needed
};

// Check if the image file exists
function imageExists(url, callback) {
    const img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}



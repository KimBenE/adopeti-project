document.addEventListener('DOMContentLoaded', function() {
    const base_url = "http://adopeti.xyz:3000/animals/search";
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('.close');
    
    

    function displayModal(event) {
        const animalCard = event.target.closest('.animal-card');
        const defaultImagePath = '../נספחים/no_image.png';
        if (animalCard) {
            const animalId = animalCard.dataset.animalId;

            fetch(base_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ animalId })
            })
            .then(response => response.json())
            .then(data => {
                const modalContent = modal.querySelector('#dynamic-content');
                modalContent.innerHTML = ''; // Clear previous content
                
                const animal = data[0]

                const listImagePath = animal.ImagePaths.replace(/[()']/g, '')  
                .split(',') 

                // Main image display
                const imagePath = `../../../uploads/image/${animal.AnimalID}/${listImagePath[0]}`;
                const bigImage = document.createElement('img');
                imageExists(imagePath, function(exists) {
                    if (exists) {
                        bigImage.src = imagePath;
                    } else {
                        bigImage.src = defaultImagePath;
                    }
                });
                
                bigImage.alt = animal.name;
                bigImage.classList.add('main-image');
                modalContent.appendChild(bigImage);

                // Thumbnails container
                const thumbnailsDiv = document.createElement('div');
                thumbnailsDiv.classList.add('thumbnails');

                // Add thumbnails
                listImagePath.forEach((image, index) => {
                    const thumbImage = document.createElement('img');
                    const imagePath = `../../../uploads/image/${animal.AnimalID}/${image}`;
                    imageExists(imagePath, function(exists) {
                        if (exists) {
                            thumbImage.src = imagePath;
                        } else {
                            thumbImage.src = defaultImagePath;
                        }
                    });
                    thumbImage.alt = animal.name;

                    // Highlight the first image by adding 'active' class only if index is 0
                    if (index === 0) {
                        thumbImage.classList.add('active');
                    }

                    thumbImage.addEventListener('click', () => {
                        bigImage.src = thumbImage.src; // Change main image on click

                        const currentActive = modalContent.querySelector('.thumbnails img.active');
                        if (currentActive) {
                            currentActive.classList.remove('active');
                        }
                        thumbImage.classList.add('active');
                    });

                    thumbnailsDiv.appendChild(thumbImage);
                });

                modalContent.appendChild(thumbnailsDiv);

                // Add more information
                const animalInfo = document.createElement('div');
                animalInfo.innerHTML = `
                    <h3>${animal.Name}</h3>
                    <p>${animal.Breed}</p>
                    <p><b>Age</b> ${animal.Age}</p>
                    <p><b>Gender</b> ${animal.Gender}</p>
                    <p><b>Residential Area</b> ${animal.ResidentialArea}</p>
                    ${animal.breedInfo && animal.breedInfo.length ? createBreedInfoHtml(animal.breedInfo[0]) : ''}
                    <!-- Add more information here -->
                `;


                modalContent.appendChild(animalInfo);

                modal.style.display = 'block'; // Show the modal
            })
        }
    }

    document.addEventListener('click', displayModal);

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });
});

// Function to convert numeric rating to stars
const ratingToStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

// Dynamically create the breed info HTML based on available properties, excluding 'image_link' and 'name'
const createBreedInfoHtml = (breedInfo) => {
    let breedInfoHtml = `<p><b>General Breed Info: </b></p>`;
    Object.keys(breedInfo).forEach(key => {
        // Skip 'image_link' and 'name'
        if (key === 'image_link' || key === 'name') return;

        // For numeric ratings, convert to stars
        if (typeof breedInfo[key] === 'number' && breedInfo[key] >= 1 && breedInfo[key] <= 5) {
            breedInfoHtml += `<p><b>${key.replace(/_/g, ' ')}</b>: ${ratingToStars(breedInfo[key])}</p>`;
        } else {
            // For other types of data (e.g., strings, numbers not in 1-5 range), display as is
            breedInfoHtml += `<p><b>${key.replace(/_/g, ' ')}</b>: ${breedInfo[key]}</p>`;
        }
    });
    return breedInfoHtml;
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
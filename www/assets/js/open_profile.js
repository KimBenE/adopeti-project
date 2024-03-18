document.addEventListener('DOMContentLoaded', function() {
    const base_url = "http://adopeti.xyz:3000/animals/search";
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('.close');
    
    

    function displayModal(event) {
        const animalCard = event.target.closest('.animal-card');
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
                const bigImage = document.createElement('img');
                bigImage.src = `../../../uploads/image/${animal.AnimalID}/${listImagePath[0]}`;
                bigImage.alt = animal.name;
                bigImage.classList.add('main-image');
                modalContent.appendChild(bigImage);

                // Thumbnails container
                const thumbnailsDiv = document.createElement('div');
                thumbnailsDiv.classList.add('thumbnails');

                // Add thumbnails
                listImagePath.forEach((image, index) => {
                    const thumbImage = document.createElement('img');
                    thumbImage.src = `../../../uploads/image/${animal.AnimalID}/${image}`;
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
                    <h3>${animal.name}</h3>
                    <p>${animal.breed}</p>
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
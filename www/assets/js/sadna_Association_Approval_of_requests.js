const baseUrl = '/requests';
let route;
let requestBody;

// Define an async function to handle the DOMContentLoaded event
async function handleDOMContentLoaded() {
    const { associationId, residentialArea } = await getAssociationDetails();

    // Determine the current page type and call fetchData
    const currentPage = window.location.pathname;
    if (currentPage.includes('adoption')) {
        route = `${baseUrl}/adoption_requests`;
        requestBody = { associationId: associationId, approvalStatus: 'pending' };

    } else if (currentPage.includes('giveaway')) {
        route = `${baseUrl}/giveaway_requests`;
        requestBody = { approvalStatus: 'pending' };
    } else {
        console.error('Unable to determine page type');
    }

    // Function to fetch adoption and giveaway requests
    async function fetchRequests() {
        try {
            const response = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }

            const data = await response.json();
            await displayRequests(data.requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }

    // Function to display adoption and giveaway requests
    async function displayRequests(requests) {
        const requestsContainer = document.getElementById('requests-container');
        requestsContainer.innerHTML = ''; // Clear previous content
    
        for (const request of requests) {
            // Create main container div for each request
            const requestContainer = document.createElement('div');
            requestContainer.id = request.RequestID;
            requestContainer.classList.add('w3-container', 'person');
    
            // Add line break
            requestContainer.appendChild(document.createElement('br'));
            requestContainer.appendChild(document.createElement('br'));
    
            // get the user and animal details
            let animal;
            if (currentPage.includes('adoption')) {
                animal = await getAnimalDetails(request.AnimalID);
                animal = animal[0];
                console.log(animal)
            } else {
                animal = request;
            }
            const user = await getUserDetails(request.UserID);
    
            // Create image element
            let imagePath = getDefaultImagePath();
            const encodedImages = JSON.parse(animal.encodedImages);
            animal.encodedImages = encodedImages;
            if (encodedImages && encodedImages.length > 0) {
                const imageSrc = `data:image/png;base64, ${encodedImages[0]}`;
                imagePath = await getImagePath(imageSrc);
            }
            const img = createImageElement(imagePath);
            requestContainer.appendChild(img);
    
            // Add Dog name
            const animalName = currentPage.includes('adoption') ? animal.Name : animal.AnimalName;
            const animalNameHeader = createHeaderTextElement(animalName);
            requestContainer.appendChild(animalNameHeader);
    
            // Add application submission date
            const submissionDateHeader = createSubmissionDateElement(request.CreatedAt);
            requestContainer.appendChild(submissionDateHeader);
    
            // Add Approve and Deny buttons
            let approveButton, denyButton;
            if (currentPage.includes('adoption')){
                approveButton = createButton('Approve', 'w3-light-grey', 'approveAdoptionRequest', request.RequestID, animal.AnimalID,user.user.emailAddress, user.user.UserID );
                denyButton = createButton('Deny', 'w3-light-grey', 'denyAdoptionRequest', request.RequestID, animal.AnimalID,user.user.emailAddress, user.user.UserID);
            } 
            if (currentPage.includes('giveaway')){
                //userEmail, userId,associationId, request
                approveButton = createButton('Approve', 'w3-light-grey', 'approveGiveawayRequest', user.user.emailAddress, user.user.UserID, associationId, animal, residentialArea );
                denyButton = createButton('Deny', 'w3-light-grey', 'denyGiveawayRequest', request.RequestID);
            }
            requestContainer.appendChild(approveButton);
            requestContainer.appendChild(denyButton);
    
            // Add horizontal line
            requestContainer.appendChild(document.createElement('hr'));
    
            // Add user details
            const userDetails = getUserDetailsArray(user, request);
            userDetails.forEach(detail => {
                const p = createUserDetailElement(detail.id, `${detail.label} ${detail.value}`);
                requestContainer.appendChild(p);
            });
            requestContainer.appendChild(document.createElement('br'));
            // Add horizontal line
            requestContainer.appendChild(createHorizontalLine());
    
            // Append the request container to the main container
            requestsContainer.appendChild(requestContainer);
        }
    }

    // Fetch requests when the page loads
    await fetchRequests();
}

// Attach the async function to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);


async function getAssociationDetails() {
    try {
        // Get association details
        const response = await fetch(`/associations/${localStorage.getItem("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            // Association not found
            console.error("Association not found");
            throw new Error("Association not found");
        } else if (response.status === 200) {
            // Association found
            const data = await response.json();
            const associationId = data.AssociationID;
            const residentialArea = data.Area;
            return { associationId, residentialArea };
        } else {
            // Any other error
            const data = await response.json();
            throw new Error("Failed to find association: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
// Helper functions for creating DOM elements
function getDefaultImagePath() {
    return '../נספחים/no_image.png';
}

async function getImagePath(imageSrc) {
    return new Promise((resolve, reject) => {
        imageExists(imageSrc, exists => {
            resolve(exists ? imageSrc : getDefaultImagePath());
        });
    });
}

function createImageElement(imgSrc) {
    const img = document.createElement('img');
    img.classList.add('w3-round', 'w3-animate-top');
    img.style.width = '20%';
    img.src = imgSrc;
    return img;
}

function createHeaderTextElement(text) {
    const header = document.createElement('h5');
    header.textContent = text;
    header.classList.add('w3-opacity');
    return header;
}

function createSubmissionDateElement(date) {
    const header = document.createElement('h4');
    header.innerHTML = `<i class="fa fa-clock-o"></i> Application submission date: ${date}`;
    return header;
}

// Function to create buttons
function createButton(label, className, clickHandler, requestId, AnimalID,emailAddress, UserID) {
    const button = document.createElement('a');
    button.classList.add('w3-button', className);
    button.href = '#';
    button.textContent = label;
    button.addEventListener('click', function(event) {
        event.preventDefault();
        window[clickHandler](requestId, AnimalID,emailAddress, UserID);
    });
    return button;
}


function createUserDetailElement(id, text) {
    const p = document.createElement('p');
    p.id = id;
    p.textContent = text;
    return p;
}

function createHorizontalLine() {
    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('horizontal-line');
    return horizontalLine;
}

function getUserDetailsArray(user, request) {
    const currentPage = window.location.pathname;
    let requestText;
    let label;
    if (currentPage.includes('adoption')){
        label = 'User request:';
        requestText = request.RequestText;
    } else {
        label = 'Give-up reason:';
        requestText = request.GiveUpReason;
    }

    return [
        { id: 'userName', label: 'User name:', value: user.user.FullName },
        { id: 'city', label: 'City:', value: user.user.ResidentialArea },
        { id: 'email', label: 'Email:', value: user.user.emailAddress },
        { id: 'phone', label: 'Phone:', value: user.user.Phone },
        { id: 'userRequest', label: label, value: requestText }
    ];
}

async function getAnimalDetails(animalId) {
    try {
        // Get association details
        const response = await fetch("/animals/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ animalId })
        });

        if (response.status === 404) {
            // Animal not found
            console.error("Animal not found");
            throw new Error("Animal not found");
        } else if (response.status === 200) {
            // Animal found
            const data = await response.json();
            return data;
        } else {
            // Any other error
            const data = await response.json();
            throw new Error("Failed to find Animal: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function getUserDetails(userid) {
    try {
        // Get user details
        const response = await fetch(`/users/byId/${userid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            // user not found
            console.error("User not found");
            throw new Error("User not found");
        } else if (response.status === 200) {
            // user found
            const data = await response.json();
            return data;
        } else {
            // Any other error
            const data = await response.json();
            throw new Error("Failed to find user: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


// Check if the image file exists
async function imageExists(url, callback) {
    const img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}

// Function to handle adoption request approval
function approveAdoptionRequest(requestId, animalId, userEmail, userId) {
    const requestData = {
        approvalStatus: 'approved', 
        animalId: animalId,
        emailAddress: userEmail, 
        userId: userId
        };

    // PATCH request
    fetch(`/requests/update-adoption-request/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the response data
        // Remove the element from the DOM
        const elementToRemove = document.getElementById(requestId);
        if (elementToRemove) {
            elementToRemove.remove();
        }
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors that occur during the request
    });

    // sending an alert
    alert('Request with ID ' + requestId + ' approved!');
}

// Function to handle deny request
function denyAdoptionRequest(requestId, animalId, userEmail, userId) {
    const requestData = {
        approvalStatus: 'denied', 
        animalId: animalId,
        emailAddress: userEmail, 
        userId: userId
    };

    // PATCH request
    fetch(`/requests/update-adoption-request/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the response data
        // Remove the element from the DOM
        const elementToRemove = document.getElementById(requestId);
        if (elementToRemove) {
            elementToRemove.remove();
        }
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors that occur during the request
    });
    // sending an alert
    alert('Request with ID ' + requestId + ' denied!');
}

// Function to handle give-away request approval
async function approveGiveawayRequest(userEmail, userId,associationId, request, residentialArea) {
    const requestData = {
        approvalStatus: 'approved',
        associationId: associationId,
        animalType: request.AnimalType,
        gender: request.Gender, 
        name: request.AnimalName,
        breed: request.BreedName,
        age: request.AnimalAge,
        medicalHistory: request.HasMedicalProblems,
        residentialArea: residentialArea,
        description: request.description,
        encodedImages: request.encodedImages,
        emailAddress: userEmail, 
        userId: userId
    };

    const createAnimalData = {
        associationId: associationId,
        animalType: request.AnimalType,
        gender: request.Gender, 
        name: request.AnimalName,
        breed: request.BreedName,
        age: request.AnimalAge,
        medicalHistory: request.MedicalIssuesDetails,
        residentialArea: residentialArea,
        description: request.description,
        encodedImages: request.encodedImages
    };

    // PATCH request
    await fetch(`/requests/update-giveaway-request/${request.RequestID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the response data
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors that occur during the request
    });

    // Make request to backend API to create animal
    const response = await fetch("/animals/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createAnimalData)
    });

    // Handle response
    if (response.status == 201) {
        console.log('Animal created successfully' );
        // Remove the element from the DOM
        const elementToRemove = document.getElementById(request.RequestID);
        if (elementToRemove) {
            elementToRemove.remove();
        }
    } else if (!response.ok) {
        throw new Error("Failed to create animal " + response.json());
    }

    // sending an alert
    alert('Request with ID ' + request.RequestID + ' approved!');
}

// Function to handle deny request
function denyGiveawayRequest(requestId) {
    const requestData = {
        approvalStatus: 'denied'
    };

    // PATCH request
    fetch(`/requests/update-giveaway-request/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the response data
        // Remove the element from the DOM
        const elementToRemove = document.getElementById(requestId);
        if (elementToRemove) {
            elementToRemove.remove();
        }        
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors that occur during the request
    });
    // sending an alert
    alert('Request with ID ' + requestId + ' denied!');
}
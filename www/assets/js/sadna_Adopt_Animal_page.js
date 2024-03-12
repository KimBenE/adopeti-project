document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch animal data
        const response = await fetch("http://adopeti.xyz:3000/animals/create");
        const animalData = await response.json();

        // Populate HTML elements with animal data
        document.getElementById("animalName").textContent = `Animal name: ${animalData.name}`;
        document.getElementById("animalType").textContent = `Animal Type: ${animalData.animalType}`;
        document.getElementById("animalGender").textContent = `Animal Gender: ${animalData.gender}`;
        document.getElementById("animalAge").textContent = `Animal age: ${animalData.age}`;
        document.getElementById("animalBreed").textContent = `Animal breed: ${animalData.breed}`;
        document.getElementById("animalMedicalProblems").textContent = `Animal medical problems: ${animalData.medicalHistory.join(", ")}`;
    } catch (error) {
        console.error("Error:", error);
    }
});

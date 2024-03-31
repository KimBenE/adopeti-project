// Function to check if user is logged in
function checkUserLoggedIn() {
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('currentUser');
    if (!username || !userType) {
        // Save the current URL in sessionStorage
        sessionStorage.setItem('redirectURL', window.location.href);
        // Redirect user to the login page
        window.location.href = '../../../index.html';
    }
}

// Call the function to check user login status on page load
checkUserLoggedIn();
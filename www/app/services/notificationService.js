// services/notificationService.js
const db = require('../db');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer');
const path = require('path')


// Email setup
const emailUser = 'adopeti.platform@gmail.com';
const emailPass = 'xheg cznj sbew kcmc';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass // App password
    }
});

// Function to notify adopters based on matching preferences
async function notifyMatchingAdopters(newAnimal) {
    // Logic to find matching adopters and prepare notification details

    // Find users with matching preferences
    const matchQuery = `
        SELECT UserID
        FROM AdopterPreferences
        WHERE AnimalType = ?
        AND JSON_CONTAINS(Breed, ?, '$')
        AND CAST(JSON_EXTRACT(Age, '$[0]') AS SIGNED) <= ?
        AND CAST(JSON_EXTRACT(Age, '$[1]') AS SIGNED) >= ?
        AND JSON_CONTAINS(ResidentialArea, ?, '$')
        `;
  
        try {
            await db.query(matchQuery, [newAnimal.animalType, `\"${newAnimal.breed}\"`, newAnimal.age, newAnimal.age, `\"${newAnimal.residentialArea}\"`], (err, userResults) => {
                userResults.forEach(async (match) => {
                    // For each match, retrieve user contact information and send notification
                    const user = await getUserById(match.UserID);
                    const userEmail = user.emailAddress; // Assuming you have the user's email
        
                    // Send notification email
                    sendNotificationEmail(userEmail, newAnimal); 
                });

            })

        } catch (err) {
            console.error('Error finding matching adopters:', err);
        }
}

async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE UserId = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null); // No user found
            }
        });
    });
}

function sendNotificationEmail(email, animal) {
    const emailSubject = 'New match just added!';
    const emailHtml = `
        <html>
        <head>
            <style>
                body {
                    background-color: pink; /* Set the background color */
                    text-align: center; /* Center align the text */
                    font-size: 100px; /* Set the font size */
                }
            </style>
        </head>
        <body>
            <p>Hi there!</p>
            <p>A new animal has been matched with your preferences: <strong>${animal.name}</strong>, a <strong>${animal.age}</strong>-year-old <strong>${animal.animalType}</strong>.</p>
        </body>
        </html>
        `;

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('app/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('app/views/'),
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    
    // Send the email
    const mailOptions = {
        from: emailUser,
        template: 'email',
        to: email,
        subject: emailSubject,
        context: {
            animalName: animal.name,
            animalAge: animal.age,
            animalType: animal.animalType
          },
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Notification sent successfully' });
        }
    });
}


module.exports = {
    notifyMatchingAdopters,
};

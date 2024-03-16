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
        pass: emailPass 
    }
});

// Function to notify adopters based on matching preferences
async function notifyMatchingAdopters(newAnimal) {

    // Find users with matching preferences
    const matchQuery = `
    SELECT UserID
    FROM AdopterPreferences
    WHERE (AnimalType = ? OR AnimalType IS NULL)
    AND (JSON_CONTAINS(Breed, JSON_QUOTE(?), '$') OR Breed IS NULL)
    AND (CAST(JSON_EXTRACT(Age, '$[0]') AS SIGNED) <= ? OR Age IS NULL)
    AND (CAST(JSON_EXTRACT(Age, '$[1]') AS SIGNED) >= ? OR Age IS NULL)
    AND (JSON_CONTAINS(ResidentialArea, JSON_QUOTE(?), '$') OR ResidentialArea IS NULL); 
        `;
        try {
            await db.query(matchQuery, [newAnimal.animalType, `${newAnimal.breed}`, newAnimal.age, newAnimal.age, `${newAnimal.residentialArea}`], (err, userResults) => {
                userResults.forEach(async (match) => {
                    // For each match, retrieve user contact information and send notification
                    const user = await getUserById(match.UserID);
                    const userEmail = user.emailAddress;
        
                    // Send notification email
                    sendNotificationEmail(userEmail, newAnimal, match.UserID); 
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

function sendNotificationEmail(email, animal, userId) {
    const emailSubject = 'Adopeti - New match just added!';

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('app/views/'),
            partialsDir: path.resolve('app/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('app/views/'),
        extName: '.handlebars',
        viewPath: path.resolve('app/views/'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions))
    const firstImage = animal.imagePaths.replace(/[()']/g, '').split(',')[0];
    // Send the email
    const mailOptions = {
        from: emailUser,
        template: 'email',
        to: email,
        subject: emailSubject,
        context: {
            animalID: animal.animalId,
            fileName: firstImage,
            animalID: animal.animalId,
            fileName: firstImage,
            animalName: animal.name,
            animalAge: animal.age,
            animalType: animal.animalType,
            description: animal.description
          },
        attachments: [
            {
                filename: firstImage,
                path: `uploads/image/${animal.animalId}/${firstImage}`,
                cid: 'unique_image_cid', 
            },
            {
                filename: 'LOGO pet-no background.png',
                path: `assets/נספחים/LOGO Pet-no background.png`,
                cid: 'logo', 
            },            
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            const insertNotificationQuery = `
            INSERT INTO usersnotifications (UserID, Message, emailAddress)
            VALUES (?, ?, ?)`;
            db.query(insertNotificationQuery, [userId, emailSubject, email]);
            return res.status(200).json({ message: 'Notification sent successfully' });
        }
    });
}


module.exports = {
    notifyMatchingAdopters,
};

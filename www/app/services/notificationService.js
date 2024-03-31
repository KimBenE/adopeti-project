// services/notificationService.js
const db = require('../db');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer');
const path = require('path')
const ejs = require('ejs');
const fs = require('fs');


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

// Function to render the email template with dynamic data
const renderEmailTemplate = (data, emailTemplate) => {
    return ejs.render(emailTemplate, data);
};

// Function to notify adopters based on matching preferences
async function notifyMatchingAdopters(newAnimal) {

    // Find users with matching preferences
    const matchQuery = `
    SELECT UserID
    FROM AdopterPreferences
    WHERE (AnimalType = ? OR AnimalType IS NULL)
    AND (Breed = ? OR Breed IS NULL)
    AND (Gender = ? OR Gender IS NULL)
    AND (
        CAST(JSON_UNQUOTE(JSON_EXTRACT(Age, '$[0]')) AS SIGNED) <= ?
        OR Age IS NULL 
        OR JSON_EXTRACT(Age, '$[0]') IS NULL -- Check if the first element is JSON null
        OR JSON_UNQUOTE(JSON_EXTRACT(Age, '$[0]')) = 'null' -- Check if the first element is the string 'null'
    )
    AND (
        CAST(JSON_UNQUOTE(JSON_EXTRACT(Age, '$[1]')) AS SIGNED) >= ?
        OR Age IS NULL 
        OR JSON_EXTRACT(Age, '$[1]') IS NULL -- Check if the second element is JSON null
        OR JSON_UNQUOTE(JSON_EXTRACT(Age, '$[1]')) = 'null' -- Check if the second element is the string 'null'
    )
    AND (ResidentialArea = ? OR ResidentialArea IS NULL)
    
        `;
        try {
            await db.query(matchQuery, [newAnimal.animalType, `${newAnimal.breed}`,newAnimal.gender, newAnimal.age, newAnimal.age, `${newAnimal.residentialArea}`], (err, userResults) => {
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

function sendRequestAdoptionEmail(emailAddress, animal, userId, approvalStatus, surveyLink) {
    const emailSubject = 'Adopeti - New request update!';

    // Send the email
    const data = {
        animalID: animal.AnimalID,
        animalName: animal.Name,
        animalAge: animal.Age,
        animalType: animal.AnimalType,
        description: animal.description,
        approvalStatus: approvalStatus,
        surveyLink: surveyLink
    };

    // Read the HTML email template file
    const emailTemplate = fs.readFileSync('app/views/email_adoption_request.html', 'utf8');

    const mailOptions = {
        from: emailUser,
        html: renderEmailTemplate(data, emailTemplate),
        to: emailAddress,
        subject: emailSubject,
        attachments: [
            {
                filename: 'animalImage.png', 
                content: JSON.parse(animal.encodedImages)[0], 
                encoding: 'base64', 
                cid: 'unique_image_cid' // Use a unique cid (Content-ID) to reference the image in the email template
            },
            {
                filename: 'LOGO pet-no background.png',
                path: `assets/נספחים/LOGO Pet-no background.png`,
                cid: 'logo', 
            }
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


function sendRequestGiveawayEmail(emailAddress, animal, userId, approvalStatus) {
    const emailSubject = 'Adopeti - New request update!';

    // Send the email
    const data = {
        animalName: animal.name,
        animalAge: animal.age,
        animalType: animal.animalType,
        description: animal.description,
        approvalStatus: approvalStatus
    };

    // Read the HTML email template file
    const emailTemplate = fs.readFileSync('app/views/email_giveaway_request.html', 'utf8');

    const mailOptions = {
        from: emailUser,
        html: renderEmailTemplate(data, emailTemplate),
        to: emailAddress,
        subject: emailSubject,
        attachments: [
            {
                filename: 'animalImage.png', 
                content: animal.encodedImages[0], 
                encoding: 'base64', 
                cid: 'unique_image_cid' // Use a unique cid (Content-ID) to reference the image in the email template
            },
            {
                filename: 'LOGO pet-no background.png',
                path: `assets/נספחים/LOGO Pet-no background.png`,
                cid: 'logo', 
            }
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


function sendNotificationEmail(email, animal, userId) {
    const emailSubject = 'Adopeti - New match just added!';

    // Send the email
    const data = {
        animalID: animal.animalId,
        animalName: animal.name,
        animalAge: animal.age,
        animalType: animal.animalType,
        description: animal.description
    };

    // Read the HTML email template file
    const emailTemplate = fs.readFileSync('app/views/email.html', 'utf8');

    const mailOptions = {
        from: emailUser,
        html: renderEmailTemplate(data, emailTemplate),
        to: email,
        subject: emailSubject,
        attachments: [
            {
                filename: 'animalImage.png',
                content: JSON.parse(animal.encodedImages)[0], 
                encoding: 'base64', 
                cid: 'unique_image_cid' // Use a unique cid (Content-ID) to reference the image in the email template
            },
            {
                filename: 'LOGO pet-no background.png',
                path: `assets/נספחים/LOGO Pet-no background.png`,
                cid: 'logo', 
            }
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
    sendRequestAdoptionEmail,
    sendRequestGiveawayEmail
};

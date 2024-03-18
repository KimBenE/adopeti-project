const mysql = require('mysql');
const db = require('./app/db');

const createTables = [
    `CREATE TABLE IF NOT EXISTS Associations (
        AssociationID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(255) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,    
        Name VARCHAR(255),
        Address TEXT,
        Phone VARCHAR(20),
        emailAddress VARCHAR(20),
        SurveyLink TEXT, -- URL to the satisfaction survey
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,



    `CREATE TABLE IF NOT EXISTS Animals (
        AnimalID INT AUTO_INCREMENT PRIMARY KEY,
        AssociationID INT,
        AnimalType ENUM('dog', 'cat', 'rabbit', 'hamster') NOT NULL,
        Gender ENUM('male', 'female'),
        Name VARCHAR(255),
        Breed VARCHAR(255),
        Age INT,
        MedicalHistory TEXT,
        Status ENUM('available', 'adopted') NOT NULL DEFAULT 'available',
        ResidentialArea VARCHAR(255),
        description VARCHAR(255),
        ImagePaths TEXT,
        VideoPaths TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (AssociationID) REFERENCES Associations(AssociationID)
    ); `,

    `CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(255) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Type ENUM('adopter', 'give-away') NOT NULL,
        FullName VARCHAR(255),  
        FamilySituation TEXT,
        Phone VARCHAR(20),
        emailAddress VARCHAR(255),  
        Age INT,
        ResidentialArea VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ); `,

    `CREATE TABLE IF NOT EXISTS AdopterPreferences (
        UserID INT PRIMARY KEY,
        AnimalType ENUM('dog', 'cat', 'rabbit', 'hamster'),
        Gender ENUM('male', 'female'),
        Breed VARCHAR(255),
        Age JSON,
        ResidentialArea VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );`,

    `CREATE TABLE IF NOT EXISTS AdoptionRequests (
        RequestID INT AUTO_INCREMENT PRIMARY KEY,
        AnimalID INT,
        UserID INT,
        AssociationID INT,
        ApprovalStatus ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
        RequestText TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (AnimalID) REFERENCES Animals(AnimalID),
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (AssociationID) REFERENCES Associations(AssociationID)
    );
    `,
    `CREATE TABLE IF NOT EXISTS GiveUpRequests (
        RequestID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT,
        ApprovalStatus ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
        ContactInformation TEXT,
        AnimalType VARCHAR(255),
        AnimalName VARCHAR(255),
        BreedName VARCHAR(255),
        AnimalAge INT,
        HasMedicalProblems ENUM('yes', 'no'),
        MedicalIssuesDetails TEXT,
        GiveUpReason TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
      );`,
    `CREATE TABLE IF NOT EXISTS UsersNotifications (
        NotificationID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT,
        Message VARCHAR(255) NOT NULL,    
        emailAddress VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );`
]

createTables.forEach((element) =>
    db.query(element, function (error, results, fields) {
        if (error) throw error;
        console.log(`Table ${element.split(" ")[5]} created or verified successfully`)
    }),
);
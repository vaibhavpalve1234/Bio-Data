const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS and images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/photos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Initial bioData object
let bioData = {
    godImage: "icon.jpg",
    profileImages: "",
    personalInfo: {
        name: '',
        dob: '',
        birthTime: '',
        weight: '',
        height: '',
        bloodGroup: '',
        complexion: '',
        placeOfBirth: '',
        maritalStatus: '',
        profileImage: ''
    },
    contacts: {
        family: {
            number: ''
        },
        personal: {
            number: ''
        }
    },
    professionalInfo: {
        education: '',
        companyName: '',
        occupation: '',
        workLocation: ''
    },
    familyInfo: {
        fatherName: '',
        fatherOccupation: '',
        motherName: '',
        fatherOccupation:'',
        grandfather: '',
        residentialAddress: '',
        village: ''
    },
    preferences: {
        hobbies: '',
        favoriteActivities: '',
        languagesKnown: ''
    }
};

// Routes
app.get('/show-bio', (req, res) => {
    res.render('bio', { bio: bioData });
});

app.get('/', (req, res) => {
    res.render('form', { bio: bioData });
});

app.post('/update-bio', upload.fields([{ name: 'profileImages', maxCount: 1 }, { name: 'godImage', maxCount: 1 }]), (req, res) => {
    const updatedInfo = req.body;
    if (req.files) {
        if (req.files.profileImages) {
            updatedInfo.profileImages = req.files.profileImages[0].originalname;
        }
        if (req.files.godImage) {
            updatedInfo.godImage = req.files.godImage[0].originalname;
        }
    }

    bioData = {
        ...bioData,
        ...updatedInfo,
        personalInfo: {
            ...bioData.personalInfo,
            ...updatedInfo.personalInfo
        },
        contacts: {
            ...bioData.contacts,
            ...updatedInfo.contacts
        },
        professionalInfo: {
            ...bioData.professionalInfo,
            ...updatedInfo.professionalInfo
        },
        familyInfo: {
            ...bioData.familyInfo,
            ...updatedInfo.familyInfo
        },
        preferences: {
            ...bioData.preferences,
            ...updatedInfo.preferences
        }
    };

    console.log('Updated bioData:', bioData);

    res.redirect('/show-bio');
});

app.get('/clear', (req, res) => {
    // Reset bioData to its initial state
    bioData = {
        godImage: "",
        profileImages: "",
        personalInfo: {
            name: '',
            dob: '',
            birthTime: '',
            weight: '',
            height: '',
            bloodGroup: '',
            complexion: '',
            placeOfBirth: '',
            maritalStatus: '',
            profileImage: ''
        },
        contacts: {
            family: {
                number: ''
            },
            personal: {
                number: ''
            }
        },
        professionalInfo: {
            education: '',
            companyName: '',
            occupation: '',
            workLocation: ''
        },
        familyInfo: {
            fatherName: '',
            fatherOccupation: '',
            motherName: '',
            olderBrother: '',
            grandfather: '',
            residentialAddress: '',
            village: ''
        },
        preferences: {
            hobbies: '',
            favoriteActivities: '',
            languagesKnown: ''
        }
    };

    const photoDir = path.join(__dirname, 'public', 'photos');

    function clearDirectory(directory) {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(directory, file);
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            });
        });
    }

    // Clear the photo directory
    clearDirectory(photoDir);

    res.json({ success: true });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

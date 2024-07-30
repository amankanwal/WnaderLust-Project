// Import Cloudinary and multer-storage-cloudinary libraries
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Load environment variables from a .env file
require('dotenv').config();

// Configure Cloudinary with the credentials from environment variables
cloudinary.config({
    // Process object is used to access enviromental variable ! 

    cloud_name: process.env.CLOUD_NAME, // Cloudinary cloud name
    api_key: process.env.CLOUD_API_KEY, // Cloudinary API key
    api_secret: process.env.CLOUD_API_SECRET, // Cloudinary API secret
    
});

// Set up the Cloudinary storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Cloudinary instance to use
    params: {
        folder: 'wanderlust_DEV', // Folder name in Cloudinary where files will be stored
        allowed_formats: ['png', 'jpeg', 'jpg'], // Allowed file formats for uploads
    },
});

// Create a multer instance with the Cloudinary storage configuration
const upload = multer({ storage });

// Export the configured Cloudinary, storage, and upload instances for use in other parts of the app
module.exports = {
    cloudinary,
    storage,
    upload,
};

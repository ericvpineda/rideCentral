const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_KEY,
    api_secret : process.env.CLOUD_SECRET 
})

const store = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : 'Ride Central',
        allowedFormats : ['jpeg', 'jpg','png']
    }
})

module.exports = {cloudinary, store}
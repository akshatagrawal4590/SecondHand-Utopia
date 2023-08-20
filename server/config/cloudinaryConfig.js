// const cloudinary = require("cloudinary").v2;

// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_API_KEY, 
//     api_secret: process.env.CLOUD_API_SECRET 
//   });

// module.exports = cloudinary;

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dkqdqkgyd', 
  api_key: '891141285751718', 
  api_secret: '0ird1M3RB4gxSgkpjoKYkOIkZBs' 
});

module.exports = cloudinary;

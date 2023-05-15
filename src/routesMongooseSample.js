const express = require('express');
const router = express.Router();
const Donation = require('./models/donation');
const multer = require('multer');
const path = require('path');

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './uploads/'));
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname); 
    cb(null, 'unavailable-image.jpeg'); 
  },
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Welcome to DOE API');
});

router.post('/donation', upload.single('photo'), async (req, res) => {
  // router.post('/donation', async (req, res) => {
  const { title, address, phonenumber, description } = req.body;

  const newDonation = new Donation({
    title,
    address,
    phonenumber,
    description,
    photo: req.file.filename, 
  });

  try {
    await newDonation.save();
    console.log('Data saved to MongoDB:', newDonation);
    res.send('Data received and saved to MongoDB successfully!');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Failed to save data to MongoDB.');
  }
});

module.exports = router;
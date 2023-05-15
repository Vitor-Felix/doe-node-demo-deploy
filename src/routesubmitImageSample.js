const express = require('express');
const router = express.Router();
const { client } = require('./config/mongo');
const { Readable } = require('stream');

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Welcome to DOE API');
});

router.post('/donate', async (req, res) => {
  const { title, address, phonenumber, description } = req.body;
  const file = req.files.photo;

  const bucket = new client.GridFSBucket(client.db('doe-db-1')); // Replace <database> with the name of your MongoDB database

  const readableStream = new Readable();
  readableStream.push(file.data);
  readableStream.push(null);

  const uploadStream = bucket.openUploadStream(file.name);
  const id = uploadStream.id;

  const newDonation = {
    title,
    address,
    phonenumber,
    description,
    photoId: id, // Save the GridFS file ID in the donation object
  };

  try {
    await bucket
      .uploadFromStream(uploadStream.id, readableStream)
      .then(() => {
        console.log('File uploaded to GridFS');
      });

    const db = client.db('<database>'); // Replace <database> with the name of your MongoDB database
    const collection = db.collection('donations');
    await collection.insertOne(newDonation);

    console.log('Data saved to MongoDB:', newDonation);
    res.send('Data received and saved to MongoDB successfully!');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Failed to save data to MongoDB.');
  }
});

module.exports = router;
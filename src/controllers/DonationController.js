const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const Donation = require('../models/donation');

// Create a MongoDB connection
const mongoURI = "mongodb+srv://doe-db-user:mangarosa@doe-db-cluster0.ptzpqs9.mongodb.net/doe-db-1?retryWrites=true&w=majority";
const client = new MongoClient(mongoURI);

async function registryDonation(req, res) {
  const { title, address, phoneNumber, description } = req.body;
  const file = req.file;

  try {
    await client.connect(); // Connect to the MongoDB server
    const database = client.db('doe-db-1');
    const bucket = new GridFSBucket(database);

    // Create a readable stream from the uploaded file
    const stream = file.buffer;

    // Create a writable stream for storing the image data in GridFS
    const uploadStream = bucket.openUploadStream(file.originalname);

    // Write the buffer data to the upload stream
    uploadStream.write(stream);
    uploadStream.end();

    // Handle the completion of the upload stream
    uploadStream.on('finish', async () => {
      const newDonation = new Donation({
        title,
        address,
        phoneNumber,
        description,
        photo: new ObjectId(uploadStream.id), // Save the GridFS file ID in the donation object
      });

      await newDonation.save();

      console.log('Data saved to MongoDB:', newDonation);
      res.send('Data received and saved to MongoDB successfully!');
    });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Failed to save data to MongoDB.');
  }
}

module.exports = {
  registryDonation
};
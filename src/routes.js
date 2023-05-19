const express = require('express');
const router = express.Router();
const multer = require('multer');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');

const Donation = require('./models/donation');
const DonationController = require('./controllers/DonationController');
const User = require('./models/user');

// Create a MongoDB connection
const mongoURI = "mongodb+srv://doe-db-user:mangarosa@doe-db-cluster0.ptzpqs9.mongodb.net/doe-db-1?retryWrites=true&w=majority";
const client = new MongoClient(mongoURI);

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Welcome to DOE API');
});

// router.post('/donation', upload.single('photo'), DonationController.registryDonation);

router.post('/donation', upload.single('photo'), async (req, res) => {
  const { title, address, phonenumber, description, userId } = req.body;
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
      const user = await User.findOne({ userId });
      console.log(user)

      if (!user) {
        return res.status(404).send('User not found');
      }

      const newDonation = new Donation({
        title,
        address,
        phonenumber,
        description,
        photo: new ObjectId(uploadStream.id),
        user: user._id 
      });

      await newDonation.save();

      console.log('Data saved to MongoDB:', newDonation);
      res.send('Data received and saved to MongoDB successfully!');
    });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Failed to save data to MongoDB.');
  }
});

router.post('/register', upload.fields([
  { name: 'facePhoto', maxCount: 1 },
  { name: 'documentPhoto', maxCount: 1 }
]), async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  const facePhotoFile = req.files['facePhoto'][0];
  const documentPhotoFile = req.files['documentPhoto'][0];

  try {
    await client.connect(); // Connect to the MongoDB server
    const database = client.db('doe-db-1');
    const bucket = new GridFSBucket(database);

    // Create readable streams from the uploaded files
    const facePhotoStream = facePhotoFile.buffer;
    const documentPhotoStream = documentPhotoFile.buffer;

    // Create writable streams for storing the image data in GridFS
    const facePhotoUploadStream = bucket.openUploadStream(facePhotoFile.originalname);
    const documentPhotoUploadStream = bucket.openUploadStream(documentPhotoFile.originalname);

    // Pipe the readable streams into the writable streams to save the image data
    facePhotoUploadStream.write(facePhotoStream);
    documentPhotoUploadStream.write(documentPhotoStream);
    facePhotoUploadStream.end();
    documentPhotoUploadStream.end();

    // Handle the completion of the upload streams
    const uploadPromises = [
      new Promise((resolve, reject) => {
        facePhotoUploadStream.on('finish', resolve);
        facePhotoUploadStream.on('error', reject);
      }),
      new Promise((resolve, reject) => {
        documentPhotoUploadStream.on('finish', resolve);
        documentPhotoUploadStream.on('error', reject);
      })
    ];

    await Promise.all(uploadPromises);

    const newUser = new User({
      fullName,
      email,
      password,
      phoneNumber,
      facePhoto: new ObjectId(facePhotoUploadStream.id),
      documentPhoto: new ObjectId(documentPhotoUploadStream.id),
      isVerified: false
    });

    await newUser.save();

    console.log('User registered:', newUser);
    res.send('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Failed to register user.');
  }
});

router.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  try {
    await client.connect(); // Connect to the MongoDB server
    const database = client.db('doe-db-1');
    const usersCollection = database.collection('users');
    
    const user = await usersCollection.findOne({ email: nickname });

    if (!user) {
      return res.json({ login: false, message: 'Email não cadastrado' });
    }

    if (user.password !== password) {
      return res.json({
        login: false,
        message:
          'Senha inválida, caso tenha esquecido, favor entrar em contato com sas@doe.com.br',
      });
    }

    if (!user.isVerified) {
      return res.json({ login: false, message: 'Seus dados estão em processo de verificação' });
    }

    // Extract only the required fields from the user object
    const { _id, fullName, email, phoneNumber } = user;

    return res.json({ login: true, user: { _id, fullName, email, phoneNumber } });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ login: false, message: 'Failed to login' });
  }
});

router.get('/donations', async (req, res) => {
  const { page = 1 } = req.query; // Default page number is 1

  try {
    await client.connect(); // Connect to the MongoDB server
    const database = client.db('doe-db-1');
    const donationsCollection = database.collection('donations');

    const pageSize = 20; // Number of donations per page
    const skipCount = (page - 1) * pageSize; // Calculate the number of documents to skip

    const donations = await donationsCollection
      .find()
      .sort({ _id: -1 }) // Sort by descending _id to get the latest donations first
      .skip(skipCount)
      .limit(pageSize)
      .toArray();

    // Fetch the photo and user objects for each donation
    const populatedDonations = await Promise.all(
      donations.map(async (donation) => {
        // const photo = await database.collection('fs.files').findOne({ _id: donation.photo });
        const user = await database.collection('users').findOne({ _id: donation.user });

        return {
          ...donation,
          // photo, // Better to make a route only for getting the images
          user,
        };
      })
    );

    res.json(populatedDonations);
  } catch (error) {
    console.error('Error retrieving donations:', error);
    res.status(500).json({ message: 'Failed to retrieve donations' });
  }
});

router.get('/photos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.connect(); // Connect to the MongoDB server
    const database = client.db('doe-db-1');
    const bucket = new GridFSBucket(database, { bucketName: 'fs' });

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    // Set the appropriate content type header for the response
    res.set('Content-Type', 'image/jpeg');

    // Pipe the image data to the response object
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error retrieving photo:', error);
    res.status(500).send('Failed to retrieve photo.');
  }
});

module.exports = router;

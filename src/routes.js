const express = require('express');
const router = express.Router();
const Submission = require('./models/submission');

router.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to DOE API');
});

// router.post('/submit', async (req, res) => {
//     const { title, address, phonenumber, description } = req.body;
  
//     try {
//       const db = client.db('doe-db-cluster0');
//       const collection = db.collection('submissions');
  
//       const newSubmission = {
//         title,
//         address,
//         phonenumber,
//         description,
//       };
  
//       await collection.insertOne(newSubmission);
//       console.log('Data saved to MongoDB:', newSubmission);
//       res.send('Data received and saved to MongoDB successfully!');
//     } catch (error) {
//       console.error('Error saving data to MongoDB:', error);
//       res.status(500).send('Failed to save data to MongoDB.');
//     }
//   });

router.post('/submit', async (req, res) => {
    const { title, address, phonenumber, description } = req.body;
  
    const newSubmission = new Submission({
      title,
      address,
      phonenumber,
      description,
    });
  
    try {
      await newSubmission.save();
      console.log('Data saved to MongoDB:', newSubmission);
      res.send('Data received and saved to MongoDB successfully!');
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).send('Failed to save data to MongoDB.');
    }
  });

module.exports = router;
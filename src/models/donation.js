const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: String,
  address: String,
  phonenumber: String,
  description: String,
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;

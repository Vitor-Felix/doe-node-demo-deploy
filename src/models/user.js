const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  facePhoto: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'File'
  },
  documentPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'File'
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
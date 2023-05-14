const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  title: String,
  address: String,
  phonenumber: String,
  description: String,
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
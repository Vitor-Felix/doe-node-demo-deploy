const mongoose = require('mongoose');

const uri = "mongodb+srv://doe-db-user:mangarosa@doe-db-cluster0.ptzpqs9.mongodb.net/doe-db-1?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
const express = require('express');
const app = express();
const routes = require('./routes')
const mongoose = require('mongoose');
// require('./config/mongo');
require('./config/mongoose');
const http = require('http');
const PORT = 3000;

app.use(express.json());

app.use('/', routes);

const server = http.createServer(app);

// const { run } = require('./config/mongo');
// connectToMongo();
// run()

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
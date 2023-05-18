const express = require('express');
const app = express();
const routes = require('./routes')
const mongoose = require('mongoose');
require('./config/mongoose');
const http = require('http');
const PORT = 3000;

app.use(express.json());

app.use('/', routes);

const server = http.createServer(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
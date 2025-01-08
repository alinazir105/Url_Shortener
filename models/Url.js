require('dotenv').config()
const mongoose = require('mongoose');

// Connect to the MongoDB database

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((result) => {
  console.log('Connected to MongoDB '+result.host);
}).catch((err) => {
  console.log('Failed to connect to MongoDB')
});

// Define your Schema and Model for URL Shortening
const urlSchema = new mongoose.Schema({
  originalUrl: {type: String, required: true},
  shortUrl: {type: String, required: true, unique: true}
})

module.exports = mongoose.model('Url', urlSchema)
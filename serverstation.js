const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Assuming stationsDb is the connection to the database that includes the test.stations collection
const stationsDb = mongoose.createConnection('mongodb+srv://user1:Hridai123M@cluster0.iaknsjj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

stationsDb.on('error', console.error.bind(console, 'Connection error:'));
stationsDb.once('open', () => {
  console.log('Connected to database');
});

const stationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  charge: String,
  username: String,
});

// Note the third parameter explicitly specifying the collection name
const Station = stationsDb.model('Station', stationSchema, 'stations');

app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find({});
    res.status(200).json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Error fetching stations' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

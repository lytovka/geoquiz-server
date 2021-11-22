const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');

const Countries = require('./models/Country');
const PAGE_SIZE = 48;

app.use(express.json());
app.use(cors());
app.use('/flags', express.static('images'))

mongoose.connect(
  'mongodb+srv://dbUser:a6qsxUg6akKH8XzE@cluster0.6ngci.mongodb.net/countries?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  }
);

app.get('/read/:country_key', async (req, res) => {
  const country_key = req.body;
  let query = { country_key: req.params.country_key };
  console.log('requested to see: ', req.params.country_key);

  Countries.findOne(query)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send(docs);
    });
});


app.get('/countries', async (req, res) => {
  let query = {};
  console.log('requests info about all countries');

  Countries.find(query)
    .select('country_key data.name data.flag')
    .lean()
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send(docs);
    });
});

app.get('/countries/:page_number', async (req, res) => {
  const limit = PAGE_SIZE;
  const skip = parseInt(req.params.page_number) * PAGE_SIZE;
  let query = {};
  console.log('requested page number ', req.params.page_number);

  Countries.find(query)
    .select('country_key flag data.name')
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send(docs);
    });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

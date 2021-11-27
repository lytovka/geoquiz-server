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

app.get('/countries_by_category/:data_category/:data_value', async (req, res) => {
  const country_key = req.body;
  let query = {};
  query[`data.${req.params.data_category}`] = req.params.data_value
  console.log('requested to see all countries belonging to : ', req.params.data_category, 'with value of', req.params.data_value);
  console.log(query)
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

app.get('/distinct_data_categories/:data_category', async (req, res) => {
  const country_key = req.body;
  let query = {};
  console.log('requested to see: ', req.params.data_category);

  Countries.find(query)
    .distinct(`data.${req.params.data_category}`)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send(docs);
    });
});


app.get('/countries_by_subregion/:subregion/', async (req, res) => {
  const country_key = req.body;
  let query = {};
  query['data.subregion'] = req.params.subregion
  console.log('requested to see all countries belonging to subregion: ', req.params.subregion);
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

app.get('/countries_by_region/:region/', async (req, res) => {
  const country_key = req.body;
  let query = {};
  query['data.region'] = req.params.region
  console.log('requested to see all countries belonging to subregion: ', req.params.region);
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


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

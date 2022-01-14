const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');

const Countries = require('./models/Country');
const Blacklist = require('./models/Blacklist');
const Score = require('./models/Score');
const PAGE_SIZE = 48;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

let blacklist = null;
let isBlacklistSet = false;

mongoose.connect(
  'mongodb+srv://dbUser:a6qsxUg6akKH8XzE@cluster0.6ngci.mongodb.net/countries?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  }
);

function getAndQuery(queryArray) {
  let resultingQuery = {};
  resultingQuery['$and'] = queryArray;
  return resultingQuery;
}

async function setBlacklist() {
  isBlacklistSet = false;
  return new Promise((resolve, reject) => {
    Blacklist.find({})
      .select('filter -_id')
      .lean()
      .exec((err, docs) => {
        if (err) {
          reject(err);
        }
        blacklist = docs;
        isBlacklistSet = true;
        resolve(blacklist);
      });
  });
};


async function getFilteredQuery(query) {
  if (blacklist == null || !isBlacklistSet) {
    await setBlacklist();
  }
  let filters = [];
  for (const filter of blacklist) {
    filters.push(filter['filter']);
  }
  return getAndQuery([query, ...filters]);
}

async function getFilteredCountriesByQuery(query, res, selectAttr = 'country_key data') {
  let finalQuery = null;
  getFilteredQuery(query).then((result) => {
    finalQuery = result;
    Countries.find(finalQuery)
      .select(selectAttr)
      .lean()
      .exec(function (err, docs) {
        if (err) {
          res.send(err);
        }
        res.send(docs);
      });
  });
}

app.post('/write/user_score/', (req, res) => {
  console.log('Requested to add score to database', req.body);
  Score.insertMany([req.body])
  res.status(201).send({ response: 'added data to the table' });
});

app.get('/scores_by_quiz_type/:difficulty/:region/:type', async (req, res) => {
  const query = { quizConfig: { levelOfDifficulty: req.params.difficulty, region: req.params.region, type: req.params.type } }
  Score.find(query)
    .select('-_id username quizScore')
    .lean()
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      }
      res.send(docs);
    });
});

app.get('/read/:country_key', async (req, res) => {
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

app.get('/distinct_data_categories/:data_category', async (req, res) => {
  let query = {};
  let finalQuery = null;
  console.log('requested to see: ', req.params.data_category);

  getFilteredQuery(query).then((result) => {
    finalQuery = result;
    Countries.find(finalQuery)
      .distinct(`data.${req.params.data_category}`)
      .lean()
      .exec(function (err, docs) {
        if (err) {
          res.send(err);
        }
        res.send(docs);
      });
  });
});

app.get('/countries', async (req, res) => {
  let query = {};
  console.log('requests info about all countries');
  getFilteredCountriesByQuery(query, res, 'country_key data.name data.flag');
});

app.get('/countries_by_category/:data_category/:data_value', async (req, res) => {
  let query = {};
  query[`data.${req.params.data_category}`] = req.params.data_value
  console.log('requested to see all countries belonging to : ', req.params.data_category, 'with value of', req.params.data_value);
  console.log(query)
  getFilteredCountriesByQuery(query, res, 'country_key data.name data.flag');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
    _id: Number,
    filter: Object
});

const Blacklist = mongoose.model('Blacklist', BlacklistSchema);
module.exports = Blacklist;

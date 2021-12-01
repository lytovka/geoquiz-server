const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    quizConfig: {
        levelOfDifficulty: { type: String },
        region: { type: String },
        type: { type: String }
    },
    quizScore: Number
}, { versionKey: false });

const Score = mongoose.model('Scores', ScoreSchema);
module.exports = Score;



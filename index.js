const express = require('express')
const mongoose = require('mongoose')
const app = express()

const Countries = require("./models/Country")

app.use(express.json())

mongoose.connect(
    "mongodb+srv://dbUser:a6qsxUg6akKH8XzE@cluster0.6ngci.mongodb.net/countries?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
    }
)

app.get("/", async(req, res) => {
    Countries.findOne({ "data.name": "Angola" }).lean().exec(function(err, docs) {
        console.log(docs);
    });
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})
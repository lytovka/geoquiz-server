const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const Countries = require("./models/Country")

app.use(express.json())
app.use(cors())

mongoose.connect(
    "mongodb+srv://dbUser:a6qsxUg6akKH8XzE@cluster0.6ngci.mongodb.net/countries?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
    }
)

app.get("/read/:country_key", async (req, res) => {
    const country_key = req.body;
    let query = { country_key: req.params.country_key }
    console.log('requested to see: ', req.params.country_key)

    Countries.findOne(query).lean().exec(function (err, docs) {
        if (err) {
            res.send(err)
        }
        res.send(docs)
    });
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})
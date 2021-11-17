const mongoose = require("mongoose")

const CountrySchema = new mongoose.Schema({
    _id : Number,
    country_key : String,
    data : {
    alpha2Code : String,
    alpha3Code : String,
    altSpellings : [String],
    area : Number,
    borders : [String], 
    callingCodes : [String],
    capital : String, 
    currencies : [{code: String, name: String, symbol: String}],
    demonym : String,
    flag : String,
    languages : [{
        iso639_1:String,
        iso639_2:String,
        name:String,
        nativeName:String}],
    latlng : [Number],
    name : String,
    nativeName : String,
    numericCode : String,
    population : Number,
    region : String,
    regionalBlocs : [{arconym: String, name: String}],
    subregion : String,
    timezones : [String],
    topLevelDomain : [String],
    translations : [String],
    cioc : String,
    description : String,
    wikiLink : String
}})

const Countries = mongoose.model("Countries", CountrySchema)
module.exports = Countries
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var url = require("url");
var https = require("https");
var pollFreqSeconds = Number(process.argv[2]);
var samplingPeriodMinutes = Number(process.argv[3]);
console.log("Polling frequency " + pollFreqSeconds + " seconds");
console.log("Sampling period " + samplingPeriodMinutes + " minutes");
var dbConn = mongodb_1.MongoClient.connect("mongodb://localhost:27017/db", function (error, db) {
    if (error) {
        console.error(error);
        return;
    }
    console.log("Connected to database");
    db.createCollection('marketdata', function (error, collection) {
        var uri = url.parse("https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-eth", true);
        var samplePeriod = { sample: [] };
        setInterval(function () {
            console.log("Polling for data");
            var req = https.request({
                host: uri.host,
                path: uri.path,
            }, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    var doc = JSON.parse(data.toString());
                    samplePeriod.sample.push(doc.result[0]);
                });
            });
            req.end();
            req.on('error', function (err) {
                console.error(err);
            });
        }, pollFreqSeconds * 1000);
        setInterval(function () {
            console.log("Inserting last 5 minutes of data");
            collection.insert(samplePeriod);
            samplePeriod = { sample: [] };
        }, samplingPeriodMinutes * 60 * 1000);
    });
});

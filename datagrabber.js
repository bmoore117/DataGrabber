"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var url = require("url");
var https = require("https");
var dbConn = mongodb_1.MongoClient.connect("mongodb://localhost:27017/db", function (error, db) {
    if (error) {
        console.error(error);
        return;
    }
    console.log("Connected to database");
    db.createCollection('marketdata', function (error, collection) {
        var uri = url.parse("https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-pivx", true);
        setInterval(function () {
            var req = https.request({
                host: uri.host,
                path: uri.path,
            }, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    var doc = JSON.parse(data.toString());
                    collection.insert(doc);
                });
            });
            req.end();
            req.on('error', function (err) {
                console.error(err);
            });
        }, 5 * 1000);
    });
});

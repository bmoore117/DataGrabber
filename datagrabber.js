"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var autobahn_1 = require("autobahn");
var mongodb_1 = require("mongodb");
var dbConn = mongodb_1.MongoClient.connect("mongodb://localhost:27017/db", function (error, db) {
    if (error) {
        console.log("Error object truthy");
        return console.dir(error);
    }
    var lastBid = [];
    var lastAsk = [];
    var lastTrade = [];
    db.createCollection('marketdata', function (error, collection) {
        var exchangeConn = new autobahn_1.Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' });
        exchangeConn.onopen = function (session) {
            function marketEvent(args, kwargs) {
                //have var for last trade, best bid, and best ask
                //on receipt of new non empty data
                //find best bid & best ask, and last trade
                //compare to previous & update
                //join and store last trade, best bid, best ask
                if (args.length > 0) {
                    //parse here
                    console.log(args);
                    console.log(kwargs);
                    //collection.insert(args);
                    //console.log("Record stored");
                }
            }
            session.subscribe('BTC_XMR', marketEvent);
            console.log("Connected to poloniex");
        };
        exchangeConn.open();
    });
    console.log("Connected to database");
});

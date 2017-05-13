"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var autobahn_1 = require("autobahn");
var mongodb_1 = require("mongodb");
var dbConn = mongodb_1.MongoClient.connect("mongodb://localhost:27017/db", function (error, db) {
    if (error) {
        console.log("Error object truthy");
        return console.dir(error);
    }
    db.createCollection('marketdata', function (error, collection) {
        var exchangeConn = new autobahn_1.Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' });
        exchangeConn.onopen = function (session) {
            function marketEvent(args, kwargs) {
                if (args.length > 0) {
                    collection.insert(args);
                    console.log("object stored");
                }
            }
            session.subscribe('BTC_XMR', marketEvent);
        };
        exchangeConn.open();
    });
    console.log("connected");
});

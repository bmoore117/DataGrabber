import { MongoClient, MongoError, MongoCallback, Db, Collection } from 'mongodb';
import * as url from 'url';
import * as https from 'https';
import { IncomingMessage } from 'http';

var dbConn = MongoClient.connect("mongodb://localhost:27017/db", function (error: MongoError, db: Db) {
    if (error) {
        console.error(error);
        return;
    }

    console.log("Connected to database");
    db.createCollection('marketdata', function (error: MongoError, collection: Collection) {
        var uri = url.parse("https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-pivx", true);

        setInterval(function () {
            var req = https.request({
                host: uri.host,
                path: uri.path,
            }, function (res: IncomingMessage) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    var doc = JSON.parse(data.toString());
                    collection.insert(doc);
                })
            });

            req.end();

            req.on('error', function (err: Error) {
                console.error(err);
            });

        }, 5 * 1000);

    });
});
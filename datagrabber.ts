import { Connection, Session } from 'autobahn';
import { MongoClient, MongoError, MongoCallback, Db, Collection } from 'mongodb';

var dbConn = MongoClient.connect("mongodb://localhost:27017/db", function (error: MongoError, db: Db) {
    if (error) {
        console.log("Error object truthy");
        return console.dir(error);
    }

    db.createCollection('marketdata', function (error: MongoError, collection: Collection) {
        var exchangeConn = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' });

        exchangeConn.onopen = function (session:Session) {

            function marketEvent(args, kwargs) {
                collection.insert(args);
            }

            session.subscribe('BTC_XMR', marketEvent);
        };

        exchangeConn.open();
    });

    console.log("connected");
});
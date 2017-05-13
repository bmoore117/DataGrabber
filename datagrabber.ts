import { Connection, Session } from 'autobahn';
import { MongoClient, MongoError, MongoCallback, Db, Collection } from 'mongodb';

var dbConn = MongoClient.connect("mongodb://localhost:27017/db", function (error: MongoError, db: Db) {
    if (error) {
        console.log("Error object truthy");
        return console.dir(error);
    }

    var lastBid = [];
    var lastAsk = [];
    var lastTrade = [];

    db.createCollection('marketdata', function (error: MongoError, collection: Collection) {
        var exchangeConn = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' });

        exchangeConn.onopen = function (session:Session) {

            function marketEvent(args: any[], kwargs:any) {

                //have var for last trade, best bid, and best ask
                //on receipt of new non empty data
                //find best bid & best ask, and last trade
                //compare to previous & update
                //join and store last trade, best bid, best ask

                if(args.length > 0) {

                    //parse here

                    collection.insert(args);
                    console.log("Record stored");
                }
            }

            session.subscribe('BTC_XMR', marketEvent);
            console.log("Connected to poloniex");
        };

        exchangeConn.open();
    });

    console.log("Connected to database");
});
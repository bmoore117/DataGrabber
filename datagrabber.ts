import { Connection, Session } from 'autobahn';
import { MongoClient, MongoError, MongoCallback, Db, Collection } from 'mongodb';


var test = [ { type: 'orderBookModify',
    data: { type: 'ask', rate: '0.02315653', amount: '0.03078201' } } ];

var test2 = [ { type: 'orderBookRemove',
    data: { type: 'bid', rate: '0.01559075' } },
  { type: 'orderBookModify',
    data: { type: 'bid', rate: '0.01559080', amount: '0.05169741' } } ];


var dbConn = MongoClient.connect("mongodb://localhost:27017/db", function (error: MongoError, db: Db) {
    if (error) {
        console.log("Error object truthy");
        return console.dir(error);
    }

    var block:any = {};
    var blocks:any = [];
    var lastTrade:any = {};
    var lastSeq = 0;

    db.createCollection('marketdata', function (error: MongoError, collection: Collection) {
        var exchangeConn = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' });

        exchangeConn.onopen = function (session:Session) {

            function marketEvent(args: any[], kwargs:any) {

                if(args.length > 0) {
                    block.seq = kwargs.seq;
                    block.marketMovments = args;
                    
                    blocks.push(block);
                }
            }

            session.subscribe('BTC_XMR', marketEvent);
            console.log("Connected to poloniex");

            setInterval(function() {

                //if last seq not null, filter blocks by it

                blocks.sort(function(one, two) {
                    return one.seq - two.seq;
                });

                var marketdata = new Array(blocks.length);

                //scan each seq for best ask & bid
                //using last trade, store
                //if hit trade, update last trade

                //everything in a block is considered to have happened at the same time, so we basically just do min and max on it
                blocks.forEach(b => {
            
                    //var bid = findBestBid(b); //highest bid
                    //var ask = findBestAsk(b); //lowest ask
                    //var trade = findBestTrade(b); //highest trade
                    //store(bid, ask lastTrade);

                    //lastTrade = trade;

                });

                //lastSeq = maxSeq(blocks);

            }, 5*60*1000);


        };

        exchangeConn.open();
    });

    console.log("Connected to database");
});
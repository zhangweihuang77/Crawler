/**
 * Created by Administrator on 2017/2/1.
 */
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var xlsx = require("node-xlsx");
var sd = require('silly-datetime');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/node';
var startTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
var movie = 0, s = 0, num = 0, ttt = 0, year = 1950;
var data = [];
var obj = [];
var node = [];

var insertDocuments = function(db , node) {
    // Get the documents collection
    var collection = db.collection('pachong');
    // Insert some documents
    collection.insertMany(node, function(err, result) {
        node.splice(0,node.length);
    });
}

function classA(body) {
    var $ = cheerio.load(body);
    var nbg = $(".nbg");
    var nbgAry = [];
    if ($("a").hasClass("nbg") == true) {
        for (var i = 0; i < nbg.length; i++) {
            var href = nbg.eq(i).attr("href");
            nbgAry[i] = href;
        }
        function classB() {
            if (ttt < nbgAry.length) {
                request(nbgAry[ttt], function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        var time = $("span[property='v:initialReleaseDate']").text();
                        var film = $("span[property='v:itemreviewed']").text();
                        var rating_num = $(".rating_num").text();
                        data[movie] = [movie, film, time, rating_num];
                        node.push({film:film,time:time,rating_num:rating_num});
                        console.log(data[movie]);
                        movie += 1;
                        ttt += 1;
                        setTimeout(function () {
                            classB();
                        }, 500);
                    }
                })
            } else {
                ttt = 0;
                MongoClient.connect(url, function(err, db) {
                    // assert.equal(null, err);
                    insertDocuments(db ,node);
                    db.close();
                });
                setTimeout(function () {
                    req("https://movie.douban.com/tag/" + year + "?start=" + (num += 20) + "&type=T");
                }, 500);
            }
        }

        classB();
    } else if ($("a").hasClass("nbg") == false) {
        obj[s] = {
            name: "" + year + "",
            data: data
        };
        if (year < 2016) {
            num = 0;
            movie = 0;
            year += 1;
            s += 1;
            data = [];
            req("https://movie.douban.com/tag/" + year + "?start=0&type=T");
        } else {
            fs.writeFileSync("sss.xlsx", xlsx.build(obj), "binary");
            var endTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
            console.log("开始时间：" + startTime);
            console.log("结束时间：" + endTime);
            console.log("完毕");
        }
    }
}

function req(url) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            classA(body);
        }
    })
}

req("https://movie.douban.com/tag/" + year + "?start=0&type=T");

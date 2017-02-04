/**
 * Created by Administrator on 2017/2/1.
 */
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var xlsx = require("node-xlsx");
var sd = require('silly-datetime');
var startTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
var movie = 0, s = 0, num = 0, ttt = 0, year = 1988;
var data = [];
var obj = [];

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
                        var text = $("#info").text();
                        var regionItem = (text.indexOf("地区:") + 4);
                        var time = $("span[property='v:initialReleaseDate']").eq(0).text();
                        var film = $("span[property='v:itemreviewed']").text();
                        var director = $("a[rel='v:directedBy']").text();
                        var rating_num = $(".rating_num").text();
                        var j = 0;
                        while (text.slice(regionItem, regionItem + j).indexOf("\n") < 0) {
                            j++;
                            var region = text.slice(regionItem, regionItem + j - 1);
                        }
                        data[movie] = [movie + 1, film, director, region, time, rating_num];
                        console.log(data[movie]);
                        movie += 1;
                        ttt += 1;
                        setTimeout(function () {
                            classB();
                        }, 800);
                    }
                })
            } else {
                ttt = 0;
                req("https://movie.douban.com/tag/" + year + "?start=" + (num += 20) + "&type=T");
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

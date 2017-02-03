/**
 * Created by Administrator on 2017/2/1.
 */
var request = require("request");
var cheerio = require("cheerio");
var sd = require('silly-datetime');
var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
var year = 1988;
var q = 0;
var movie = 0;
var ary = [];
var num = 0;
var pf = null;
var pf_10 = 0;
var pf_9 = 0;
var pf_8 = 0;
var pf_7 = 0;
var pf_6 = 0;

function req(url) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var item = $(".nbg");
            var rating = $(".rating_nums");
            if ($("a").hasClass("nbg") == true) {
                for (var i = 0; i < item.length; i++) {
                    movie += 1;
                    pf = rating.eq(i).text();
                    if (pf >= 9) {
                        pf_10 += 1;
                    } else if (pf >= 8 && pf < 9) {
                        pf_9 += 1;
                    } else if (pf >= 7 && pf < 8) {
                        pf_8 += 1;
                    } else if (pf >= 6 && pf < 7) {
                        pf_7 += 1;
                    } else if (pf < 6) {
                        pf_6 += 1;
                    }
                    ary[q] = year + "年有：" + movie + "部，6分以下：" + pf_6 + "部，6-7分：" + pf_7 + "部，7-8分：" + pf_8 + "部，8-9分：" + pf_9 + "部，9分以上：" + pf_10 + "部。";
                }
                num += 20;
                var url = "https://movie.douban.com/tag/" + year + "?start=" + num + "&type=T";
                setTimeout(function () {
                    req(url);
                }, 1000)
            } else if ($("a").hasClass("nbg") == false) {
                num = 0;
                movie = 0;
                year += 1;
                q += 1;
                if (year < 2016) {
                    start();
                } else {
                    for (var j = 0; j < ary.length; j++) {
                        console.log(ary[j]);
                    }
                    var timeend = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                    console.log("开始时间：" + time);
                    console.log("结束时间：" + timeend)
                    console.log("完毕");
                    return;
                }
            }
        }
    })
}

function start() {
    var url = "https://movie.douban.com/tag/" + year + "?start=0&type=T";
    req(url);
}

start();
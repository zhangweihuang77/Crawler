var request = require("request");
var t = 20;
var url = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start="+t+"";

function testJson(body){
    var obj = JSON.parse(body);
    var objSub = obj.subjects;
    if(objSub.length !== 0){
        for(var i = 0; i < objSub.length; i++){
            if(objSub[i].rate < 8){
                continue;
            }else{
                console.log("ID;"+ objSub[i].id +"."+ objSub[i].title+ ";" + "   评分;" +objSub[i].rate);
            }
        }
        t += 20;
        url = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start="+t+"";
        req(url);
    }else{
        console.log("完毕");
        return;
    }
}

function req(url){
    request(url , function (error, response, body) {
        if (!error && response.statusCode == 200) {
            testJson(body);
        }else if(error){
            console.log("输入错误");
        }
    })
}

req(url);
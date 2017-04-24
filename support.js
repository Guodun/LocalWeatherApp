var weatherData = []; //天气数据
/*
*获取当地天气
*API地址：https://www.heweather.com/
 */
function getWeather(city) {
    var url ="https://api.heweather.com/v5/weather?";

    $.ajax({
        url: url,
        type: "GET",
        timeout: 5000,
        dataType: 'json',
        data:{
            city: city,
            key: '7dde3b12f5734c27a7bfa74dc3d64cf5'
        },
        success: function (data) {
            weatherData[0] = data;
            // 更新显示天气数据
            try {
                //首页天气框数据
                changeToWeather();

                //未来天气预报
                getFutureWeather();
            }
            catch(err){
                console.log(err);
                alert("查询不到相关信息，请检查是否输入正确的城市名字")
            }
        },
        error: function (data) {
            console.log("error");
        },
        complete: function (data) {
            console.log("complete");
        }
    });
}
//获取当前经纬度
function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //获取当前城市
    $.ajax({
        url:  "https://api.map.baidu.com/geocoder/v2/?ak=L4Z3WER8KIjNeirIQNl7lBfKy2n4fpp2&location=" + "22.5458191865" +',' + "114.0712279731" + "&output=json",
        //url:  "https://api.map.baidu.com/geocoder/v2/?ak=L4Z3WER8KIjNeirIQNl7lBfKy2n4fpp2&location=" + latitude +',' + longitude + "&output=json",
        type: "GET",
        timeout: 5000,
        dataType: 'jsonp',

        //显示当前城市
        success: function (data) {
            var wholeNameCity = data.result.addressComponent.city;
            var city = wholeNameCity.slice(0, wholeNameCity.length - 1);
            $("#city").data("city", city);
            $("#city").text($("#city").data("city"));

            getWeather(city);
        },
        error: function (data) {
            console.log("getCity error");
            console.log(data);
        },
        complete: function (data) {
            console.log("getCity complete");
        }
    });

}

function errorHandler(error) {
    switch(error.code){
        case 0:
            alert("获取位置信息出错！");
            break;
        case 1:
            alert("您设置了阻止该页面获取位置信息！");
            break;
        case 2:
            alert("浏览器无法确定您的位置！");
            break;
        case 3:
            alert("获取位置信息超时！");
            break;
        default:
            alert('不明原因');
            break;
    }
}

function getLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler);
    }else{
        console.log("浏览器不支持定位");
    }
}

//获取实时时间
function getTime() {
    var date = new Date().toString().split(" ");
    var timeInfo = {
        month: date[1],
        year: date[3],
        time: date[4],
        day: date[2]
    };
    return timeInfo;
}

//更新时间
function updateTime() {
    var time = getTime();
    $("#date").text(time.month + " " + time.day + ', ' + time.year);
    $("#time").text(time.time);
}

//根据时间段, 设置不同的背景颜色
function updateTimeBg() {
    //var hour = getTime().time.slice(0,2);
    var hour = 1;
    if (hour <= 12){
        $(".container-bg").addClass("bg-morning");
    }
    else if (hour > 12 && hour <=17){
        $(".container-bg").addClass("bg-afternoon");
    }
    else if(hour >17){
        $(".container-bg").addClass("bg-night");
    }else{
        console.log("updateTimeGg error")
    }
}

//点击按钮事件
function clickIconBtn() {
    //显示隐藏查询天气
    $("#search-icon").click(function () {
        $("#search-container").slideToggle();
    });
    //显示隐藏注意事项
    $("#notice-icon").click(function () {
        $(".notice").slideToggle();
    });
    //显示隐藏未来天气
    $("#future-btn").click(function () {
        $(".future-weather-container").slideToggle();
    });
    //切换空气质量数据
    $("#airInfo").click(function () {
        changeToAir();
    });
    //切换天气情况数据
    $("#weather").click(function () {
        changeToWeather();
    });

}
//切换查询空气情况
function changeToAir() {

    //切换天气框数据
    $("#tempName").text("空气指数");
    $("#humidityName").text("pm25");
    $("#windName").text("pm10");

    $("#temp").text(weatherData["0"].HeWeather5["0"].aqi.city.qlty);
    $("#humidity").text(weatherData["0"].HeWeather5["0"].aqi.city.pm25);
    $("#wind").text(weatherData["0"].HeWeather5["0"].aqi.city.pm10);

}

//切换查询天气情况
function changeToWeather() {
    var imageUrl = getWeatherImage(weatherData["0"].HeWeather5["0"].now.cond.code);

    //切换天气框数据
    $("#tempName").text("温度");
    $("#humidityName").text("湿度");
    $("#windName").text("风速");

    $("#temp").text(weatherData["0"].HeWeather5["0"].now.tmp + " °C"); //温度
    $("#humidity").text(weatherData["0"].HeWeather5["0"].now.hum + " %"); //湿度
    $("#wind").text(weatherData["0"].HeWeather5["0"].now.wind.spd + " m/s"); //风速
    $("#weatherIntroduce").text(weatherData["0"].HeWeather5["0"].now.cond.txt); //天气介绍
    $("#city").text(weatherData[0].HeWeather5["0"].basic.city); //城市
    $("#weatherImage").attr("src", imageUrl);

}

//查询某个城市天气
function searchCityWeather() {

    $("#search-btn").click(function (data) {
        var searchCity = $("#search-weather").val();
        getWeather(searchCity);
    })
}

//获取天气图片
function getWeatherImage(code) {
    imageUrl = "https://cdn.heweather.com/cond_icon/" + code + ".png";
    return imageUrl;
}

//未来一周天气
function getFutureWeather(){

    $("#next-future-1").empty();

    //模版化数据渲染
    for (var i = 0; i < weatherData["0"].HeWeather5["0"].daily_forecast.length; i++) {
        console.log("123");
        var template = '<div class="row next-weatherData" >' +
            '<div class="col-md-3">' +
            '<h2> '+ weatherData["0"].HeWeather5["0"].daily_forecast[i].date.substr(5) + '</h2> ' +
            '</div>' +
            '<div class="col-md-2">' +
            '<img width="50px" height="50px" src="' + getWeatherImage(weatherData["0"].HeWeather5["0"].daily_forecast[i].cond.code_d) + '">' +
            '<p>' + weatherData["0"].HeWeather5["0"].daily_forecast[i].cond.txt_d + '</p>' +
            '</div>' +
            '<div class="col-md-2">' +
            '<h4 id="ftTmpName'+ i +'">温度</h4>' +
            '<p id="ft-tmp-'+ i + '">' + weatherData["0"].HeWeather5["0"].daily_forecast[i].tmp.min + ' °C' +'</p>' +
            '</div>' +
            '<div class="col-md-2">' +
            '<h4 id="ftHumName'+ i +'">湿度</h4>' +
            '<p id="ft-hum-'+ i + '">' + weatherData["0"].HeWeather5["0"].daily_forecast[i].hum + ' %' +'</p>' +
            '</div>' +
            '<div class="col-md-2">' +
            '<h4 id="ftSpdName'+ i +'">风速</h4>' +
            '<p id="ft-spd-'+ i + '">' + weatherData["0"].HeWeather5["0"].daily_forecast[i].wind.spd + ' m/s' +'</p>' +
            '</div>' +
            '</div> ' +
            '<hr>';

        $("#next-future-1").append(template);
    }
}

$(function () {
    getLocation();
    setInterval(updateTime,1000);
    updateTimeBg();
    clickIconBtn();
    searchCityWeather();
});

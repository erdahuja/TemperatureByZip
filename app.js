var express = require('express');

var path = require("path");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
var app = express();

var weather = new ForecastIo("48ba479852171394166d8cb7cbea2246");

app.use(express.static(path.resolve(__dirname, "public")));


app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {


    res.render("index");
});

app.get(/^\/(\d{5})$/, function (req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);

    if (!location.zipcode) {

        next();
        return;

    }
    var lat = location.latitude;
    var long = location.longitude;


    weather.forecast(lat, long, function (err, data) {

        if (err) {
            next();
            return;
        }

        //console.log(zipcode, location);
        //console.log("weather is ", data.currently.temperature);
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });

});

//app.use(function (req, res, next) {
//
//    console.log("req ip is : ", req.url);
//    console.log("req date is : ", new Date());
//
//    next();
//})
//
//
//app.use(function (req, res, next) {
//
//    var fp = path.join(__dirname, "public", req.url);
//
//    fs.stat(fp, function (err, fileinfo) {
//
//        if (err) {
//
//            next();
//            return;
//        }
//        if (fileinfo.isFile()) {
//            res.sendFile(fp);
//        } else {
//            next();
//        }
//
//    });
//
//
//});
app.use(function (req, res) {

    res.status(404);
    res.send("file not found");
})

app.listen(3000, function () {

    console.log("Server started at 3000");
});

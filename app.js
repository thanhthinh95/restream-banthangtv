const http = require("http"); 
const config = require("config");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const sequelize = require("./sequelize");
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/assets", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("_secret_"));

app.use(session({
    secret: "zorovhs",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24*60*60*1000 } 
}));

var port = config.get("site.port");
global.Op = Op;
global.Sequelize = Sequelize;

//
const cors = require("cors");
var allowedOrigins = config.get("allow");
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            return callback(null, false);
        }
        return callback(null, true);
    }
}));
//cors
app.use("/", require("./routes"));

sequelize.sync().then(() => {
    http.createServer(app).listen(port,function(req,res) {
        console.log(`Dashboard is running ${port}`);
    });
});
const express = require("express");
var router = express.Router();
var {} = require("../sequelize");

router.use("/ajax", require("./ajax"));
router.use("/api", require("./api"));
router.use("/m3u8", require("./m3u8"));

router.use((req, res, next) => {
    if(req.session.userid) next();
    else {
        if(req.method == "POST") {
            res.json({status:0,msg:"Auth error"});
        } else {
            res.render("login");
        }
    }
});

router.get("/", (req,res) => {
    res.render("index");
});

router.use("/link", require("./link"));

module.exports = router;
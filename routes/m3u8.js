const express = require("express");
var router = express.Router();
var { Hls } = require("../sequelize");
const fs = require("fs");
router.get("/:md5file/index.m3u8", (req,res) => {
    var md5file = req.params.md5file;
    Hls.findOne({
        where: {
            md5file
        },
        raw: true
    }).then(data => {
        if(data != null) {
            res.end(data.content);
        } else {
            res.json({status:0,msg:"Ko có hls"});
        }
    })
});

router.get("/:md5file/:name", (req,res) => {
    var md5file = req.params.md5file;
    var name = req.params.name;
    var path = `./hls/${md5file}/${name}`;
    if(fs.existsSync(path)) {
        fs.createReadStream(path).pipe(res);
    } else {
        res.json({status:0,msg:"Ko có file"});
    }
});
module.exports = router;
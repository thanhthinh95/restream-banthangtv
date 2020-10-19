const express = require("express");
var router = express.Router();
var { Link } = require("../sequelize");
var md5 = require("md5");

router.get("/add", (req,res) => {
    var url = req.query.url;
    var md5file = md5(url);
    Link.create({
        url,
        md5file
    }).then(() => {
        res.json({status:1,msg:"Thêm link thành công"})
    }).catch(() => {
        res.json({status:0,msg:"Thêm link lỗi"});
    })
});

router.get("/delete", (req,res) => {
    var url = req.query.url;
    var md5file = md5(url);
    var info = Link.findOne({
        where: {
            url,
            md5file
        },
        raw: true
    });
    if(info != null) {
        if(info.status != 0 && info.host != "") {
            Link.update({
                delete:1
            }, {
                where: {
                    url,
                    md5file
                }
            }).then(() => {
                res.json({status:1,msg:"Đặt điều kiện xóa thành công"})
            }).catch(() => {
                res.json({status:0,msg:"Lỗi"});
            })
        } else {
            Link.destroy({
                where: {
                    url,
                    md5file
                }
            }).then(() => {
                res.json({status:1,msg:"Xóa thành công"})
            }).catch(() => {
                res.json({status:0,msg:"Lỗi"});
            })
        }
    }
});

router.get("/get_m3u8", (req,res) => {
    var url = req.query.url;
    var md5file = md5(url);
    Link.findOne({
        where: {
            url,
            md5file
        },
        raw: true
    }).then(data => {
        if(data != null) {
            if(data.status == 1 || data.status == 2) {
                res.json({
                    status:1,
                    md5file,
                    url: `${data.host}/m3u8/${data.md5file}/index.m3u8`
                });
            } else if(data.status == 3) {
                res.json({status:0,msg:"Link lỗi"});
            } else {
                res.json({status:0,msg:"Link chưa chạy"});
            }
        } else {
            res.json({status:0,msg:"ko có link"});
        }
    })
});

router.get("/iframe", (req,res) => {
    var m3u8 = req.query.m3u8;
    res.render("iframe", {
        m3u8
    });
});

module.exports = router;
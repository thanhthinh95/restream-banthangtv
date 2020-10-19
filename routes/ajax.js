const express = require("express");
var router = express.Router();
var { User } = require("../sequelize");
var md5 = require("md5");

router.get("/generate", (req,res) => {
    var username = req.query.username;
    var password = req.query.password;
    User.count({
        where: {
            username,
            password
        }
    }).then(count => {
        if(count == 0) {
            User.create({
                username,
                password:md5(password)
            }).then(() => {
                res.json({status:1,msg:"Tạo tài khoản thành công"})
            }).catch(() => {
                res.json({status:0,msg:"Lỗi"});
            })
        } else {
            res.json({status:0,msg:"Tài khoản đã tồn tại"});
        }
    })
});

router.post("/login", (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    if(username && password) {
        User.findOne({
            where: {
                username,
                password:md5(password)
            },
            raw: true
        }).then(data => {
            console.log(data);

            if(data != null) {
                req.session.userid = data.id;
                res.json({status:1,msg:"Đăng nhập thành công"});
            } else {
                res.json({status:0,msg:"Sai thông tin"});
            }
        })
    } else {
        res.json({status:0,msg:"Thiếu dữ liệu"});
    }
});

module.exports = router;
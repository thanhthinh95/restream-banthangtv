const express = require("express");
var router = express.Router();
var { Link } = require("../sequelize");
var md5 = require("md5");
router.get("/add", (req,res) => {
    res.render("add_link");
});

router.post("/add", (req,res) => {
    var url = req.body.url;
    var md5file = md5(url);
    Link.create({
        url,
        md5file
    }).then(() => {
        res.json({status:1,msg:"Thêm link thành công",redirect:"/link/"})
    }).catch((e) => {
        console.log(e);
        res.json({status:0,msg:"Thêm link lỗi"});
    })
});

router.post("/delete", (req,res) => {
    var md5file = req.body.id;
    var info = Link.findOne({
        where: {
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
                    md5file
                }
            }).then(() => {
                res.json({status:1,msg:"Đặt điều kiện xóa thành công"})
            }).catch(() => {
                res.json({status:0,msg:"Lỗi"});
            });
        } else {
            Link.destroy({
                where: {
                    md5file
                }
            }).then(() => {
                res.json({status:1,msg:"Xóa thành công"})
            }).catch(() => {
                res.json({status:0,msg:"Lỗi"});
            })
        }
    } else {
        res.json({status:0,msg:"Lỗi"});
    }
});

router.get("/:type(|completed|uncompleted|error|delete)",(req,res) => {
    var type = req.params.type;
    if(!type) type = "all";
    res.render("link",{
        status:type
    });
});

router.get("/ajax", (req,res) => {
    var where = {}, column = "id";
    var search = req.query.search.value;
    var status = req.query.status;
    if(search) {
        if(status == "completed") {
            where = {
                [Op.or]:[{
                    url:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    md5file:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    host:{
                        [Op.like]:`%${search}%`
                    }
                }],
                status:2
            }
        }
        if(status == "uncompleted") {
            where = {
                [Op.or]:[{
                    url:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    md5file:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    host:{
                        [Op.like]:`%${search}%`
                    }
                }],
                status:1
            }
        }
        if(status == "error") {
            where = {
                [Op.or]:[{
                    url:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    md5file:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    host:{
                        [Op.like]:`%${search}%`
                    }
                }],
                status:3
            }
        }
        if(status == "all") {
            where = {
                [Op.or]:[{
                    url:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    md5file:{
                        [Op.like]:`%${search}%`
                    }
                },{
                    host:{
                        [Op.like]:`%${search}%`
                    }
                }]
            }
        }
    } else {
        if(status == "completed") where.status = 2
        if(status == "uncompleted") where.status = {
            [Op.not]:2
        }
        if(status == "error") where.status = 2
    }
    where.delete = 0;
    if(status == "delete") where.delete = 1;
    var start = Number(req.query.start);
    var length = Number(req.query.length);
    if(req.query.order[0].column == 0) column = "id";
    if(req.query.order[0].column == 1) column = "url";
    if(req.query.order[0].column == 2) column = "status";
    var type = req.query.order[0].dir;
    if(Number.isInteger(start) && Number.isInteger(length)) {
        var array = [];
        array.push(Link.count({
            where:where
        }));
        array.push(Link.findAll({
            where:where,
            order:[
                [column,type]
            ],
            offset:start,
            limit:length
        }))
        Promise.all(array).then(values => {
            res.json({aaData:values[1],iTotalDisplayRecords:values[0],iTotalRecords:values[0]});
        })
    } else {
        res.json({status:0,msg:"Error page"});
    }
});

module.exports = router;
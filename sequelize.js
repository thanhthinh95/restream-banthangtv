const config = require("config");
const Sequelize = require('sequelize').Sequelize;
const UserModel = require("./models/user");
const LinkModel = require("./models/link");
const HlsModel = require("./models/hls");
var mysql = config.get("mysql");

var sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {
    host: mysql.host,
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: mysql.logging
});

var User = UserModel(sequelize, Sequelize);
var Link = LinkModel(sequelize, Sequelize);
var Hls = HlsModel(sequelize, Sequelize);

// Video.sync({force:true}).then(() => {
//     console.log("sync");
// })

function sync() {
    return new Promise((resolve,reject) => {
        sequelize.sync({
            force: mysql.sync
        }).then(async() => {
            resolve();
        });
    });
}

module.exports = {
    sync,
    User,
    Link,
    Hls
}
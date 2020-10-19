var { Link, Hls } = require("./sequelize");
const config = require("config");
const host = config.get("site.host");
const fs = require("fs");
const rimraf = require("rimraf");
var functions = require("./lib/functions");
async function run() {
    var data = await Link.findOne({
        where: {
            host,
            delete: 1
        },
        raw: true
    });
    while(!data) {
        await functions.sleep(60000);
        data = await Link.findOne({
            where: {
                host,
                delete: 1
            },
            raw: true
        });
    }
    var path = `./hls/${data.md5file}/`;
    rimraf(path, async() => {
        await Link.destroy({
            where: {
                md5file:data.md5file,
                host
            }
        });
        await Hls.destroy({
            where: {
                md5file:data.md5file
            }
        });
        console.log("xóa thành công");
        await functions.sleep(5000);
        run();
    });
}
(async() => {
    run();
})();
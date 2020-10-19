const axios = require("axios");
const request = require("request-promise");
const config = require("config");
const host = config.get("site.host");
const fs = require("fs");
var { Link, Hls } = require("./sequelize");
var functions = require("./lib/functions");

const SLEEP_MILISECOND = 5000;

async function run() {
    var link = await Link.findOne({
        where: {
            status: 0
        },
        raw: true
    });

    while (!link) {
        console.error("No link");
        await functions.sleep(SLEEP_MILISECOND);
        link = await Link.findOne({
            where: {
                status: 0
            },
            raw: true
        });
    }

    let { url, md5file } = link;

    await Link.update({
        status: 1,
        host
    }, {
        where: {
            md5file,
            url
        },
        raw: true
    });

    // var m3u8 = await get_link(url).catch((err) => {
    //     console.error(err);
    //     return false;
    // });
    let m3u8 = url;


    if (m3u8) {
        //đệ quy
        // var stream = await restream(m3u8, md5file).then(() => true).catch(() => false);
        // while (stream) {
        //     await functions.sleep(1000);
        //     stream = await restream(m3u8, md5file).then(() => true).catch(() => false);
        // }

        //thinh_dev
        await getStream(m3u8, md5file);
    } else {
        //getlink m3u8 lỗi
        await Link.update({
            status: 3
        }, {
            where: {
                id: link.id
            }
        });
    }
    await functions.sleep(SLEEP_MILISECOND);
    run();
}

async function get_link(url) {
    return await new Promise(async (resolve, reject) => {
        if (url.includes("banthang.tv")) {
            var html = await axios.get(url).catch(() => false);
            if (html) {
                html = html.data;
                var iframe = functions.explode_by('<iframe id="iframe-tv" src="', '"', html);
                if (iframe) {
                    iframe = `https://banthang.tv${iframe}`;
                    var options = {
                        "method": "GET",
                        "url": iframe
                    };
                    request(options).then(body => {
                        var m3u8 = functions.explode_by('var urlStream = "', '"', body);
                        console.log(m3u8);
                        resolve(m3u8);
                    }).catch((err) => {
                        console.error("get link m3u8 error")
                        reject(err);
                    });
                } else {
                    console.error("get link m3u8 error")
                    reject("No iframe");
                }
            } else {
                reject("block");
            }
        } else {
            var config = {
                method: 'get',
                url: url,
                headers: {
                    'Referer': 'http://bongdatructuyen.live/truc-tiep/tay-ban-nha/la-liga/levante-vs-sevilla/g34880',
                }
            };
            var html = await axios(config).catch(() => false);
            if (html) {
                html = html.data;
                var m3u8 = functions.explode_by('var src = "', '"', html);
                console.log(m3u8);
                resolve(m3u8);
            } else {
                reject("block");
            }
        }
    })
}

async function get_content(m3u8) {
    return await new Promise((resolve, reject) => {
        var options = {
            "method": "GET",
            "url": m3u8,
            rejectUnauthorized: false,
        };
        request(options).then(html => {
            resolve(html);
        }).catch((err) => {
            console.error("get content m3u8 lỗi")
            reject(err);
        })
    })
}

async function download({ link, md5file, m3u8, name }) {
    return await new Promise((resolve, reject) => {
        if (!fs.existsSync(`./hls/${md5file}/`)) {
            fs.mkdirSync(`./hls/${md5file}/`);
        }
        if (fs.existsSync(`./hls/${md5file}/${name}`)) {
            resolve(`./hls/${md5file}/${name}`);
        } else {
            let file = fs.createWriteStream(`./hls/${md5file}/${name}`);
            request({
                uri: link,
                headers: {
                    "Referer": m3u8,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
                },
                rejectUnauthorized: false,
            }).pipe(file).on('finish', () => {
                console.log(`Download done ./hls/${md5file}/${name}`)
                resolve(`./hls/${md5file}/${name}`);
            }).on('error', (error) => {
                console.error(`Download error ./hls/${md5file}/${name}`)
                reject(error);
            })
        }
    })
}


/**
 * thinh_dev
 * @param m3u8
 * @param md5file
 * @returns {Promise<void>}
 */
const getStream = async (m3u8, md5file) => {
    try {
        let content = await get_content(m3u8).catch((err) => {
            console.error(err);
            return null;
        });

        if (!content) {
            console.log(`Done ${m3u8}`);
            await Link.update({
                status: 2
            }, {
                where: {
                    md5file
                }
            });
        } else {
            let array = content.toString().split(`\n`);
            for (let item of array) {
                if (item.indexOf(`/`) === 0) {
                    let url_m3u8 = new URL(m3u8);
                    let link = url_m3u8.origin + item;
                    await download({
                        link: link,
                        md5file,
                        m3u8,
                        name: new Date().getTime() + `.ts`,
                    }).catch((e) => console.log(e.toString()));
                }
            }

            //update content hls
            var check = await Hls.count({
                where: {
                    md5file
                },
                raw: true
            }).then(count => {
                return count;
            });
            if (check === 0) {
                await Hls.create({
                    md5file,
                    content
                });
            } else {
                await Hls.update({
                    content
                }, {
                    where: {
                        md5file
                    }
                });
            }

            console.log(`Done ${m3u8}`);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};


async function restream(m3u8, md5file) {
    return await new Promise(async (resolve, reject) => {
        var content = await get_content(m3u8).catch((err) => {
            console.error(err);
            return false;
        });
        if (content) {
            var array = [];
            const regex = /(.*?)\.ts/gm;
            var array = [];
            let m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach((match, groupIndex) => {
                    if (groupIndex == 0) {
                        array.push(match);
                    }
                });
            }
            for (var i = 0; i < array.length; i++) {
                let filename = m3u8.split("/").pop();
                let linkts = functions.replaceAll(m3u8, filename, array[i]);
                await download({
                    link: linkts,
                    md5file,
                    m3u8,
                    name: array[i]
                }).catch(() => false);
            }
            //update content hls
            var check = await Hls.count({
                where: {
                    md5file
                },
                raw: true
            }).then(count => {
                return count;
            });
            if (check == 0) {
                await Hls.create({
                    md5file,
                    content
                });
            } else {
                await Hls.update({
                    content
                }, {
                    where: {
                        md5file
                    }
                });
            }
            resolve();
        } else {
            //link chạy xong
            console.log(`Done ${m3u8}`);
            await Link.update({
                status: 2
            }, {
                where: {
                    md5file
                }
            });
            reject();
        }
    });
}

(async () => {
    run();
})();
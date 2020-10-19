/**
 * Khởi tạo số ngẫu nhiên
 * @param {Number} min Số bắt đầu
 * @param {Number} max Số kết thúc
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Tạm dừng code
 * @param {Number} ms Thời gian chờ (milisecond)
 */
async function sleep(ms){
    return await new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

/**
 * Lấy time hiện tại
 */
function timenow() {
    var time = Math.round(new Date().getTime() / 1000);
    return time;
}
/**
 * Cắt lấy chuỗi ở giữa
 * @param {String} begin Chuỗi bắt đầu
 * @param {String} end Chuỗi kết thúc
 * @param {String} data Dữ liệu cần cắt
 */
function explode_by(begin,end,data) {
    try {
        data = data.split(begin);
        data = data[1].split(end);
        return data[0];
    } catch(ex) {
        return "";
    }
}


function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
/**
 * Replace toàn bộ chuỗi
 * @param {String} str Chuỗi cần replace
 * @param {String} find Seach
 * @param {String} replace Replace 
 */
function replaceAll(str, find, replace) {
    try {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    } catch(ex) {
        return "";
    }
}

/**
 * Cắt chuỗi
 * @param {String} string Chuỗi cần cắt
 * @param {Number} length Số lượng chữ cái
 */
function CutName(string,length) {
    string = string.trim();
    string = removeHtml(string);
    if(string.length < length) return string;
    else {
        string = string.substring(0, length) + " ...";
        return string;
    }
}

/**
 * Loại bỏ html
 * @param {String} str Nội dung
 */
function removeHtml(str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
}

/**
 * Chuyển đổi chuỗi thành url
 * @param {String} str Nội dung cần chuyển
 */
function convert_slug(str) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();
    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    // Xóa ký tự đặc biệt 
    str = str.replace(/([^0-9a-z-\s])/g, '');
    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');
    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');
    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');
    // return
    return str;
}

module.exports = {
    sleep,
    explode_by,
    replaceAll,
    CutName,
    convert_slug,
    removeHtml,
    timenow,
    random
}
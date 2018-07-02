const app = getApp();
const HEADER = app.globalData.HEADER;

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const toDate = number => {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (Y + "-" + M + "-" + D + " " + H + ":" + m)
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const getFloatStr = num => {
    num += '';
    num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符
    if (/^0+/) //清除字符串开头的0
        num = num.replace(/^0+/, '');
    if (!/\./.test(num)) //为整数字符串在末尾添加.00
        num += '.00';
    if (/^\./.test(num)) //字符以.开头时,在开头添加0
        num = '0' + num;
    num += '00'; //在字符串末尾补零
    num = num.match(/\d+\.\d{2}/)[0];
    return num;
}

//封装微信ajax请求
/*
url -- 接口的名称 - 不用传固定的部分
data -- 传递的参数
callback -- 回调函数
method -- 请求的方式
hasHeader -- 是否有头部字段
header -- 测试的url
*/
const wxAjax = (url, data, callback,method,hasHeader,useUrl) => {
    var type = "";
    var header = {'content-type': 'application/json'};
    var temp = HEADER + url;
    if(method == "POST" || method == "post"){
        type = "POST";
    }else{
        type = "GET";
    }
    if (!!useUrl){
        temp = useUrl;
    }
    if (!!hasHeader) {
        var token = wx.getStorageSync("token");
        header = {
            'content-type': 'application/json',
            "XX-Ap-Version":"1.0.0",
            "XX-Device-Type":"wxapp",
            "XX-Token": token
        }
    }
    wx.request({
        url: temp, //仅为示例，并非真实的接口地址
        data: data,
        method:type,
        header: header,
        success: function (res) {
            if (!!callback) {
                callback(res);
            }
        }
    })
}

//时间戳转换成日期时间  
const js_date_time = (unixtime) => {
    var dateTime = new Date(parseInt(unixtime))
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var now = new Date();
    var now_new = Date.parse(now.toDateString());  //typescript转换写法  
    var milliseconds = now_new - dateTime;
    var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    return timeSpanStr;
}

module.exports = {
    formatTime: formatTime,
    toDate: toDate,
    getFloatStr: getFloatStr,
    wxAjax: wxAjax,
    format: js_date_time
}

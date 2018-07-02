//index.js
//获取应用实例
var util = require("../../utils/util.js");
const app = getApp();
Page({
    data: {
        menuList:[]
    },
    onLoad: function () {
        this.checkLogin();
        this.getMenu();
    },
    //检查是否已经登陆了
    checkLogin: function () {
        var userFlag = wx.getStorageSync("userInfo");
        console.log(userFlag);
        if (!userFlag) {
            wx.redirectTo({
                url: '../chat/chat',
            });
        }
    },
    //获取类型信息
    getMenu:function(){
        var that = this;
        util.wxAjax("/api/home/slides/1",{
        },function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                if(data.data[0].items.length > 0){
                    that.setData({
                        menuList: data.data[0].items
                    });
                }
            }
        });
    },
    //打开子页面
    openChildWin:function(options){
        var type = options.currentTarget.dataset.type;
        var url = "";
        if(type == "客户报备"){
            url = "../reported/reported"
        } else if (type == "整装商城"){
            url = "../shop/shop"
        }
        wx.navigateTo({
            url: url,
        })
    }
})

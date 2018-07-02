// pages/login/login.js
var util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username:"",
        password:""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    //切换手机登录页面
    changePhoneLogin:function(){
        wx.redirectTo({
            url: '../login_phone/login_phone',
        });
    },
    //打开注册账号页面
    openRegist:function(){
        // wx.redirectTo({
        //     url: '../regist/regist',
        // });
        wx.navigateTo({
            url: '../regist/regist',
        })
    },
    //记录输入的信息
    input: function (options) {
        var type = options.currentTarget.dataset.type;
        var value = options.detail.value;
        this.setData({
            [type]: value
        });
    },
    login:function(){
        var that = this;
        var username = that.data.username;
        var password = that.data.password;
        if (username == "") {
            wx.showToast({
                title: '账号不能为空！',
                icon: "none"
            });
            return false
        }
        if (password == "") {
            wx.showToast({
                title: '密码不能为空！',
                icon: "none"
            });
            return false
        }
        util.wxAjax("/api/user/public/login",{
            "username":username,
            "password":password,
            "device_type":"wxapp"
        },function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                wx.redirectTo({
                    url: '../index/index'
                });
                wx.setStorageSync("userInfo",data.data.user);
                wx.setStorageSync("token",data.data.token);
            }else{
                wx.showToast({
                    title: data.msg,
                    icon: "none"
                })
            }
        },"POST");
    },
    //打开联系客服
    openContact: function () {
        wx.navigateTo({
            url: '../chat/chat',
        })
    }
})
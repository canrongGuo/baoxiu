// pages/login/login.js
var util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        times: 0,//获取验证码剩余时间
        mobile:"",
        code:""
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
    changePhoneLogin: function () {
        wx.redirectTo({
            url: '../login/login',
        });
    },
    //记录输入的信息
    input: function (options) {
        var type = options.currentTarget.dataset.type;
        var value = options.detail.value;
        this.setData({
            [type]: value
        });
    },
    //验证码倒计时
    getCode: function () {
        var that = this;
        var times = that.data.times;
        var mobile = that.data.mobile;
        if (mobile !=""){
            //限制不能多次点击
            if (times <= 0) {
                var index = 60;
                var timer = setInterval(function () {
                    if (index <= 0) {
                        clearInterval(timer);
                    }
                    that.setData({
                        "times": index--
                    });
                }, 1000);
                //请求后台获取验证码
                util.wxAjax("/api/user/verification_code/send_mobile", {
                    "mobile": mobile
                }, function (res) {
                    console.log(res);
                }, "POST");
            }
        }else{
            wx.showToast({
                title: '请输入手机号',
                icon:"none"
            })
        }
    },
    login:function(){
        var that = this;
        var mobile = that.data.mobile;
        var code = that.data.code;
        var reg = /^1[3456789]\d{9}$/;
        if (mobile == "") {
            wx.showToast({
                title: '手机号不能为空！',
                icon: "none"
            });
            return false
        }
        if (!reg.test(mobile)) {
            wx.showToast({
                title: '请输入正确的手机号！',
                icon: "none"
            });
            return false
        }
        if (code == "") {
            wx.showToast({
                title: '验证码不能为空！',
                icon: "none"
            });
            return false
        }
        util.wxAjax("/api/user/public/login_mobile", {
            "mobile": mobile,
            "code": code,
            "device_type": "wxapp"
        }, function (res) {
            var data = res.data;
            if (data.code == 1 || data.code == "1") {
                wx.redirectTo({
                    url: '../index/index'
                });
                wx.setStorageSync("userInfo", data.data.user);
                wx.setStorageSync("token", data.data.token);
            } else {
                wx.showToast({
                    title: data.msg,
                    icon: "none"
                })
            }
        },"POST");
    },
    //打开联系客服
    openContact:function(){
        wx.navigateTo({
            url: '../chat/chat',
        })
    },
    //打开注册账号页面
    openRegist: function () {
        // wx.redirectTo({
        //     url: '../regist/regist',
        // });
        wx.navigateTo({
            url: '../regist/regist',
        })
    },
})
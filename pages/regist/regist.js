// pages/login_all/login_all.js
var util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        times:0,//获取验证码剩余时间
        username:"",
        password:"",
        phone:"",
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
    //记录输入的信息
    input:function(options){
        var type = options.currentTarget.dataset.type;
        var value = options.detail.value;
        this.setData({
            [type]:value
        });
    },
    //打开客服对话窗
    openChat:function(){
        wx.navigateTo({
            url: '../chat/chat',
        })
    },
    //验证码倒计时
    getCode:function(){
        var that = this;
        var times = that.data.times;
        var phone = that.data.phone;
        var reg = /^1[3456789]\d{9}$/;
        if(phone == ""){
            wx.showToast({
                title: '手机不能为空！',
                icon:"none"
            });
            return false;
        }
        if (!reg.test(phone)){
            wx.showToast({
                title: '请输入正确的手机号！',
                icon: "none"
            });
            return false;   
        }
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
            util.wxAjax("/api/user/verification_code/send_mobile",{
                "mobile":phone
            },function(res){
                console.log(res);
            },"POST");
        }
    },
    //用户注册
    register:function(){
        var username = this.data.username;
        var password = this.data.password;
        var phone = this.data.phone;
        var code = this.data.code;
        if(username == ""){
            wx.showToast({
                title: '账号不能为空！',
                icon:"none"
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
        if (phone == "") {
            wx.showToast({
                title: '手机不能为空！',
                icon: "none"
            });
            return false
        }
        if (code == "") {
            wx.showToast({
                title: '验证码不能为空！',
                icon: "none"
            },"POST");
            return false
        }
        util.wxAjax("/api/user/public/register",{
            "username":username,
            "password":password,
            "mobile":phone,
            "code":code,
            "device_type":"wxapp"
        },function(res){
            var data = res.data;
            wx.showToast({
                title:data.msg,
                icon: "none"
            });
            if(data.code == 1 || data.code == "1"){
                // wx.redirectTo({
                //     url: '../login/login',
                // });
                wx.navigateBack();
            }
        },"POST");
    }
})
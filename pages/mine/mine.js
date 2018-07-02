// pages/mine/mine.js
var util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        page:1,//页数
        menuList:[],
        listPage: 1,
        pageTotal: 1,
        windowHeight: 0,//获取屏幕高度 
        isupper: true,//标记是否正在上拉
        islower: true,//标记是否正在下拉
        nextpage: false,//是否有下一页
        isloading: false//判断是否在加载数据
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.getList();
        //获取屏幕高度  
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        });
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
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false,
        });
        this.getList("",true);
    },
    clearInput: function () {
        this.hideInput();
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    //执行搜索
    searchList:function(){
        var value = this.data.inputVal;
        this.getList(value,true);
    },
    //获取个人报备数据
    getList:function(value,flag,callback){
        var that = this;
        wx.showLoading({
            title: "加载中..."
        });
        var jsonData = {
            "page": that.data.listPage
        }
        if(!!value && value != ""){
            jsonData.name = value;
            jsonData.title = value;
        }
        util.wxAjax("/api/user/xbuser/get_log",jsonData,function(res){
            var data = res.data;
            var list = (!!flag?[]:that.data.menuList);
            wx.hideLoading();
            if(data.code == 1 || data.code == "1"){
                var dataArr = data.data.data;
                if (dataArr.length > 0){
                    for(var i=0;i<dataArr.length;i++){
                        list.push({
                            "cname":dataArr[i].cname,
                            "name":dataArr[i].name,
                            "mobile":dataArr[i].mobile,
                            "ka":dataArr[i].ka,
                            "city":dataArr[i].city,
                            "area": dataArr[i].area,
                            "address":dataArr[i].address,
                            "create_time": util.toDate(dataArr[i].create_time)
                        });
                    }
                    that.setData({
                        menuList: list
                    });
                    that.setData({
                        nextpage:(data.data.current_page < data.data.last_page)
                    });
                }else{
                    that.setData({
                        menuList:[]
                    });
                }
            }else if(data.code == 10001 || data.code == "10001"){
                wx.showModal({
                    title: "提示信息",
                    content: data.msg,
                    success: function (res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }else{
                wx.showToast({
                    title: data.msg,
                    icon: "none"
                })
            }
            if (!!callback) {
                callback();
            }
        },"POST",true);
    },
    //下拉刷新，上拉加载
    scroll: function (e) {
        var scrollTop = e.detail.scrollTop;
        var scrollHeight = e.detail.scrollHeight - this.data.windowHeight;
        var upperflag = this.data.isupper;
        var lowerflag = this.data.islower;
        var that = this;
        that.setData({
            scrollTop: e.detail.scrollTop
        });
        if (scrollTop < -50) {
            if (!that.data.isloading) {
                if (upperflag) {
                    that.setData({ menuList: [] });
                    that.setData({
                        isupper: false,
                        listPage: 1
                    });
                    that.getList("", true, function () {
                        that.setData({
                            isupper: true
                        });
                        wx.stopPullDownRefresh();
                    });
                }
            } else {
                wx.showLoading({
                    title: "加载中..."
                });
                setTimeout(function () {
                    wx.hideLoading();
                }, 1000);
            }
        } else if (scrollTop - scrollHeight >= 0) {
            if (!that.data.isloading) {
                if (this.data.nextpage) {
                    if (lowerflag) {
                        that.setData({
                            islower: false,
                            listPage: that.data.listPage + 1
                        });
                        that.getList("", false, function () {
                            that.setData({
                                islower: true
                            });
                        });
                    }
                }
            } else {
                wx.showLoading({
                    title: "加载中..."
                });
                setTimeout(function () {
                    wx.hideLoading();
                }, 1000);
            }

        }
    }
})
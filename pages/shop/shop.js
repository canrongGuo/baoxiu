// pages/shop/shop.js
const app = getApp();
const HEADER = app.globalData.HEADER;
var util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        listHeight:0,
        active: "",
        active1:"",
        show: "",
        show1:"",
        selected: "",
        selected1:"",
        classList:[],
        cid:0,
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        swiperHeight:0,
        shopList: [],
        listPage: 1,
        pageTotal: 1,
        windowHeight: 0,//获取屏幕高度 
        isupper: true,//标记是否正在上拉
        islower: true,//标记是否正在下拉
        nextpage: false,//是否有下一页
        isloading: false,//判断是否在加载数据
        HEADER:HEADER,
        searchValue:"",
        scrollTop:0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var height = wx.getSystemInfoSync().screenHeight;
        var that = this;
        this.init();
        this.getBanner();
        this.getClass();
        this.getShopList();
        this.setData({
            swiperHeight:height*0.3
        });
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
    init:function(){
        var that = this;
        var query = wx.createSelectorQuery().in(this);
        query.select('.box').boundingClientRect();
        query.exec(function (res) {
            wx.getSystemInfo({
                success: function (res1) {
                    that.setData({
                        listHeight: res1.windowHeight
                    });
                }
            })
        });
    },
    //返回首页
    goHome:function(){
        wx.reLaunch({
            url:"../index/index"
        });
    },
    //打开客服
    openKefu: function () {
        wx.navigateTo({
            url: "../chat/chat"
        });
    },
    returnTop:function(){
        this.setData({
            scrollTop:0
        });
    },
    //筛选
    order:function(options){
        var show = this.data.show;
        var type = options.currentTarget.dataset.type;
        if(type == "order"){
            show = this.data.show1;
        }
        if (show == type){
            this.setData({
                show: "",
                show1: "",
            });
        }else{
            this.setData({
                show: type,
                show1:type
            });
        }
    },
    //确认筛选方式
    selected:function(options){
        var type = options.currentTarget.dataset.type;
        var father = options.currentTarget.dataset.father;
        if(father == "class"){
            var cid = options.currentTarget.dataset.cid;
            var oldType = this.data.selected;
            this.setData({
                selected: (type == oldType ? "" : type),
                active: father,
                show: "",
                cid: cid
            });
        }else if(father == "order"){
            var oldType = this.data.selected1;
            this.setData({
                selected1: (type==oldType?"":type),
                active1: father,
                show1: ""
            });
        }
        this.setData({
            listPage:1
        });
        this.getShopList("",true);
    },
    //获取分类类型
    getClass:function(){
        var that = this;
        util.wxAjax("/api/user/xb/get_shop_lei",{
        },function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                that.setData({
                    classList: data.data
                });
            }else{
                that.setData({
                    classList:[]
                });
            }
        },"POST",true);
    },
    //获取首页banner图片
    getBanner:function(){
        var that = this;
        util.wxAjax("/api/home/slides/2",{},function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                if(data.data.length > 0){
                    var jsonArr = data.data[0].items;
                    var arr = [];
                    for(var i=0;i<jsonArr.length;i++){
                        arr.push({"url":jsonArr[i].image});
                    }
                    that.setData({
                        imgUrls: arr
                    });
                }
            }else{
                wx.showToast({
                    title: data.msg,
                    icon:"none"
                })
            }
        });
    },
    //记录搜索的内容
    searchMsg:function(options){
        var searchValue = options.detail.value;
        this.setData({
            searchValue: searchValue
        });
    },
    //确认搜索商品列表
    comfirm:function(){
        var value = this.data.searchValue;
        this.getShopList(value,true);
        this.setData({
            searchValue:""
        });
    },
    //获取商品列表
    getShopList:function(value,flag,callback){
        wx.showLoading({
            title: "加载中..."
        });
        var that = this;
        var cid = this.data.cid;
        var order = this.data.selected1;
        var jsonData = {};
        var type = "";
        switch(order){
            case "评价最高": type = 1; break;
            case "人气最高": type = 2; break;
            case "价格升序": type = 3; break;
            case "价格降序": type = 4;break;
        }
        var jsonData = {"cid": cid,"type": type,"page": that.data.listPage};
        if(!!value && value != ""){
            jsonData.title = value;
            jsonData.name = value;
        }
        util.wxAjax("/api/user/xb/get_shop", jsonData,function(res){
            var data = res.data;
            wx.hideLoading();
            if(data.code == 1 || data.code == "1"){
                var dataArr = data.data.data;
                if (dataArr.length > 0) {
                    var tempList = (!!flag ? [] : that.data.shopList);
                    var jsonArr = data.data.data;
                    for (var i = 0; i < jsonArr.length; i++) {
                        tempList.push({
                            "cid": jsonArr[i].cid,
                            "title": jsonArr[i].title,
                            "img": jsonArr[i].img,
                            "content": jsonArr[i].content,
                            "price": jsonArr[i].price,
                            "ren": jsonArr[i].ren,
                            "ping": jsonArr[i].ping
                        });
                    }
                    that.setData({
                        shopList: tempList
                    });
                    that.setData({
                        nextpage: (data.data.current_page < data.data.last_page)
                    });
                }else{
                    that.setData({
                        shopList: []
                    });
                }
            }
            if(!!callback){
                callback(data);
            }
        },"POST");
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
                    that.setData({ shopList: [] });
                    that.setData({
                        isupper: false,
                        listPage: 1
                    });
                    that.getShopList("", true, function () {
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
        } else if ((scrollTop - scrollHeight) >= -3) {
            if (!that.data.isloading) {
                if (this.data.nextpage) {
                    if (lowerflag) {
                        that.setData({
                            islower: false,
                            listPage: that.data.listPage + 1
                        });
                        that.getShopList("", false, function () {
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
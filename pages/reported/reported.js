// pages/reported/reported.js
var util = require("../../utils/util.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        array: [],
        cidArr:[],
        index:0,
        cid:0,
        region: ['广东省', '广州市', '天河区'],//默认选中的地址
        name:"",
        mobile:"",
        cardNo:"",
        address:""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getLocation();
        this.getItemType();
        qqmapsdk = new QQMapWX({
            key: 'KX6BZ-HD5CX-MNE4G-7RSZ5-WJCQO-FDFFG'
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
    //报备项目选择
    bindPickerChange: function (e) {
        var cidArr = this.data.cidArr;
        this.setData({
            index: e.detail.value,
            cid:cidArr[e.detail.value].id
        })
    },
    //地址选择
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    //获取经纬度
    getLocation: function (e) {
        var that = this
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function (addressRes) {
                        var address = addressRes.result.formatted_addresses.recommend;
                        var json = addressRes.result.address_component;
                        that.setData({
                            region: [json.province,json.city,json.district]
                        });
                    }
                })
            }
        })
    },
    //打开我的报备
    openMyBaobei:function(){
        wx.navigateTo({
            url: "../mine/mine"
        })
    },
    //获取报备项目类型
    getItemType:function(){
        var that = this;
        util.wxAjax("/api/user/xb/get_lei",{
        },function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                var jsonArr = data.data;
                var arr = ["请选择"];
                var arr1 = ["请选择"];
                for(var i=0;i<jsonArr.length;i++){
                    if(jsonArr[i].status == 1){
                        arr.push(jsonArr[i].name);
                        arr1.push(jsonArr[i]);
                    }
                }
                that.setData({
                    array:arr,
                    cidArr:arr1
                });
            }
        },"POST");
    },
    //记录输入的信息
    input: function (options) {
        var type = options.currentTarget.dataset.type;
        var value = options.detail.value;
        this.setData({
            [type]: value
        });
    },
    //提交
    submit:function(){
        var that = this;
        var cid = this.data.cid;
        var name = this.data.name;
        var mobile = this.data.mobile;
        var cardNo = this.data.cardNo;
        var region = this.data.region;
        var address = this.data.address;
        if (cid == ""){
            wx.showToast({
                title: '请选择报备项目类型！',
                icon:"none"
            });
            return false
        }
        if (name == "") {
            wx.showToast({
                title: '请输入客户名称！',
                icon: "none"
            });
            return false
        }
        if (mobile == "") {
            wx.showToast({
                title: '请输入客户手机号码！',
                icon: "none"
            });
            return false
        }
        if (cardNo == "") {
            wx.showToast({
                title: '请选择客户VIP卡号！',
                icon: "none"
            });
            return false
        }
        if (address == "") {
            wx.showToast({
                title: '请选择详情地址！',
                icon: "none"
            });
            return false
        }
        util.wxAjax("/api/user/xbuser/set_log",{
            "cid":cid,
            "name":name,
            "mobile":mobile,
            "ka":cardNo,
            "province": region[0],
            "city":region[1],
            "area":region[2],
            "address":address
        },function(res){
            var data = res.data;
            if(data.code == 1 || data.code == "1"){
                wx.showToast({
                    title:"添加成功",
                    icon: "none"
                });
                that.setData({
                    index: 0,
                    cid: 0,
                    name: "",
                    mobile: "",
                    cardNo: "",
                    address: ""
                });
                that.getLocation();
            }else if(data.code == 10001 || data.code == "10001"){
                wx.showModal({
                    title:"提示信息",
                    content: data.msg,
                    success:function(res){
                        if(res.confirm){
                            wx.reLaunch({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }else{
                wx.showToast({
                    title:data.msg,
                    icon:"none"
                })
            }
        },"POST",true);
    }
})
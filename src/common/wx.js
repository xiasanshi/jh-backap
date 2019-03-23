import Vue from 'vue'
import axios from 'axios';
import {Fanzone} from '../api/api'

Vue.use(axios);
let wxjs = {};
wxjs.wx_share = (title, desc, href) => {

    var url = "http://wx.qingzhao.net.cn/fanZone/wechat/share?url=" + href
    // var url = href
    var imgurl = "http://wx.qingzhao.net.cn/favicon.ico"
    // alert('sss')
    axios.get(url).then(function (res) {
        // alert('sss')
        for (var i in res) {
            console.log(i) + console.log(res[i])
        }
        console.log(res.data.code)
        if (res.data.code === 0) {
            var wx = res.data.data;
            console.log(wx.appId)
            wxjs.share_wx(wx, title, href, imgurl, desc) //微信分享
        }
    }, function (res) {
        //				window.location.href = "error.html";

    })
}

wxjs.share_wx = (data, title, url, imgurl, desc) => {
    var t = data.timestamp
    var url = data.url
    // alert(url)
    console.log(url)
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log('weixin ready验证成功');
        // 分享到朋友圈
        wxjs.share_info(title, url, imgurl, desc)
    });

    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('weixin 验证失败');
        console.log(res);
    });

}

wxjs.share_info = (title, url, imgurl, desc) => {
    console.log(url)
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgurl, // 分享图标
        success: function () {
            console.log("分享成功")
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            console.log("分享取消")
            // 用户取消分享后执行的回调函数
        }
    });

    // 分享给朋友
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgurl, // 分享图标
//		type: '', // 分享类型,music、video或link，不填默认为link
//		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            console.log("分享成功")
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            console.log("分享取消")
            // 用户取消分享后执行的回调函数
        }
    });

    // 分享到QQ
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgurl, // 分享图标
        success: function () {
            console.log("分享成功")
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            console.log("分享取消")
            // 用户取消分享后执行的回调函数
        }
    });

    // 分享到QQ空间
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: '描述', // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgurl, // 分享图标
        success: function () {
            console.log("分享成功")
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            console.log("分享取消")
            // 用户取消分享后执行的回调函数
        }
    });
}

wxjs.getUserInfo = (code) => {
    let api = new Fanzone()
    let param = {'code': code}
    // alert('ss')
    api.getUserInfoByCode(param).then((res) => {
        // alert('---code: '+res.data.code)
        console.log('==========dddddddd=============')
        if (res.data.code === 0) {
            console.log('==========2dddddddd=============')
            // alert('+++++++++++++2000+++++++++++++++++')
            let userInfo = res.data.data;
            if (userInfo !== null) {
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
                sessionStorage.setItem('openid', userInfo.openid)
            }
            sessionStorage.removeItem('code')
            console.log('openid: ' + sessionStorage.getItem('openid'))
            return
        } else if (res.data.code === '40029' | res.data.code === 40029) {
            // alert('+++++++++++++40029+++++++++++++++++')
            let url = window.location.href.split('?')[0]
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfb1bdfe740746055&redirect_uri=" + url + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
            // window.location.href = window.location.href.split('?')[0]
            // alert("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfb1bdfe740746055&redirect_uri=" + url + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect")
            return
        } else {
            // alert('+++++++++++++else+++++++++++++++++')
            // alert("code:"+code)
            return
        }
    })
}

wxjs.payPrepare = () => {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        //		onBridgeReady();
        console.log("ss")
    }
}

wxjs.pay = (wxBill) => {

}
wxjs.formatDate = (timestamp) => {
    let t = new Date(timestamp)
    let y = t.getFullYear();
    let m = t.getMonth() + 1
    let d = t.getDay();
    return y + '-' + m + '-' + d

}
export default wxjs;

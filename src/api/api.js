import axios from 'axios'
import qs from 'qs'
// import xl from './xlAjax'
// Vue.use(axios);
let base = 'http://wx.qingzhao.net.cn'
// let url = 'http://192.168.43.216:8080';//
let url = 'https://pintuan.fanzone.vip/pintuanrs'
// let url = '/api'
// let url = 'http://10.168.23.139:8080'
// let xxx = ''

export const requestLogin = params => {
  return axios.post(`${base}/fanZone/bussiness/login`, qs.stringify(params))
}

export const getUserInfo = params => {
  return axios.get(`${base}/fanZone/buyer/userInfo/tcUser`, {params: params})
}

export const getUserInfoByCode = params => {
  return axios.get(`${url}/wechat/xtoken`, {params: params})
}

export const getAllGroupon = params => {
  // alert('fff')
  return axios.get(`${url}/groupon/findAll`, {params: params})
}

export const getAllGrouponByBusinessId = params => {
  // alert('fff')
  return axios.get(`${url}/groupon/list`, {params: params})
}

export const getGrouponDetails = params => {
  return axios.get(`${url}/groupon/details`, {params: params})
}

export const getPreGrouponListByBusinessId = params => {
  return axios.get(`${url}/team/getListByBusinessId`, {params: params})
}

export const createPreGroupon = params => {
  console.log(params)
  return axios.get(`${url}/team/create`, {params: params})
}

export const joinTeam = params => {
  console.log(params)
  return axios.get(`${url}/team/joinTeam`, {params: params})
}

export const testPost = params => {
  // alert(params)
  return axios.get(`${url}/wechat/menu/default`, {params: params})
}

export const testPost1 = params => {
  // alert(params)
  return axios.put(`${url}/wechat/menu/default`, params)
}

export const testPost2 = params => {
  // alert(params)
  return axios.post(`${url}/wechat/menu/default`, params)
}

export const getTeamDetails = params => {
  // alert(params)
  return axios.get(`${url}/team/getDetails`, {params: params})
}

export const getTeamDetailsWithStatus = params => {
  // alert(params)
  return axios.get(`${url}/team/getDetailsWithStatus`, {params: params})
}

export const getTeamListByGroupId = params => {
  // alert(params)
  return axios.get(`${url}/team/getListByGroupId`, {params: params})
}

export const getTeamListByBusinessId = params => {
  // alert(params)
  return axios.get(`${url}/team/getListByBusinessId`, {params: params})
}

export const getSMSCode = params => {
  // alert(params)
  return axios.get(`${url}/sms/${params.phone}/${params.openid}`)
}

export const putPhone = params => {
  // alert(params)
  return axios.put(`${url}/user/${params.phone}/${params.openid}/${params.code}`)
}

export const getOrderList = params => {
  // alert(params)
  // return axios.post(`${url}/order/get/${params.openid}/${params.page}/${params.size}`, qs.stringify({'status': params.status}));
  return axios.post(`${url}/order/${params.openid}/${params.page}/${params.size}`, qs.stringify({'status': params.status}))
}

export const rePay = params => {
  // alert(params)
  return axios.post(`${url}/order/repay/${params.orderNo}`)
}

/*
* PREPAY,//待付款
   PAYED,//已付款
   REFUNDS,//待退款
   STOPPAY,//停止交易
   REFUNDSED,//已退款
* */

export class Fanzone {
    url = 'http://wx.qingzhao.net.cn'

    getAllBuss (params) {
      return axios.get(`${this.url}/fanZone/buyer/bussiness/allBussiness`)
    }

    getAllCoupon (params) {
      return axios.get(`${this.url}/fanZone/buyer/coupon/allCoupon`)
    }

    getCouponDetail (params) {
      // console.log("ffffffffffffffffff")
      return axios.get(`${this.url}/fanZone/buyer/coupon/buyCoupon`, {params: params})
    }

    payment (params) {
      return axios.post(`${this.url}/fanZone/buyer/order/create`, qs.stringify(params))
    }

    getCouponByBusinessId (params) {
      return axios.get(`${this.url}/fanZone/buyer/coupon/couponListByBussinessId`, {params: params})
      // http://wx.qingzhao.net.cn/fanZone/buyer/coupon/couponListByBussinessId?bussinessId=2962dba821474c4bb350df078907f66f
    }

    getDynamic (params) {
      return axios.get(`${this.url}/fanZone/buyer/dynamic/list`, {params: params})
    }

    updatePhone (params) {
      return axios.get(`${this.url}/fanZone/buyer/userInfo/updatePhone`, {params: params})
    }

    getPhoneCode (params) {
      return axios.get(`${this.url}/fanZone/buyer/sms/${params.phone}`, {params: params})
    }

    getUserInfo (params) {
      return axios.get(`${this.url}/fanZone/buyer/userInfo/tcUser`, {params: params})
    }

    getUserInfoByCode (params) {
      return axios.get(`${this.url}/fanZone/wechat/xtoken`, {params: params})
    }

    useCouponList (params) {
      return axios.get(`${this.url}/fanZone/buyer/userCoupon/list`, {params: params})
    }

    prePay (params) {
      return axios.get(`${this.url}/fanZone/buyer/order/unpay`, {params: params})
    }

    searchBussAndShop (params) {
      return axios.get(`${this.url}/fanZone/buyer/bussiness/searchBussinessOrCoupon`, {params: params})
    }

    testWXPay () {
      let params = {
        'appid': 'wx95721d88a471e1d1',
        'mch_id': '1493595992',
        'sub_mch_id': '1515303061',
        'nonce_str': '',
        'sign': '',
        'sign_type': '',
        'body': '聚汇0.1元优惠券'

      }
      return axios.post(`https://api.mch.weixin.qq.com/pay/unifiedorder`, {params: params})
    }
}
export class Provider {
    url = 'http://pay.qingzhao.net.cn/fanZone'
    pay (params) {
      return axios.post(`${this.url}/wechat/providerPay`, params)
    }
}

export class MiniApp {
  // url = 'http://10.168.23.140:8080/order/getOrders1?page=0&rows=10'
  url = 'https://diancan.qingzhao.net.cn/diancanrs/'
  getOrders (params) {
    // alert(JSON.stringify(params))
    return axios.get(`${this.url}/order/getOrders1`, params)
    // return axios.get('http://10.168.23.140:8085/order/getOrders1?page=0&rows=10')
  }
}

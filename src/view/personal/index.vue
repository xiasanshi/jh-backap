<template>
    <div>
        <!--header-->
        <!--<mt-header style="height: 50px" title="店铺基本信息设置">-->
        <!--</mt-header>-->
        <div class="width_100 bg_groupon position_re text_align_center"
             style="height:150px;background-color:rgba(38,162,255,0.5)">
            <img slot="icon"
                 :src="'https://diancan.qingzhao.net.cn/diancanrs/api/image/'+shop_info.icon || 'https://diancan.qingzhao.net.cn/hh_logo_wx.jpg'"
                 style="height: 80px;width: 80px;border-radius: 50%;"
                 class="margin_top_15"/>
            <div class="margin_top_10"><span>您好，</span><span>{{shop_info.name || '聚汇'}}</span></div>
        </div>
        <div style="margin-top: 1px">
            <mt-cell :title="`店铺电话：${shop_info.mobile}`" is-link>
            </mt-cell>
            <mt-cell :title="`店铺地址：${shop_info.address}`" is-link>
            </mt-cell>
            <div>
            <mt-cell v-if="shop_info.openTime!==shop_info.closeTime" :title="`营业时间: ${formatTime(shop_info.openTime)}-${formatTime(shop_info.closeTime)}`" is-link>
            </mt-cell>
            <mt-cell v-else :title="`营业时间:  全天`" is-link>
            </mt-cell></div>
            <mt-cell :title="`店铺状态：${isWorking}`" is-link>
            </mt-cell>
        </div>

        <div style="margin-top: 5px" @click="runpop">
            <mt-cell title="修改打印机ip" is-link>
            </mt-cell>
        </div>
        <div style="margin-top: 1px">
            <mt-cell title="修改店铺信息" :to="'shopUpdate'" is-link>
            </mt-cell>
        </div>
        <div style="margin-top: 1px" @click="closeShop">
            <mt-cell :title="shopstatus"  is-link>
            </mt-cell>
        </div>
        <div style="margin-top: 10px">
            <mt-cell title="退出登录" to="login" is-link></mt-cell>
        </div>
        <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            position="runpop" style="width: 90%;">
            <div class="padding10" style="width: 100%;">
                <div class="width100 text_align_center"><h3 class="">设置打印机ip</h3></div>
                <mt-field label="ip地址: " placeholder="请输入打印机ip地址" v-model="pos_ip"></mt-field>
                <mt-field label="端口号: " type="number" placeholder="请输入打印机端口号" v-model="pos_port"></mt-field>
                <div class="margin_top_10 padding_15">
                    <mt-button size="large" type="primary" @click="updatePosIp">确定</mt-button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import {Indicator, Toast,MessageBox} from 'mint-ui'
    // import mUpLoader from '../../components/upLoadImg'
    export default {
        name: 'index',
        data () {
            return {
                headUrl: 'https://pub-static.haozhaopian.net/static/web/site/features/cn/crop/images/crop_20a7dc7fbd29d679b456fa0f77bd9525d.jpg',
                userName: 'xialei',
                popupVisible: false,
                pos_ip: '',
                isWorking: '休息中',
                pos_port: '',
                shopId: '',
                brandId: '',
                shop_info: {},
                api: this.$api,
                shopstatus: '关店'
            }
        },
        methods: {
            logout () {
                console.log('log out')
                localStorage.removeItem('user')
                this.$router.push('login')
            },
            updatePosIp () {
                localStorage.setItem('posIp', this.pos_ip)
                localStorage.setItem('posPort', this.pos_port)
                Toast('设置打印机ip成功。')
                this.popupVisible = false
            },
            runpop () {
                this.popupVisible = true
            },
            closeShop(){
                MessageBox.confirm(`确定${this.shopstatus}，如果是，点击确定`).then(action => {
                    console.log('用户点击了确定')
                    let status = this.shop_info.status == 'open' ? 'close' : 'open'
                    let params = this.shop_info
                    params['status'] = status
                    this.updateShop(params)
                })

            },
            updateShop (params) {
                Indicator.open()
                this.api.connect('shop')
                this.api.create(params).then(res => {
                    Indicator.close()
                    if (res.data.code === '2000') {
                        Toast('修改成功')
                        this.getInfo()
                    } else {
                        Toast(res.data.msg)
                    }
                })
                Indicator.close()
            },
            getInfo () {
                Indicator.open()
                this.api.connect('shop')
                let param = {'id': this.shopId, 'brandId': this.brandId}
                this.api.getDetail(param).then(res => {
                    Indicator.close()
                    if (res.data.code === '2000') {
                        this.shop_info = res.data.data
                        this.shopstatus = this.shop_info.status == 'open' ? '关店' : '开店'
                        this.shop_status111(this.shop_info.openTime, this.shop_info.closeTime)
                    } else {
                        Toast(res.data.msg)
                    }
                })
                Indicator.close()
            },
            formatTime (val) {
                if (!val | val === null) {
                    return ''
                }
                let t = new Date(val)
                let h = t.getHours()
                let m = t.getMinutes()
                m = m < 10 ? '0' + m : m
                let s = t.getSeconds()
                s = s < 10 ? '0' + s : s
                return `${h}:${m}:${s}`
            },
            shop_status111 (t1, t2) {
                let d = new Date()
                let td = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
                let d1 = new Date(t1)
                let td1 = d1.getHours() * 3600 + d1.getMinutes() * 60 + d1.getSeconds()
                let d2 = new Date(t2)
                let td2 = d2.getHours() * 3600 + d2.getMinutes() * 60 + d2.getSeconds()
                if (td1 < td && td < td2) {
                    this.isWorking = '营业中'
                }else if(td1 == td2){
                    this.isWorking = '营业中'
                }else {
                    this.isWorking = '休息中'
                }
            }
        },
        mounted () {
            // this.testSocket()
            let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
            this.shopId = shopInfo.shopId
            this.brandId = shopInfo.brandId
            if (localStorage.getItem('posIp')) {
                this.pos_ip = localStorage.getItem('posIp')
            } else {
                let u = navigator.userAgent
                let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
                if (isAndroid | isiOS) {
                    this.popupVisible = true
                } else {
                    // Toast('web端')
                    console.log('打印机等待链接')
                }
            }
            if (localStorage.getItem('posPort')) {
                this.pos_port = localStorage.getItem('posPort')
            } else {
                this.pos_port = 9100
            }
            this.getInfo()
        },
        filters: {
            formatTime (val) {
                if (!val | val === null) {
                    return ''
                }
                let t = new Date(val)
                let h = t.getHours()
                let m = t.getMinutes()
                m = m < 10 ? '0' + m : m
                let s = t.getSeconds()
                s = s < 10 ? '0' + s : s
                return `${h}:${m}:${s}`
            }
        }
    }
</script>

<style scoped>

</style>

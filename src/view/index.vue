<template>
    <div>
        <mt-header style="height: 50px" title="聚汇商家后台">
            <!--      <mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="bg_snow today">
            <label style="">--今日收益--</label>
            <div class="col-6 today_earning">
                <p class="text_center color333 font_size16">{{usedAmout}}</p>
                <p class="text_center color666">今日实收(元)</p>
            </div>
            <div class="col-6 today_earning">
                <p class="text_center color333 font_size16">{{totalNum}}</p>
                <p class="text_center color666">今日支付(笔)</p>
            </div>
        </div>
        <div class="margin_top_10">
            <mt-cell style="font-weight: bold" title="商品信息" :to="{name:'goods'}" is-link>
                <span class="color_fanzone"></span>
            </mt-cell>
            <nav class="padding10 bg_ff" style="height: 70px;">
                <div @click="toRouter('addGood')" class="text_align_center" style="width: 25%;float: left">
                    <span class="icon_common icon iconfont icon-youhuiquan" style="width: 100%;font-size: 30px"></span>
                    <div style="margin-top: 5px" class="name">新增商品</div>
                </div>
                <div @click="toRouter('classfy')" class="text_align_center" style="width: 25%;float: left">
                    <span class="icon_common icon iconfont icon-youhuiquan" style="width: 100%;font-size: 30px"></span>
                    <div style="margin-top: 5px" class="name">新增类别</div>
                </div>
                <div @click="toRouter('classfy')" class="text_align_center" style="width: 25%;float: left">
                    <span class="icon_common icon iconfont icon-youhuiquan" style="width: 100%;font-size: 30px"></span>
                    <div style="margin-top: 5px" class="name">全部类别</div>
                </div>
                <div @click="toRouter('goods')" class="text_align_center" style="width: 25%;float: left">
                    <span class="icon_common icon iconfont icon-youhuiquan" style="width: 100%;font-size: 30px"></span>
                    <div style="margin-top: 5px" class="name">全部商品</div>
                </div>
            </nav>
        </div>
        <div style="margin-top: 5px">
            <mt-cell title="待发货订单" :to="{name:'order', path:'/order',params:{'status': 'noShipping'}}" is-link>
                <mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>
            </mt-cell>
            <mt-cell title="待完成订单" :to="{name:'order',path:'/order',params:{'status': 'alreadyShipping'}}" is-link>
                <mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>
            </mt-cell>
            <mt-cell title="已完成订单" :to="{name:'order',path:'/order',params:{'status': 'complete'}}" is-link>
                <!--<mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>-->
            </mt-cell>
        </div>
        <div style="margin-top: 10px" @click="runTest()">
            <mt-cell title="打印机状态：" is-link>
                {{pos_connect}}
            </mt-cell>
        </div>

    </div>
</template>

<script>
    import {Indicator, Toast} from 'mint-ui'
    import {JHWebSocket} from '../store/websocket'
    import {Printer} from '../common/util/printer'

    export default {
        name: 'index',
        data () {
            return {
                usedAmout: 0,
                totalNum: 0,
                popupVisible: false,
                pre_send: 0,
                pos_connect: '未连接',
                shopId: '',
                brandId: '',
                ws: '',
                websocket: ''
            }
        },
        methods: {
            connectWebsocket (id) {
                if (this.websocket === '') {
                    console.log('shopid: ' + id)
                    this.websocket = new JHWebSocket('wss://pintuan.fanzone.vip/fanZone/webSocket', id)
                } else {
                    this.websocket.reloadsocket()
                }

                this.ws = this.websocket.getWs()
            },
            logout () {
                console.log('log out')
                localStorage.removeItem('user')
                this.$router.push('login')
            },
            getTodayStat () {
                this.$api.connect('checkBill')
                let param = {}
                param['shopId'] = this.shopId
                param['durationText'] = 'oneDay'
                param['dateType'] = 'hour'
                param['orderStatus'] = 'complete'
                // param['shoppingStatus'] = 'complete'
                console.log('get stat: ' + JSON.stringify(param))
                this.$api.getDataByName(param).then(res => {
                    if (res.data.code === '2000') {
                        let data = res.data.data
                        this.totalNum = data.totalNum
                        this.usedAmout = data.amount.toFixed(2)
                        Indicator.close()
                    } else {
                        Toast(res.msg)
                        Indicator.close()
                    }
                })
            },
            toRouter (url) {
                this.$router.push({name: url})
            },
            to (status) {
                this.$router.push({name: 'orderOver', path: 'orderOver', params: {'status': status}})
            },
            runTest () {
                // Indicator.open()
                // Indicator.close()
            },
            async connect_printer(){
                if (this.$printer.checkPrinter()) {
                    this.pos_connect = this.$printer.getPrinter().getPrinterStatus()
                }else{
                    this.$printer = new Printer()
                    this.pos_connect = this.$printer.getPrinter().getPrinterStatus()
                }
            }
        },
        mounted () {
            console.log('app log Info: view index mount')
            let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
            this.shopId = shopInfo.shopId
            this.brandId = shopInfo.brandId
            this.getTodayStat()

        },
        updated () {
            this.connect_printer()
        },
        created () {
        },
        destroyed () {
        },
        filters: {
            is_connect (val) {
                if (val) {
                    return '已连接，测试打印'
                } else {
                    return '未连接,重新链接'
                }
            }
        }
    }
</script>

<style scoped>
    label {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        display: block;
        font-weight: bold;
    }

    /*今日收益*/
    .today_earning {
        height: 80px;
        padding: 5px;
        margin: 5px auto;
        /*background: antiquewhite;*/
    }

    .today {
        padding: 10px 0;
        height: 120px;
        margin-top: 10px;
    }
</style>

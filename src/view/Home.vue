<template>
    <div class="page" style="height: 100%">
        <div id="tran" style="overflow-x: auto">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <div style="height: 60px">
            <Jhfooter ref="footer" :order-num="orderNum"></Jhfooter>
        </div>

    </div>
</template>

<script>
    import Jhfooter from '../components/jhfoot'
    import {JHWebSocket} from '../store/websocket'
    import { MessageBox } from 'mint-ui'
    export default {
        components: {Jhfooter},
        data () {
            return {
                sysName: 'FanZone',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                ws: '',
                websocket: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                orderNum: 0
            }
        },
        watch: {
            '$route' (to, from) {
                this.transition = this.checkDirecition(to.name, from.name) && 'slide-left' || 'slide-right'
                if(to.name === 'order'){
                    this.orderNum = 0
                }
                // alert(to.name)
                // alert('ss')
                // this.$refs.footer.setSelected(to.name);
            },
            ws (to, from) {
                console.log('change===============')
                this.orderNum = this.websocket.getOrderNum()
                console.log(this.orderNum)
                if (to === 'closed') {
                    this.connectWebsocket()
                }
            },
            '$orderFlag' (to, from) {
                alert(to)
            }
        },
        methods: {
            checkDirecition (to, from) {
                let map = ['index', 'foot', 'happy', 'join', 'order', 'preGroupon', 'preJoin', 'message']
                return (map.indexOf(to) - map.indexOf(from)) > 0
            },
            toFooter () {
                // alert('ss')
                // alert(this.$route.name)
                let name = this.$route.name
                if (name === undefined) {
                    // alert(name)
                    return this.$router.push({name: 'fanzone'})
                }
                // let param = name ? name : 'Fanzone'
                // alert(name)
                if (name === 'order' && this.$route.params.status && this.$route.params.status !== 'wait') {
                    console.log('unknow order')
                } else {
                    this.$refs.footer.setSelected(name)
                }
            },
            connectWebsocket (id) {
                if (this.websocket === '') {
                    console.log('shopid: ' + id)
                    this.websocket = new JHWebSocket('wss://pintuan.fanzone.vip/fanZone/webSocket', id, this.run_wb)
                    this.websocket.websocket_test(this.websocket)
                } else {
                    this.websocket.reloadsocket()
                }
                this.ws = this.websocket.getWs()
            },
            run_wb () {
                MessageBox({
                    title: '提示',
                    message: '您有一个新订单',
                    showCancelButton: false
                });
                this.orderNum += 1
                let audio = document.createElement('audio')
                audio.src = 'http://boscdn.bpc.baidu.com/v1/developer/daffd18a-1bbd-4f85-98a3-4e8d254eb102.mp3'
                const playPromise = audio.play()
                if (playPromise !== null) {
                    playPromise.catch(() => {
                        audio.play()
                    })
                }
                if(this.$route.name === 'order'){
                    this.orderNum = 0
                    // window.location.reload()
                }
            },
            getOrderByStatus (status) {
                let para = {'shopId': this.shopId, 'shippingStatus': status, 'orderStatus': 'complete'}
                if (status === 'complete') {
                    para['flag'] = 'day'
                }
                console.log(JSON.stringify(para))
                // debugger
                this.$api.connect('order')
                this.$api.getAll(para).then((res) => {
                    if (res.data.code === '2000') {
                        // this.data = res.data.data.orders
                        this.t = res.data.data.orders.length
                        // debugger
                    } else {
                        Toast(res.msg)
                    }
                    // console.log('==================')
                    // console.log(JSON.stringify(this.data))
                })
            }
        },
        mounted () {
            let height = window.screen.availHeight - 60
            // console.log('=============main' + height)
            document.getElementById('tran').style.height = height + 'px'
            let shop_info = JSON.parse(localStorage.getItem('shopInfo'))
            this.connectWebsocket(shop_info.shopId)
            this.toFooter()
            this.getOrderByStatus('noShipping')

        },
        updated(){

        },
        created () {
        },
        destroyed () {
            console.log('app log: destroyed websocket')
            this.ws.close()
        }

    }

</script>
<style lang="scss" scoped>
    @import "../assets/scss/min.scss";

    .mint-navbar .mint-tab-item.is-selected {
        color: #20b6f9;
        border: 0;
    }
</style>

<!--suppress ALL -->
<template>
    <div>
        <!--<mt-header style="height: 50px" :title="title">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>-->
        <mt-navbar v-model="selected">
            <mt-tab-item id="wait" @click="change_status('wait')">待接单</mt-tab-item>
            <mt-tab-item id="noShipping" @click="change_status('noShipping')">代发货</mt-tab-item>
            <mt-tab-item id="alreadyShipping" @click="change_status('alreadyShipping')">待完成</mt-tab-item>
            <mt-tab-item id="complete" @click="change_status('complete')">已完成</mt-tab-item>
        </mt-navbar>
        <div class="margin_top_10">
            <div v-for="item in data" class="padding10 bg_ff" style="border-radius: 10px;margin: 10px">
                <div class="" style="">
                    <h3>订单详情</h3>
                    <p>订单号: {{item.id}}</p>
                    <table class="width100">
                        <tr class="width100" style="font-weight: bold">
                            <td class="col-3">序号</td>
                            <td class="col-3">商品</td>
                            <td class="col-3">单价</td>
                            <td class="col-3">数量</td>
                        </tr>
                        <tr v-for="(good,index) in item.orderDetails" class="width100">
                            <td class="col-3">{{index}}</td>
                            <td class="col-3">{{good.productName}}</td>
                            <td class="col-3">{{good.price}}</td>
                            <td class="col-3">{{good.num}}</td>
                        </tr>
                    </table>
                    <div class="" style="padding:10px 0">
                        <div>合计: ￥{{item.repaymentAmount }}
                            <span v-if="item.hasOwnProperty('address') && item.address!=null">{{` (包含配送费${item.shop.shippingPrice}元)`}}</span>
                        </div>
                        <div>
                            配送方式：
                            <span v-if="item.hasOwnProperty('address') && item.address!=null">
                      外卖
                  </span>
                            <span v-else>自提</span>
                        </div>
                        <div v-if="item.hasOwnProperty('address') && item.address!=null">
                            <div>地址: {{item.address.address}}</div>
                            <div>联系人: {{item.address.name}}</div>
                            <div>联系电话: <a v-bind:href="'tel:'+item.address.mobile"
                                          style="text-decoration: None">{{item.address.mobile}}</a></div>
                        </div>

                    </div>
                </div>
                <div class="" v-if="item.shippingWays=='takeOut'">
                    <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
                    <mt-button :disabled="status !== 'wait'" type="primary" size="small"
                               @click="orderRecive(this, item)">接单
                    </mt-button>
                    <mt-button :disabled="status !== 'noShipping'" type="primary" size="small"
                               @click="send2dada(this, item)">
                        发货
                    </mt-button>
                    <mt-button type="danger" :disabled="status !== 'wait'" size="small"
                               @click="refuseOrder(this, item)">拒绝
                    </mt-button>
                    <mt-button type="primary" size="small" @click="posOrder(this, item)">打印订单
                    </mt-button>
                </div>
                <div v-else>
                    <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
                    <mt-button type="primary" size="small" @click="posOrder(this, item)">打印订单
                    </mt-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {PosMachine} from '../../common/util/posstyle'
    import {Printer} from '../../common/util/printer'
    import {Indicator, Toast} from 'mint-ui'
    import {createDelivery, cancelDelivery} from '../../api/index'

    // eslint-disable-next-line no-extend-native
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val)
        if (index > -1) {
            this.splice(index, 1)
        }
    }
    export default {
        name: 'order',
        data () {
            return {
                testdata: [{
                    'customer': 'xialei',
                    'orNum': 10,
                    'orders': [{'name': '小炒肉', 'price': 20, 'num': 2}, {'name': '小炒肉', 'price': 20, 'num': 2}],
                    'address': '浦东新区北蔡镇北中路****号502',
                    'total': 40,
                    'phoneNum': 12345678911
                }, {
                    'customer': 'xialei',
                    'orNum': 10,
                    'orders': [{'name': '小炒肉', 'price': 20, 'num': 2}, {'name': '小炒肉', 'price': 20, 'num': 2}],
                    'address': '浦东新区北蔡镇北中路****号502',
                    'total': 40,
                    'phoneNum': 12345678911
                }],
                data: [],
                post_list: [],
                pos_flag: false,
                pos: null,
                writer: null,
                miniapp: null,
                shopId: '',
                status: '',
                title: '订单',
                selected: 'wait',
                printer: null,
                printer_obj: null
            }
        },
        methods: {
            async sendMess2Pos (callback) {
                console.log('app log:pos start')
                let data = this.post_list.shift()
                console.log(`send data to pos: ${JSON.stringify(data)}`)

                this.printer_obj.checkPrinterAvailable()
                this.printer_obj.setFontSize(1)
                this.printer_obj.printTextWithFont('订单详情\n', 0, 1)
                this.printer_obj.printGBKText('\n')
                this.printer_obj.setFontSize(0)
                this.printer_obj.printGBKText('订单号 ' + data.id + '\n')

                this.printer_obj.printGBKText('*******************************\n')
                this.printer_obj.printGBKText('商品 x 数量\n')
                this.printer_obj.printGBKText('-------------------------------\n')
                for (let item in data.orderDetails) {
                    let good = data.orderDetails[item]
                    if (!item | item == undefined | item === 'remove') {
                        continue
                    }
                    let tol = good.price * good.num
                    tol = tol.toFixed(2)
                    this.printer_obj.printGBKText(`${good.productName} (￥${good.price} x${good.num} = ￥${tol})\n`)
                }
                this.printer_obj.printGBKText('*******************************\n')
                // this.pos.setAlign(0)
                this.printer_obj.printGBKText('合计: ￥' + data.repaymentAmount)
                // out.write(0x1B)
                // out.write(97)
                // out.write(0)
                if (data.shippingWays == 'takeOut') {
                    this.printer_obj.printGBKText(`(包含配送费${data.shop.shippingPrice}元)\n`)
                    this.printer_obj.printGBKText('配送方式：外卖\n')
                    this.printer_obj.printGBKText('地址：' + data.address.address + '\n')
                    this.printer_obj.printGBKText('联系人：' + data.address.name + '\n')
                    this.printer_obj.printGBKText('联系电话：' + data.address.mobile + '\n')
                } else {
                    this.printer_obj.printGBKText('\n配送方式：自提\n')
                }
                this.printer_obj.printGBKText('\n\n\n')
                this.pos_flag = false
                Toast('打印成功')
                console.log('app log:pos finish')
                callback(this.pos_flag)
            },
            posOrder (self, data) {
                if (data.shippingStatus === 'wait') {
                    if (data.shippingWays === 'self') {
                        this.updaterOrder(data, 'alreadyShipping')
                    } else {
                        this.updaterOrder(data, 'noShipping')
                    }
                }
                this.post_list.push(data)
                if (!this.pos_flag) {
                    console.log('post data:pos_flag=false ' + JSON.stringify(this.post_list))
                    this.pos_flag = true
                    this.sendMess2Pos()

                } else {
                    console.log('post data:pos_flag=true  ' + JSON.stringify(this.post_list))
                    // this.pos_flag = false
                    return true
                }
            },
            orderRecive (self, data) {
                this.updaterOrder(data, 'noShipping')
                this.posOrder(self, data)
            },
            refuseOrder (self, data) {
                // self.updaterOrder()
                Toast('取消订单成功')
            },
            send2dada (self, data) {
                // this.updaterOrder(data, 'alreadyShipping')
                this.create_delivery(data)
            },
            updaterOrder (item, status = 'noShipping') {
                Indicator.open('加载中...')
                let para = {}
                para['shippingStatus'] = status
                // para['addressId'] = item.address.id
                para['id'] = item.id
                para['shopId'] = item.shop.id
                para['shippingWays'] = item.shippingWays
                // para['orderDetail'] = item.orderDetails
                console.log(JSON.stringify(para))
                this.$api.connect('order')
                this.$api.create(para).then((res) => {
                    if (res.data.code === '2000') {
                        // if(res.data)
                        console.log(JSON.stringify(res.data))
                        // this.data = res.data.data.orders
                        let msg = status == 'noShipping' ? '接单成功' : status == 'alreadyShipping' ? '发货成功' : '修改订单状态成功'
                        Toast(msg)
                        Indicator.close()
                        this.data.remove(item)
                    } else {
                        Toast(res.msg)
                        Indicator.close()
                    }
                })
                Indicator.close()
            },
            getOrderByStatus (status) {
                Indicator.open('加载中...')
                let para = {'shopId': this.shopId, 'shippingStatus': status, 'orderStatus': 'complete'}
                if (status === 'complete') {
                    para['flag'] = 'day'
                }
                console.log(JSON.stringify(para))
                // debugger
                this.$api.connect('order')
                this.$api.getAll(para).then((res) => {
                    if (res.data.code === '2000') {
                        this.data = res.data.data.orders
                        // debugger
                        Indicator.close()
                    } else {
                        Toast(res.msg)
                        Indicator.close()
                    }
                })
                Indicator.close()
            },
            change_status (status) {
                this.selected = status
                this.status = status
                this.getOrderByStatus(status)
            },
            formatTitle () {
                self.title = this.status === 'complete' ? '已完成订单' : this.status === 'noShipping' ? '待发货订单' : this.status === 'alreadyShipping' ? '已发货订单' : this.status === 'wait' ? '待处理订单' : '订单'
            },
            create_delivery (item, callback_) {
                let para = {'orderId': item.id}
                Indicator.open('加载中...')
                createDelivery(para).then((res) => {
                    if (res.data.code === '2000') {
                        Indicator.close()
                        Toast('发货成功')
                        // debugger
                        callback_(item)

                    } else {
                        Indicator.close()
                        Toast(res.msg)

                    }
                }).catch((res) => {
                    Indicator.close()
                    Toast('请检查您的网络，或者稍后重试。')
                })
            },
            printer_callback (e) {
                console.log('app log post' + e)
            },
            async connect_print () {
                try {
                    if (this.$printer.checkPrinter()) {
                        console.log('app log: connect Printer')
                        this.printer_obj = this.$printer.getPrinter()
                    } else {
                        console.log('app log: connect new Printer')
                        console.log('app log: ' + this.$printer)
                        this.$printer = new Printer()
                        this.printer = this.$printer
                        this.printer_obj = this.$printer.getPrinter()
                    }

                } catch (e) {
                    Toast('链接打印机失败,请检查')
                    console.log('链接打印机失败：' + e)
                }
            }
        },
        created () {
            // console.log(this.$route.params.status)
            // this.connect_print()
        },
        updated () {
            this.connect_print()
        },
        mounted () {
            // this.$orderFlag = 0

            let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
            this.shopId = shopInfo.shopId
            this.brandId = shopInfo.brandId
            this.status = this.$route.params.status
            this.selected = this.status
            // debugger
            console.log(this.$route.params)
            this.getOrderByStatus(this.status)
            // debugger
            this.formatTitle()
            console.log(this.$orderFlag)

        },
        watch: {
            'pos_flag' (newp, oldp) {
                console.log('post_flag')
                if (!newp && this.post_list.length > 0) {
                    this.pos_flag = true
                    // let data_ = newp[0]
                    try {
                        this.sendMess2Pos(this.callback)
                    } catch (e) {
                        this.pos_flag = false
                        Toast(e)
                    }
                } else {
                    console.log('post data: ' + JSON.stringify(this.post_list))
                    // try {
                    //     this.sendMess2Pos()
                    // } catch (e) {
                    //     Toast(e)
                    // }
                    // this.pos_flag = true
                    return true
                }
            },
            selected: function (newp, oldp) {
                // alert('watch:' + newp)
                this.change_status(newp)
                this.$router.push({name: 'order', path: '/order', params: {'status': newp}})
            },
        }
    }
</script>

<style scoped>

</style>

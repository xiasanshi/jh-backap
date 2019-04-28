<!--suppress ALL -->
<template>
  <div>
    <mt-header style="height: 50px" :title="title">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
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
            <div>合计: ￥{{item.repaymentAmount}}</div>
            <div>地址: {{item.address.address}}</div>
            <div>联系人: {{item.address.name}}</div>
            <div>联系电话: <a v-bind:href="'tel:'+item.address.mobile"
                          style="text-decoration: None">{{item.address.mobile}}</a></div>
          </div>
        </div>
        <div class="">
          <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
          <mt-button :disabled="status !== 'wait'" type="primary" size="small" @click="orderRecive(this, item)">接单
          </mt-button>
          <mt-button :disabled="status !== 'noShipping'" type="primary" size="small" @click="send2dada(this, item)">
            发送达达
          </mt-button>
          <mt-button type="danger" :disabled="status !== 'wait'" size="small" @click="refuseOrder(this, item)">拒绝
          </mt-button>
          <mt-button type="primary" size="small" @click="posOrder(this, item)">打印订单
          </mt-button>
          <!--<mt-button disabled="true"></mt-button>-->
        </div>
        <div class="position_absolute" style="right: 0;height: 100px;bottom: 4px" v-if="status==='complete'">
          <span class="icon iconfont icon-yiwancheng" style="width: 100%;font-size: 100px"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {PosMachine} from '../../common/util/posstyle'
  import {Toast, Indicator} from 'mint-ui'

  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };
  export default {
    name: 'order',
    data() {
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
        shopId: this.shopId,
        status: '',
        title: '订单'
      }
    },
    methods: {
      sendMess2Pos() {
        // this.pos_flag = true
        if (this.pos === null | this.writer === null) {
          Toast('打印链接失败，请检查。')
          this.pos_flag = false
          return
        }
        let data = this.post_list.shift()
        console.log(`send data to pos: ${JSON.stringify(data)}`)
        this.pos.feedAndCut()
        this.pos.setAlign(1)
        this.pos.setBold(true)
        this.pos.setSize(17)
        this.writer.println('订单详情')
        this.pos.setAlign(0)
        this.pos.setBold(false)
        this.pos.setSize(0)
        this.writer.println('')
        this.writer.println(' 订单号 ' + data.orderAddress.orderId)
        this.writer.println('---------------------------------------------')
        this.writer.println('序号\t商品    \t数量\t单价\t金额')
        this.writer.println('---------------------------------------------')
        for (let item in data.orders) {
          let good = data.orders[item]
          this.writer.println(`${item}\t${good.title}  \t${good.price}\t${good.num}\t${good.totalPrice}`)
        }
        this.writer.println('---------------------------------------------')
        this.pos.setAlign(0)
        this.writer.println(' 合计: ￥' + data.totalMoney)
        // out.write(0x1B)
        // out.write(97)
        // out.write(0)
        this.writer.println(' 地址：' + data.address.address)
        this.writer.println(' 联系人：' + data.address.name)
        this.writer.println(' 联系电话：' + data.address.mobile)
        this.pos.feedAndCut()
        // pos = null
        // writer = null
        // this.data.remove(data)
        Toast('打印成功')
        this.pos_flag = false

      },
      posOrder(self, data) {
        if (this.pos === null) {
          Toast('打印链接失败，请检查。')
        }
        this.updaterOrder(data, 'noShipping')
        if (!this.pos_flag) {
          this.pos_flag = true
          this.post_list.push(data)
        } else {
          this.post_list.push(data)
          console.log('post data: ' + JSON.stringify(this.post_list))
          return true
        }
      },
      orderRecive(self, data) {
        this.updaterOrder(data, 'noShipping')
        this.posOrder(self, data)
      },
      refuseOrder(self, data) {
        Toast('取消订单成功')
      },
      send2dada(self, data) {
        this.updaterOrder(data, 'alreadyShipping')
      },
      async connect(ip, port) {
        let self = this
        self.$pos = new PosMachine(ip, parseInt(port))
        self.writer = self.$pos.getPosHandle()
        // resolve(pos)
      },
      updaterOrder(item, status = 'noShipping') {
        Indicator.open('加载中...')
        let para = {}
        para['shippingStatus'] = status
        para['addressId'] = item.address.id
        para['id'] = item.id
        para['shopId'] = item.shop.id
        para['orderDetail'] = item.orderDetails
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
      getOrderByStatus(status) {
        Indicator.open('加载中...')
        let para = {'shopId': this.$shopId, 'shippingStatus': status, 'orderStatus': 'complete'}
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
          // console.log('==================')
          // console.log(JSON.stringify(this.data))
        })
        Indicator.close()
      },
      formatTitle() {
        self.title = this.status === 'complete' ? '已完成订单' : this.status === 'noShipping' ? '待发货订单' : this.status === 'alreadyShipping' ? '已发货订单' : this.status === 'wait' ? '待处理订单' : '订单'
      }
    },
    updated() {
      // console.log(this.$route.params.status)
      try {
        let ip = localStorage.getItem('posIp')
        let port = localStorage.getItem('posPort')
        if (this.$pos && this.$pos.getPosHandle() !== null) {
          this.pos = this.$pos
          this.writer = this.pos.getPosHandle()
        } else {
          this.connect(ip, port)
        }
      } catch (e) {
        Toast('链接打印机失败,请检查')
        console.log('链接打印机失败：' + e)
      }
    },
    mounted() {
      this.status = this.$route.params.status
      // debugger
      console.log(this.$route.params)
      this.getOrderByStatus(this.status)
      // debugger
      this.formatTitle()
      // console.log(`send message to pos(${ip}:${port}):` + JSON.stringify(data))
    },
    watch: {
      pos_flag(newp, oldp) {
        if (!newp && this.post_list.length > 0) {
          this.pos_flag = true
          // let data_ = newp[0]
          this.sendMess2Pos()
        } else {
          console.log('post data: ' + JSON.stringify(this.post_list))
          return true
        }
      }
    }
  }
</script>

<style scoped>

</style>

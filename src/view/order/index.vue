<template>
  <div>
    <mt-header style="height: 50px" title="订单">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="margin_top_10">
      <div v-for="item in data" class="padding10 bg_ff" style="border-radius: 10px;margin: 10px">
        <div class="" style="">
          <h3>订单详情</h3>
          <p>订单号: {{item.orderAddress.orderId}}</p>
          <table class="width100">
            <tr class="width100" style="font-weight: bold">
              <td class="col-3">序号</td>
              <td class="col-3">商品</td>
              <td class="col-3">单价</td>
              <td class="col-3">数量</td>
            </tr>
            <tr v-for="(good,index) in item.orders" class="width100">
              <td class="col-3">{{index}}</td>
              <td class="col-3">{{good.title}}</td>
              <td class="col-3">{{good.price}}</td>
              <td class="col-3">{{good.num}}</td>
            </tr>
          </table>
          <div class="" style="padding:10px 0">
            <div>合计: ￥{{item.totalMoney}}</div>
            <div>地址: {{item.orderAddress.address}}</div>
            <div>联系人: {{item.orderAddress.name}}</div>
            <div>联系电话: <a v-bind:href="'tel:'+item.orderAddress.mobile" style="text-decoration: None">{{item.orderAddress.mobile}}</a></div>
          </div>
        </div>
        <div class="">
          <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
          <mt-button :disabled="false" type="primary" size="small" @click="orderRecive(this, item)">接单</mt-button>
          <mt-button :disabled="true" type="primary" size="small" @click="send2dada(this, item)">发送达达</mt-button>
          <mt-button type="danger" size="small" @click="refuseOrder(this, item)">拒绝</mt-button>
          <!--<mt-button disabled="true"></mt-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {PosMachine} from '../../common/util/posstyle'
import {Toast, Indicator} from 'mint-ui'
import {MiniApp} from '../../api/api'

export default {
  name: 'index',
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
      data: {},
      post_list: [],
      pos_flag: false,
      pos: null,
      writer: null,
      miniapp: null
    }
  },
  methods: {
    sendMess2Pos () {
      // this.pos_flag = true
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
      this.writer.println('序号\t菜品    \t数量\t单价\t金额')
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
      this.writer.println(' 地址：' + data.orderAddress.address)
      this.writer.println(' 联系人：' + data.orderAddress.name)
      this.writer.println(' 联系电话：' + data.orderAddress.mobile)
      this.pos.feedAndCut()
      // pos = null
      // writer = null
      this.pos_flag = false
    },
    orderRecive (self, data) {
      if (!this.pos_flag) {
        this.pos_flag = true
        this.post_list.push(data)
        this.sendMess2Pos()
      } else {
        this.post_list.push(data)
        console.log('post data: ' + JSON.stringify(this.post_list))
        return true
      }
      Toast('接单成功')
    },
    refuseOrder (self, data) {
      Toast('取消订单成功')
    },
    send2dada (self, data) {
      Toast('发送消息到达达成功')
    },
    getData () {
      Indicator.open('加载中...')
      let para = {'page': 0, 'rows': 100}
      let miniapp = new MiniApp()
      console.log(JSON.stringify(para))
      // debugger
      miniapp.getOrders(para).then((res) => {
        if (res.status === 200) {
          // if(res.data)
          // console.log(JSON.stringify(res.data.rows))
          this.data = res.data.data.rows
          Indicator.close()
        } else {
          Toast(res.msg)
          Indicator.close()
        }
        console.log(JSON.stringify(res))
      })
      Indicator.close()
    }
  },
  mounted () {
    let ip = localStorage.getItem('posIp')
    let port = localStorage.getItem('posPort')
    // console.log(`send message to pos(${ip}:${port}):` + JSON.stringify(data))
    this.pos = new PosMachine(ip, parseInt(port))
    // let pos = new PosMachine('192.168.43.100', 9100)
    console.log(`connect to pos(${ip}:${port})`)
    this.writer = this.pos.getPosHandle()
    this.miniapp = new MiniApp()
    this.getData()
  },
  watch: {
    pos_flag (newp, oldp) {
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

<template>
  <div>
    <mt-header style="height: 50px" title="已完成订单">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="margin_top_10">
      <div v-for="item in testdata" class="padding10 bg_ff position_relative" style="border-radius: 10px;margin: 10px">
        <div class="" style="">
          <h3>订单详情</h3>
          <p>订单号: {{item.orNum}}</p>
          <table class="width100">
            <tr class="width100" style="font-weight: bold">
              <td class="col-3">序号</td>
              <td class="col-3">商品</td>
              <td class="col-3">单价</td>
              <td class="col-3">数量</td>
            </tr>
            <tr v-for="(good,index) in item.orders" class="width100">
              <td class="col-3">{{index}}</td>
              <td class="col-3">{{good.name}}</td>
              <td class="col-3">{{good.price}}</td>
              <td class="col-3">{{good.num}}</td>
            </tr>
          </table>
          <div class="" style="padding:10px 0">
            <div>合计: ￥{{item.total}}</div>
            <div>地址: {{item.address}}</div>
            <div>联系人: {{item.customer}}</div>
            <div>联系电话: <a v-bind:href="'tel:'+item.phoneNum" style="text-decoration: None">{{item.phoneNum}}</a></div>
          </div>
        </div>
        <div class="">
          <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
          <mt-button :disabled="true" type="primary" size="small" @click="orderRecive(this, item)">接单</mt-button>
          <mt-button :disabled="true" type="primary" size="small" @click="send2dada(this, item)">发送达达</mt-button>
          <mt-button :disabled="true" type="danger" size="small" @click="refuseOrder(this, item)">拒绝</mt-button>
          <!--<mt-button disabled="true"></mt-button>-->
        </div>
        <div class="position_absolute" style="right: 0;height: 100px;bottom: 4px"><span class="icon iconfont icon-yiwancheng" style="width: 100%;font-size: 100px"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import {PosMachine} from '../../common/util/posstyle'
import {Toast} from 'mint-ui'

export default {
  name: 'over',
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
      post_list: [],
      pos_flag: false
    }
  },
  methods: {
    sendMess2Pos () {
      // this.pos_flag = true
      let data = this.post_list.shift()
      let ip = localStorage.getItem('posIp')
      let port = localStorage.getItem('posPort')
      let pos = new PosMachine(ip, port)
      console.log('send message to pos')
      let writer = pos.getPosHandle()
      pos.feedAndCut()
      pos.setAlign(1)
      pos.setBold(true)
      pos.setSize(17)
      writer.println('订单详情')
      pos.setAlign(0)
      pos.setBold(false)
      pos.setSize(0)
      writer.println(' 订单号 ' + data.orNum)
      writer.println('---------------------------------------------')
      writer.println('序号\t菜品    \t数量\t单价\t金额')
      writer.println('---------------------------------------------')
      for (let item in data.orders) {
        let good = data.orders[item]
        writer.println('no\tname  \tnum\tprice\ttotal'.replace('no', item).replace('name', good.name).replace('num', good.num).replace('price', good.price).replace('total', good.price * good.num))
      }
      writer.println('---------------------------------------------')
      pos.setAlign(0)
      writer.println(' 合计: ￥' + data.total)
      // out.write(0x1B)
      // out.write(97)
      // out.write(0)
      writer.println(' 地址：' + data.address)
      writer.println(' 联系人：' + data.customer)
      writer.println(' 联系电话：' + data.phoneNum)
      pos.feedAndCut()
      this.pos_flag = false
    },
    orderRecive (self, data) {
      Toast('接单成功')
      if (!this.pos_flag) {
        this.pos_flag = true
        this.post_list.push(data)
        this.sendMess2Pos()
      } else {
        this.post_list.push(data)
        console.log('post data: ' + JSON.stringify(this.post_list))
        return true
      }
    },
    refuseOrder (self, data) {
      Toast('取消订单成功')
    },
    send2dada (self, data) {
      Toast('发送消息到达达成功')
    }
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

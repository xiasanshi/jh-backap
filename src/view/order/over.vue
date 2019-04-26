<template>
  <div>
    <mt-header style="height: 50px" title="已完成订单">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="margin_top_10">
      <div v-for="item in data.orders" class="padding10 bg_ff position_relative" style="border-radius: 10px;margin: 10px">
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
            <tr v-for="(good,index) in data.orders" class="width100">
              <td class="col-3">{{index}}</td>
              <td class="col-3">{{good.name}}</td>
              <td class="col-3">{{good.price}}</td>
              <td class="col-3">{{good.num}}</td>
            </tr>
          </table>
          <div class="" style="padding:10px 0">
            <div>合计: ￥{{item.repaymentAmount}}</div>
            <div>地址: {{item.address.address}}</div>
            <div>联系人: {{item.address.name}}</div>
            <div>联系电话: <a v-bind:href="'tel:'+item.mobile" style="text-decoration: None">{{item.mobile}}</a></div>
          </div>
        </div>
        <div class="">
          <div style="border-top: #999999 1px dashed;width: 100%" class="padding10"></div>
          <mt-button :disabled="true" type="primary" size="small" @click="orderRecive(this, item)">接单</mt-button>
          <!--<mt-button :disabled="true" type="primary" size="small" @click="send2dada(this, item)">发送达达</mt-button>-->
          <!--<mt-button :disabled="true" type="danger" size="small" @click="refuseOrder(this, item)">拒绝</mt-button>-->
          <!--<mt-button disabled="true"></mt-button>-->
        </div>
        <div v-if="status===complete" class="position_absolute" style="right: 0;height: 100px;bottom: 4px"><span class="icon iconfont icon-yiwancheng" style="width: 100%;font-size: 100px"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast, Indicator} from 'mint-ui'

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
      pos_flag: false,
      status: ''
    }
  },
  methods: {
    getOrderByStatus (status) {
      Indicator.open('加载中...')
      let para = {'shopId': this.$shopId, 'shippingStatus': status}
      // let miniapp = new MiniApp()
      console.log(JSON.stringify(para))
      // debugger
      this.$api.connect('order')
      this.$api.getAll(para).then((res) => {
        if (res.data.status === '2000') {
        // if(res.data)
        // console.log(JSON.stringify(res.data.rows))
          this.data = res.data.data
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
  watch: {
  },
  mounted () {
    this.status = this.$route.params.status
    console.log(this.$route.params)
    this.getOrderByStatus(this.status)
  }
}
</script>

<style scoped>

</style>

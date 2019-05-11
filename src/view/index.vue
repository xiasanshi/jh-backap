<template>
  <div>
    <mt-header style="height: 50px" title="聚汇商家后台">
      <mt-button icon="more" slot="right"></mt-button>
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
        <mt-badge v-if="pre_send>0" type="warning" size="small" >{{pre_send}}</mt-badge>
      </mt-cell>
      <mt-cell title="待完成订单" :to="{name:'order',path:'/order',params:{'status': 'alreadyShipping'}}" is-link>
        <mt-badge v-if="pre_send>0" type="warning" size="small" >{{pre_send}}</mt-badge>
      </mt-cell>
      <mt-cell title="已完成订单"  :to="{name:'order',path:'/order',params:{'status': 'complete'}}" is-link>
        <!--<mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>-->
      </mt-cell>
    </div>
    <div style="margin-top: 10px" @click="runTest()">
      <mt-cell title="打印机状态：" is-link>
        {{pos_connect | is_connect}}
      </mt-cell>
    </div>
    <!--<mt-button @click="testSocket" type="primary">打印测试</mt-button>-->
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
    import {Indicator, Toast} from 'mint-ui'
    import {PosMachine} from '../common/util/posstyle'
    import {JHWebSocket} from '../store/websocket'

    export default {
  name: 'index',
  data () {
    return {
      usedAmout: 0,
      totalNum: 0,
      popupVisible: false,
      pos_ip: '',
      pos_port: '',
      pre_send: 10,
      pos_connect: false
    }
  },
  methods: {
    logout () {
      console.log('log out')
      sessionStorage.removeItem('user')
      this.$router.push('login')
    },
    runpop () {
      this.popupVisible = true
    },
    updatePosIp () {
      localStorage.setItem('posIp', this.pos_ip)
      localStorage.setItem('posPort', this.pos_port)
      Toast('设置打印机ip成功。')
      this.popupVisible = false
    },
    toRouter (url) {
      this.$router.push({name: url})
    },
    to (status) {
      this.$router.push({name: 'orderOver', path: 'orderOver', params: {'status': status}})
    },
    runTest () {
      Indicator.open()
      if (this.pos_connect) {
        this.$pos.getPosHandle().println('测试打印')
      } else {
        try {
          this.$pos = new PosMachine(this.pos_ip, parseInt(this.pos_port))
          if (this.$pos.getPosHandle()) {
            Toast('打印机链接成功')
            // this.$pos.getPosHandle().println('测试打印')
            this.pos_connect = true
          }
        } catch (e) {
          console.log('打印机链接失败：' + e)
          Toast('打印机链接失败：' + e)
        }
      }
      Indicator.close()
    }
  },
  mounted () {
    // this.testSocket()
    console.log(this.$store.state.shopId)
    if (localStorage.getItem('posIp')) {
      this.pos_ip = localStorage.getItem('posIp')
    } else {
      this.popupVisible = true
    }
    if (localStorage.getItem('posPort')) {
      this.pos_port = localStorage.getItem('posPort')
    } else {
      this.pos_port = 9100
    }
    let pos = this.$pos
    if (pos) {
      if (pos.getPosHandle()) {
        this.pos_connect = true
      }
    }
  },
  updated () {
    let w = new JHWebSocket('wss://pintuan.fanzone.vip/fanZone/webSocket')
    // w.reloadsocket()
  },
  created () {
    // this.$websocket.reloadsocket()
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

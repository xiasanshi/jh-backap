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
    <div style="margin-top: 10px" @click="runpop">
      <mt-cell title="修改打印机ip" is-link>
      </mt-cell>
    </div>
    <div style="margin-top: 10px">
      <mt-cell title="待发货订单" to="order" is-link>
        <mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>
      </mt-cell>
    </div>
    <div style="margin-top: 10px">
      <mt-cell title="待完成订单" to="order" is-link>
        <mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>
      </mt-cell>
    </div>
    <div style="margin-top: 10px">
      <mt-cell title="已完成订单" to="orderOver" is-link>
        <mt-badge v-if="pre_send>0" type="warning" size="small">{{pre_send}}</mt-badge>
      </mt-cell>
    </div>
    <!--<mt-button @click="testSocket" type="primary">打印测试</mt-button>-->
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
import {Toast} from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
      usedAmout: 0,
      totalNum: 0,
      popupVisible: false,
      pos_ip: '',
      pos_port: '',
      pre_send: 10
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
    }
  },
  mounted () {
    // this.testSocket()
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
  },
  updated () {
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

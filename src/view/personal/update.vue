<template>
  <div>
    <mt-header style="height: 50px" title="修改店铺信息">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-field label="名称：" placeholder="请输入名称" :state="data.name ? 'success' : 'error'" v-model="data.name"></mt-field>
    <mt-field label="联系电话：" placeholder="请输入联系方式" :state="data.mobile ? 'success' : 'error'" :attr="{ maxlength: 11 }" type="tel" v-model="data.mobile"></mt-field>
    <mt-field label="地址：" placeholder="请输入店铺地址" :state="data.address ? 'success' : 'error'" v-model="data.address"></mt-field>
    <!--<mt-field label="商品分类：">-->
    <mt-field label="店铺介绍：" type="textarea" placeholder="请输入店铺描述" rows="4" v-model="data.shopDesc"></mt-field>
    <mt-cell style="font-weight: bold" title="营业时间">
      <span class="color_fanzone"></span>
    </mt-cell>
    <mt-datetime-picker
      ref="pickerstart"
      type="time"
      @confirm="handleConfirmStart"
      v-model="open_time">
    </mt-datetime-picker>
    <div @click="openPicker1" style="">
      <mt-field label="开始：" :state="open_time ? 'success' : 'error'" type="datetime" v-model="open_time"></mt-field>
    </div>
    <mt-datetime-picker
      ref="pickerend"
      type="time"
      @confirm="handleConfirmEnd"
      v-model="close_time">
    </mt-datetime-picker>
    <div @click="openPicker2">
      <mt-field label="结束：" :state="close_time ? 'success' : 'error'" type="datetime" v-model="close_time"></mt-field>
    </div>
    <div>
      <!-- 内容 -->
      <div style="width: 100%;">
        <mt-cell style="font-weight: bold" title="添加店铺logo">
          <span class="color_fanzone"></span>
        </mt-cell>
        <m-up-loader :callback="getImg"></m-up-loader>
        <mt-cell style="font-weight: bold" title="添加店铺描述图">
          <span class="">最多5张</span>
        </mt-cell>
        <m-up-loader :callback="getImgs" :num="5"></m-up-loader>
      </div>
    </div>
    <div class="width100 margin_top_10 padding10">
      <mt-button type="primary" size="large" @click="updateShop">修改</mt-button>
    </div>
  </div>
</template>

<script>
import mUpLoader from '../../components/upLoadImg'
import {Toast, Indicator} from 'mint-ui'

export default {
  name: 'update',
  components: {
    mUpLoader
  },
  data () {
    return {
      'shopId': this.$shopId,
      'brandId': this.$brandId,
      data: {},
      open_time: '',
      close_time: '',
      slots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      classfies: {},
      api: this.$api
    }
  },
  methods: {
    handleConfirmStart (para) {
      console.log(para)
      this.open_time = para
    },
    openPicker1 () {
      console.log('click')
      this.$refs.pickerstart.open()
    },
    handleConfirmEnd (para) {
      console.log(para)
      this.close_time = para
    },
    openPicker2 () {
      console.log('click')
      this.$refs.pickerend.open()
    },
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(picker.getValues())
      this.data.categoryId = this.classfies[values[0]]
    },
    updateShop () {
      Indicator.open()
      this.api.connect('shop')
      console.log(`修改${JSON.stringify(this.data)}`)
      let params = this.data
      params['id'] = this.shopId
      params['brandId'] = this.brandId
      if (this.open_time && this.close_time) {
        let opentime = new Date(`1970-01-01 ${this.open_time}:00`)
        let closetime = new Date(`1970-01-01 ${this.close_time}:00`)
        params['openTime'] = opentime
        params['closeTime'] = closetime
      }
      this.api.reSave(params).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Toast('修改成功')
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    shopInfo () {
      Indicator.open()
      this.api.connect('shop')
      let param = {'id': this.shopId}
      param['brandId'] = this.brandId
      this.api.getDetail(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          this.data = res.data.data
          this.open_time = this.formatTime(this.data.openTime)
          this.close_time = this.formatTime(this.data.closeTime)
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    getImg (res) {
      console.log(res)
      this.data.icon = res[0]
    },
    getImgs (res) {
      console.log(res)
      this.data.gallery = res
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
    }
  },
  mounted () {
    this.shopInfo()
  },
  created () {
    // this.api = this.$api.connect('product')
  }
}
</script>

<style scoped>

</style>

<template>
    <div :bussName="bussName" :icon="icon" :addr="addr" :couponList="couponList"
         style="height: 110px;margin-bottom: 1px;padding: 5px"
         class="bg_ff">
        <div style="display: flex">
            <div class="float_left">
                <img :src="icon" class="buss-img"/>
            </div>
            <div class="float_left" style="margin-left: 5px;">
                <div class="fontsize_16 color_333 overflow-hide" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{bussName}}</div>
                <div v-if="couponList.length>0" class="overflow-hide margin_top_10" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-height:20px">
                    <span class="bg_groupon color_fff">券</span>&nbsp;
                    <span v-for="item in couponList">{{item.couponPrice}}代{{item.discountPrice}};</span>
                </div>
                <div class="overflow-hide margin_top_10" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-height:20px">{{addr}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'businessTemp',
  data () {
    return {}
  },
  props: {
    addr: {
      type: String,
      addr: ''
    },
    icon: {
      type: String,
      default: 'http://weixin.fanzone.vip/favicon.ico'
    },
    bussName: {
      type: String,
      default: ''
    },
    couponList: {
      type: Array,
      default: []
    }
  }
}
</script>

<style scoped>

</style>

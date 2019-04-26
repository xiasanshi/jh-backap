<template>
    <div :couponName="couponName" :bussName="bussName" :icon="icon" :exp="explain" :endTime="endTime"
         :showDate="showDate" :endText="endText"
         :couponPrice="couponPrice" :discountPrice="discountPrice" :exText="exText" :toDetail="callback"
         style="height: 80px;margin-bottom: 1px;padding: 5px"
         class="bg_ff" @click="_toDetail()">
        <div class="col-9" style="display: flex">
            <img :src="icon" class="coupon-img float_left"/>
            <div class="margin_top_5" style="float: left;margin-left: 5px;">
                <div class="overflow-hide"
                     style="width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-height:20px">
                    <span class="color_333">{{couponName}}</span>
                    <count-down :end-time="endTime" :end-text="endText"></count-down>
                </div>
                <div v-if="bussName!==''" class="margin_top_10">{{bussName}}</div>
                <div class="overflow-hide margin_top_10" v-if="showDate=='true'">
                    有效期至：{{endTime | formatDate(showDate)}}
                </div>
            </div>
        </div>
        <div class="col-3 text_align_center position_re">
            <div class="margin_top_10 text_align_center" style="margin-right: 10px;">
                <div class=""><span class="fontsize_16 color_red">￥{{couponPrice}}</span> <s
                        class="fontsize_12 color_999">{{discountPrice}}</s>
                </div>
                <div v-if="exText!==''" class="color_fff margin_top_15"
                     style="padding: 5px;background-color: #ff9933;border-radius: 5px">
                    {{exText}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import countDown from '../countDown'
import wxjs from '../../common/wx'

export default {
  name: 'couponTemp',
  components: {countDown},
  data () {
    return {

      explain: ''

    }
  },
  props: {
    endTime: {
      type: [String, Number],
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    exp: {
      type: String,
      default: ''
    },
    couponName: {
      type: String,
      default: ''
    },
    couponPrice: {
      type: [String, Number],
      default: ''
    },
    discountPrice: {
      type: [String, Number],
      default: ''
    },
    bussName: {
      type: String,
      default: ''
    },
    exText: {
      type: String,
      default: '立即购买'
    },
    toDetail: {
      type: [Function, String],
      default: ''
    },
    showDate: {
      type: String,
      default: 'true'
    },
    endText: {
      type: String,
      default: '已结束'
    }
  },
  mounted () {
    this.explain = this.exp
  },
  methods: {
    _toDetail () {
      if (this.toDetail && this.toDetail instanceof Function) {
        this.toDetail(...this)
      } else {

      }
    }
  },
  filters: {
    formatDate (time, showDate) {
      if (showDate === 'true') {
        return wxjs.formatDate(time)
      }
    }
  }
}
</script>

<style scoped>

</style>

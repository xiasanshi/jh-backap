<template>
    <div>
      <mt-header style="height: 50px" :title="good.name">
        <router-link to="/goods" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div style="height: 150px" class="bg_ff">
        <mt-swipe :auto="4000" class="swipe">
          <mt-swipe-item class="swipe-item3"><img style="width: 100%;height: 100%" :src="`https://diancan.qingzhao.net.cn/diancanrs/api/image/${good.icon}`"/></mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="margin_top_10">
        <mt-cell style="font-weight: bold" title="商品信息">
          <span class="color_fanzone"></span>
        </mt-cell>
        <mt-field label="商品名称：" placeholder="" v-model="good.name"></mt-field>
        <mt-field label="商品单价：" placeholder="" v-model="good.price"></mt-field>
        <mt-field label="商品分类：" placeholder="" v-model="good.category.type"></mt-field>
        <mt-field label="商品标签：" placeholder="" v-model="good.label"></mt-field>
        <mt-field label="商品描述：" type="textarea" rows="4" v-model="good.description"></mt-field>
      </div>
      <div class="margin_top_10">
        <mt-cell style="font-weight: bold" title="图片介绍">
          <span class="color_fanzone"></span>
        </mt-cell>
        <div style="height: 250px" class="bg_ff" v-for="each in galleryImgs">
          <mt-swipe :auto="4000" class="swipe margin_top_10">
            <mt-swipe-item class="swipe-item3"><img style="width: 100%;height: 100%" :src="`https://diancan.qingzhao.net.cn/diancanrs/api/image/${each.id}`"/></mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div class="width100 margin_top_10 padding10">
        <mt-button type="primary" size="large" @click="updatePre">{{good.status | format_good_status}}</mt-button>
      </div>
    </div>
</template>

<script>
import mUpLoader from '../../components/upLoadImg'
import {Indicator, Toast, MessageBox} from 'mint-ui'
import axios from 'axios'

export default {
  name: 'add',
  components: {
    mUpLoader
  },
  data () {
    return {
      goodId: '',
      shopId: '',
      brandId: '',
      data: {
        'name': '芒果',
        'price': 10,
        'categoryId': '2',
        'tag': '泰国芒果',
        'description': '亟待解决的破口空泡空',
        'icon': '',
        'shopId': this.$shopId,
        'stock': 9999999,
        'brandId': this.$brandId
      },
      good: {},
      active: 0,
      slots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      classfies: [{type: 'sss'},
        {type: 'sss'},
        {type: 'sss'}
      ],
      api: this.$api,
      search_value: '',
      galleryImgs: []
    }
  },
  methods: {
    toggle (index) {
      this.active = index
    },
    toShop (id) {
      this.$router.push({name: 'goodDetials', path: '/goodDetials', params: {'id': id}})
    },
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(picker.getValues())
      this.data.categoryId = this.classfies[values[0]]
    },
    updatePre () {
      let s = this.good.status === 'onSale' ? '下架' : '上架'
      MessageBox.confirm(`将要${s}商品，如果是，点击确定`).then(action => {
        console.log('用户点击了确定')
        this.updateProduct()
      })
    },
    updateProduct () {
      Indicator.open()
      this.api.connect('product')
      let param = {}
      param['id'] = this.goodId
      // param['shopId'] = this.shopId
      // param['brandId'] = this.brandId
      let s = this.good.status === 'onSale' ? '下架' : '上架'
      param['status'] = this.good.status === 'onSale' ? 'offSale' : 'onSale'
      // let s = this.good.status === 'onSale' ? '下架成功' : '上架成功'
      console.log(`修改商品${JSON.stringify(param)}`)
      this.api.create(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Toast(s + '成功')
          this.good = res.data.data
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    getClassfies () {
      Indicator.open()
      this.api.connect('category')
      let param = {'shopId': this.data.shopId}
      this.api.getAll(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          this.classfies = res.data.data
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    getPruduct () {
      Indicator.open()
      this.api.connect('product')
      let param = {'id': this.goodId}
      this.api.getDetail(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          this.good = res.data.data
          this.getGallaryImgs(this.good.gallery)
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    getImg (res) {
      console.log(res)
      this.icon = res[0]
    },
    getGallaryImgs (url) {
      axios.post(url).then(res => {
        if (res.status === 200) {
          this.galleryImgs = res.data
        } else {
          Toast(res.data.msg)
        }
      })
    }
  },
  mounted () {
    let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    this.shopId = shopInfo.shopId
    this.brandId = shopInfo.brandId
    this.goodId = this.$route.params.id
    this.getPruduct()
  },
  created () {
    // this.api = this.$api.connect('product')
  },
  filters: {
    format_good_status (val) {
      return val === 'onSale' ? '下架' : '上架'
    }
  }
}
</script>

<style scoped>

</style>

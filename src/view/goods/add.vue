<template>
  <div>
    <mt-header style="height: 50px" title="添加商品">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-field label="商品名称：" :state="data.name ? 'success' : 'none'" placeholder="请输入商品名称" v-model="data.name">
    </mt-field>
    <mt-field label="商品单价：" placeholder="请输入商品价格" :state="data.price ? 'success' : 'none'" type="number"
              v-model="data.price"></mt-field>
    <!--<mt-field label="商品分类：">-->
    <mt-cell style="" title="分类：">
    </mt-cell>
    <mt-picker class="bg_ff" :slots="slots" :visibleItemCount="3" @change="onValuesChange"></mt-picker>
    <!--</mt-field>-->
    <mt-cell style="" title="商品标签：">
      用于小程序分类展示
    </mt-cell>
    <mt-picker class="bg_ff" :slots="slots_labes" :visibleItemCount="3" @change="onValuesChange1"></mt-picker>
    <!--<mt-field label="商品标签：" placeholder="" v-model="data.label" :state="data.label ? 'success' : 'none'">用于展示</mt-field>-->
    <mt-field label="单位：" placeholder="" v-model="data.unit" :state="data.unit ? 'success' : 'none'"></mt-field>
    <mt-field label="商品描述：" :state="data.description ? 'success' : 'none'" type="textarea" placeholder="请输入商品描述"
              rows="4" v-model="data.description"></mt-field>
    <div>
      <!-- 内容 -->
      <div style="width: 100%;">
        <mt-cell style="font-weight: bold" title="添加商品展示图">
          <span class="color_fanzone"></span>
        </mt-cell>
        <m-up-loader :callback="getImg"></m-up-loader>
        <mt-cell style="font-weight: bold" title="添加商品描述图">
          <span class="">最多5张</span>
        </mt-cell>
        <m-up-loader :callback="getImgs" :num="5"></m-up-loader>
      </div>
    </div>
    <div class="width100 margin_top_10 padding10">
      <mt-button type="primary" size="large" @click="createProduct">创建</mt-button>
    </div>
  </div>
</template>

<script>
import mUpLoader from '../../components/upLoadImg'
import {Toast, Indicator} from 'mint-ui'

export default {
  name: 'add',
  components: {
    mUpLoader
  },
  data () {
    return {
      data: {
        'name': '',
        'price': '',
        'categoryId': '',
        'label': '',
        'description': '',
        'icon': '',
        'unit': 'kg',
        'shopId': this.$shopId,
        'stock': 9999999,
        'brandId': this.$brandId,
        'galleryList': []
      },
      slots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      slots_labes: [{
        flex: 1,
        values: ['今日推荐', '店长推荐', '猜你喜欢'],
        className: 'slot1',
        textAlign: 'center'
      }],
      classfies: {},
      labels: ['今日推荐', '店长推荐', '猜你喜欢'],
      api: this.$api
    }
  },
  methods: {
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(picker.getValues())
      this.data.categoryId = this.classfies[values[0]]
    },
    onValuesChange1 (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(picker.getValues())
      this.data.label = picker.getValues()[0]
    },
    createProduct () {
      Indicator.open()
      this.api.connect('product')
      console.log(`创建商品${JSON.stringify(this.data)}`)
      this.api.create(this.data).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Toast('创建商品成功')
          window.location.reload()
          // this.data = {}
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
          let classfies = res.data.data
          classfies.forEach((item) => {
            this.slots[0].values.push(item.type)
            this.classfies[item.type] = item.id
          })
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
      this.data.galleryList = res
    }
  },
  mounted () {
    this.getClassfies()
  },
  created () {
    // this.api = this.$api.connect('product')
  }
}
</script>

<style scoped>

</style>

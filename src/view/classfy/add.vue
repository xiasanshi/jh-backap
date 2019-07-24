<template>
  <div>
    <mt-header style="height: 50px" title="添加商品">
      <router-link to="index" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-field label="商品名称：" placeholder="请输入商品名称" v-model="data.name"></mt-field>
    <mt-field label="商品单价：" placeholder="请输入商品价格" v-model="data.price"></mt-field>
    <!--<mt-field label="商品分类：">-->
    <mt-cell style="" title="分类：">
    </mt-cell>
    <mt-picker :slots="slots" :visibleItemCount="3" @change="onValuesChange"></mt-picker>
    <!--</mt-field>-->
    <mt-field label="商品标签：" placeholder="" v-model="data.tag"></mt-field>
    <mt-field label="商品描述：" type="textarea" rows="4" v-model="data.description"></mt-field>
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
        <m-up-loader :callback="getImg" :num="5"></m-up-loader>
      </div>
    </div>
    <div class="width100 margin_top_10 padding10">
      <mt-button type="primary" size="large" @click="createProduct">创建</mt-button>
    </div>
  </div>
</template>

<script>
import mUpLoader from '../../components/upLoadImg'
import {Indicator, Toast} from 'mint-ui'

export default {
  name: 'add',
  components: {
    mUpLoader
  },
  data () {
    return {
      data: {
        'name': '芒果',
        'price': 10,
        'categoryId': '2',
        'tag': '泰国芒果',
        'description': '亟待解决的破口空泡空',
        'icon': '',
        'shopId': '',
        'stock': 9999999,
        'brandId': ''
      },
      slots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      classfies: {},
      api: this.$api,
      shopId: '',
      brandId: ''
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
    createProduct () {
      Indicator.open()
      this.api.connect('product')
      this.data.shopId = this.shopId
      this.data.brandId = this.brandId
      console.log(`创建分类${JSON.stringify(this.data)}`)
      this.api.create(this.data).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Toast('创建分类成功')
        } else {
          Toast(res.data.msg)
        }
      }).catch((res)=>{
          Indicator.close()
          Toast('创建分类失败，请检查您的网络，或者稍后重试。')
      })
      Indicator.close()
    },
    getClassfies () {
      Indicator.open()
      this.api.connect('category')
      let param = {'shopId': this.shopId}
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
      this.icon = res[0]
    }
  },
  mounted () {
    let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    console.log(localStorage.getItem('shopInfo'))
    this.shopId = shopInfo.shopId
    console.log(this.shopId)
    this.brandId = shopInfo.brandId
    this.getClassfies()
  },
  created () {
    // this.api = this.$api.connect('product')
  }
}
</script>

<style scoped>

</style>

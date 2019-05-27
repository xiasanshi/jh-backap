<template>
  <div>
    <div>
      <mt-header style="height: 50px" title="所有分类">
        <router-link to="/index" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
    </div>
    <div style="width: 100%;padding-bottom: 5px" class="margin_top_10" v-for="item in classfies">
      <mt-cell style="font-weight: bold" :title="item.type">
      </mt-cell>
      <mt-field label="分类名称：" placeholder="" v-model="item.type"></mt-field>
      <mt-field label="描述：" type="textarea" rows="2" v-model="item.description"></mt-field>
      <mt-button size="large" type="default" @click="update(item)">修改</mt-button>
    </div>
    <div @click="addSubmit" class="position_absolute text_align_center font_18px color_fff" style="bottom: 70px;right: 20px;height: 60px;width:60px;background: rgba(38,162,255,0.6);line-height: 60px;border-radius: 30px">
      新增
    </div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      position="runpop" style="width: 90%;">
      <div class="padding10" style="width: 100%;">
        <div class="width100 text_align_center"><h3 class="">新增分类</h3></div>
        <mt-field label="分类名称：" v-model="data.type"></mt-field>
        <mt-field label="描述：" rows="2" v-model="data.description"></mt-field>
        <div class="margin_top_10 padding_15">
          <mt-button size="large" type="primary" @click="add">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import mUpLoader from '../../components/upLoadImg'
import {Indicator, MessageBox, Toast} from 'mint-ui'

export default {
  name: 'classfy',
  components: {
    mUpLoader
  },
  data () {
    return {
      data: {
        'type': '',
        'description': '',
        'code': '',
        'shopId': '',
        'brandId': ''
      },
      popupVisible: false,
      classfies: {},
      api: this.$api,
      types: []
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
    add () {
      // alert('dddd')
      // console.log(this.data.type)
      // console.log(this.types)
      Indicator.open('正在创建')
      if (!this.data.type || this.types.indexOf(this.data.type) >= 0) {
        // console.log('======================')
        alert(`分类：${this.data.type}已经存在，不能重复创建`)
        return
      }
      // alert('sssssssssssssss')
      Indicator.open()
      this.api.connect('category')
      console.log(`创建分类${JSON.stringify(this.data)}`)
      this.api.create(this.data).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Indicator.close()
          Toast('创建商品分类成功')
          this.popupVisible = false
          this.getClassfies()
        } else {
            Indicator.close()
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    update (val) {
      this.api.connect('category')
      val['shopId'] = this.data.shopId
      val['brandId'] = this.data.brandId
      val['code'] = ''
      MessageBox.confirm('是否修改?').then(action => {
        Indicator.open()
        this.api.create(val).then(res => {
          Indicator.close()
          if (res.data.code === '2000') {
            Toast('修改商品分类成功')
            this.getClassfies()
          } else {
            Toast(res.data.msg)
          }
        })
      })
      Indicator.close()
    },
    getClassfies () {
      Indicator.open()
      this.api.connect('category')
      let param = {'shopId': this.data.shopId, 'id': this.data.shopId}
      this.api.getAll(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          this.classfies = res.data.data
          this.classfies.forEach(item => {
            this.types.push(item.type)
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
    },
    addSubmit () {
      this.popupVisible = true
    }
  },
  mounted () {
    let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
    console.log(localStorage.getItem('shopInfo'))
    this.data.shopId = shopInfo.shopId
    this.data.brandId = shopInfo.brandId
    this.getClassfies()
  },
  created () {
    // this.api = this.$api.connect('product')
  }
}
</script>

<style scoped>

</style>

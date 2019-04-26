<template>
  <div class="app">
    <!--<mt-search style="height: auto;"
               v-model="search_value"
               cancel-text="取消"
               placeholder="搜索"
               @keyup.native.enter="getSearchBuss">
    </mt-search>-->
    <!--<div class="nav" v-for="each in classfies">-->
      <!--<mt-button size="small" type="primary"  @click.native.prevent="active = 'tab-container1'">{{each.type}}</mt-button>-->
    <!--</div>-->
    <div id="app">
      <nav class="bg_ff">
        <p v-for="(item,$index) in classfies" @click="toggle($index,item)" :class="{active:$index===active}">{{item.type}}</p>
      </nav>
    </div>
    <div class="bg_ff" style="margin-top: 5px">
      <div class="buss col-6 bg_ff" style="" v-for="item in pruducts"
           @click="toShop(item.id)">
        <div style="padding-left:10px;padding-right: 10px;" class="bg_ff">
          <img v-lazy="`https://diancan.qingzhao.net.cn/diancanrs/api/image/${item.icon}`" class="width_100"
               style="height: 90px;">
        </div>
        <div class="" style="padding-left:10px;padding-right: 10px;margin-bottom: 10px">
          <div class="bg_ff margin_top_10">
            <div class="color_333 overflow-hide"
                 style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{item.name}}
            </div>
            {{item.price}} 元/kg
          </div>
        </div>
      </div>
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
      categoryId: 1,
      pruducts: [],
      active: 0,
      slots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      classfies: [
      ],
      api: this.$api,
      search_value: ''
    }
  },
  methods: {
    toggle (index, type) {
      this.active = index
      this.getPruducts(type.id)
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
    createProduct () {
      Indicator.open()
      this.api.connect('product')
      console.log(`创建商品${JSON.stringify(this.data)}`)
      this.api.create(this.data).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          Toast('创建商品成功')
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
          this.categoryId = this.classfies
          this.getPruducts(this.classfies[0].id)
        } else {
          Toast(res.data.msg)
        }
      })
      Indicator.close()
    },
    getPruducts (typeId) {
      Indicator.open()
      this.api.connect('product')
      let param = {'shopId': this.data.shopId, 'categoryId': typeId}
      this.api.getAll(param).then(res => {
        Indicator.close()
        if (res.data.code === '2000') {
          this.pruducts = res.data.data
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
    this.getClassfies()

  },
  created () {
    // this.api = this.$api.connect('product')
  }
}
</script>

<style scoped>
  .app{
    width: 100%;
    overflow:hidden;

  }
  .app nav{
    padding: 0 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: middle;
    -ms-flex-align: middle;
    align-items: middle;
    overflow: auto;
  }
  .app p{
    text-align: center;
    font-size: 16px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 10px;
    margin: 5px;

  }
  .app p.active{
    color: #26a2ff;
    /*background-color: #000000;*/
  }
</style>

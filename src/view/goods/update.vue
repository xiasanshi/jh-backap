<template>
    <div>
        <mt-header style="height: 50px" title="修改商品">
            <router-link to="/index" slot="left">
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
                <m-up-loader :callback="getImg" :files_="icon"></m-up-loader>
                <!--  <mt-cell style="font-weight: bold" title="添加商品描述图">
                      <span class="">最多5张</span>
                  </mt-cell>
                  <m-up-loader :callback="getImgs" :files_="classy_icon" :num="5"></m-up-loader>-->
            </div>
        </div>
        <div class="width100 margin_top_10 padding10">
            <mt-button type="primary" size="large" @click="createProduct">确认修改</mt-button>
        </div>
    </div>
</template>

<script>
    import mUpLoader from '../../components/upLoadImg'
    import {Indicator, Toast} from 'mint-ui'
    import axios from 'axios'

    export default {
        name: 'update',
        components: {
            mUpLoader
        },
        data () {
            return {
                data: {},
                goodId: '',
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                slots_labes: [{
                    flex: 1,
                    values: ['今日推荐', '店长推荐', '猜你喜欢', '预售'],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                classfies: {},
                labels: ['今日推荐', '店长推荐', '猜你喜欢', '预售'],
                api: this.$api,
                icon: [],
                classy_icon: []
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
            getPruduct () {
                Indicator.open()
                this.api.connect('product')
                let param = {'id': this.goodId}
                this.api.getDetail(param).then(res => {
                    Indicator.close()
                    if (res.data.code === '2000') {
                        this.data = res.data.data
                        this.slots[0].values.push(this.data.category.type)
                        let files = {
                            'src': `https://diancan.qingzhao.net.cn/diancanrs/api/image/${this.data.icon}`,
                            name: 'icon'
                        }
                        this.icon = [files]
                        this.getGallaryImgs(this.data.gallery)
                    } else {
                        Toast(res.data.msg)
                    }
                })
                Indicator.close()
            },
            getGallaryImgs (url) {
                axios.post(url).then(res => {
                    if (res.status === 200) {
                        this.classy_icon = []
                        res.data.forEach(item => {
                            let files = {'src': item.imgUrl, 'name': '', 'file': item.imgUrl}
                            // let files = new Image(item.imgUrl)
                            // files.src = item.imgUrl
                            console.log(files.file)
                            this.classy_icon.push(files)
                        })
                    }
                })
            },
            getBase64Image (img) {
                let canvas = document.createElement('canvas')
                canvas.width = 100
                canvas.height = 100
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, 100, 100)
                let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
                let dataURL = canvas.toDataURL('image/' + ext)
                return dataURL
            },
            createProduct () {
                this.api.connect('product')
                this.data.shopId = this.shopId
                /* if (!this.data.icon | this.data.icon === '') {
                     Toast('请输入商品展示图片。')
                     return
                 }*/
                if (!this.data.name | this.data.name === '') {
                    Toast('请输入商品名称。')
                    return
                }
                if (!this.data.price | this.data.price === '') {
                    Toast('请输入商品价格。')
                    return
                }
                // if (!this.data.galleryList | this.data.galleryList.length === 0) {
                //     this.data.galleryList = [0]
                // }
                console.log(`创建商品${JSON.stringify(this.data)}`)
                Indicator.open()
                this.api.create(this.data).then(res => {
                    Indicator.close()
                    if (res.data.code === '2000') {
                        Toast('修改商品成功')
                        this.data = {'unit': 'kg', 'stock': 99999, 'galleryList': []}
                        // window.location.reload()
                        // this.data = {}
                    } else {
                        Toast(res.data.msg)
                    }
                }).catch((res)=>{
                    Indicator.close()
                    Toast('更新失败，请检查您的网络，或者稍后重试。')
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
                this.data.icon = res[0]
            },
            getImgs (res) {
                console.log(res)
                this.data.galleryList = res
            }
        },
        mounted () {
            let shopInfo = JSON.parse(localStorage.getItem('shopInfo'))
            this.shopId = shopInfo.shopId
            this.brandId = shopInfo.brandId
            this.getClassfies()
            this.goodId = this.$route.params.id
            this.getPruduct()
        },
        created () {
            // this.api = this.$api.connect('product')
        }
    }
</script>

<style scoped>

</style>

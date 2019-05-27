<template>
    <div style="position: fixed;bottom: 0" :orderNum="orderNum" class="bg_ff width_100 border_top2 page">
        <!-- tab-container -->
        <!-- <mt-tab-container v-model="selected">
             <mt-tab-container-item id="Fanzone">
                 <Happy></Happy>
             </mt-tab-container-item>
             <mt-tab-container-item id="order">
                 <Join></Join>
             </mt-tab-container-item>
             <mt-tab-container-item id="pay">
                 <mt-cell v-for="n in 6" :title="'选项 ' + n" />
             </mt-tab-container-item>
         </mt-tab-container>-->
        <div style="width: 100%;height: 1px;background-color: #cccccc"></div>
        <mt-navbar v-model="selected" class="padding_0" style="padding: 5px;border-top: #cccccc 1px">
            <mt-tab-item id="index" class="padding_0" style="padding: 0px">
                <!--<img slot="icon" :src="formatSrc('Fanzone')" width="24" height="24">-->
                <span class="icon iconfont icon-shouye-" style="width: 100%;font-size: 27px"></span>
                <!--<i slot="icon" class="icon iconfont">&#xe64f;</i>-->
                <div style="margin-top: 5px" class="name">首页</div>
            </mt-tab-item>
            <mt-tab-item id="order" class="padding_0" style="padding: 0">
                <!--<img slot="icon" :src="formatSrc('order')" width="24" height="24">-->
                <!--参团-->
                <mt-badge v-if="t>0" type="error" size="small" style="position: absolute;">{{t}}</mt-badge>
                <span class="icon iconfont icon-lishidingdan" style="width: 100%;font-size: 30px"></span>
                <!--<i slot="icon" class="icon iconfont">&#xe64f;</i>-->
                <div style="margin-top: 5px" class="name">新订单</div>
            </mt-tab-item>
            <mt-tab-item id="personal" class="padding_0" style="padding: 0">
                <!--<img slot="icon" :src="formatSrc('customer')" width="24" height="24">-->
                <!--订单-->
                <span class="icon iconfont icon-geren" style="width: 100%;font-size: 30px"></span>
                <!--<i slot="icon" class="icon iconfont">&#xe64f;</i>-->
                <div style="margin-top: 5px" class="name">我的</div>
            </mt-tab-item>
        </mt-navbar>

    </div>
</template>

<script>
    import {JHWebSocket} from '../store/websocket'

    export default {
        name: 'jhfoot',
        props: {
            'orderNum': {
                type: Number,
                // required: true,
                default: 0
            }
        },
        data () {
            return {
                selected: 'fanzone',
                t: 0,
            }
        },
        methods: {
            formatSrc (id) {
                if (id === this.selected) {
                    return require('@/assets/images/icon/' + id + '-c.png')
                }
                return require('@/assets/images/icon/' + id + '-d.png')
            },
            setSelected (para) {
                // alert('sss')
                this.selected = para
            }
        },
        mounted () {
            this.t = this.orderNum
            // alert(this.selected)
            // this.connectWebsocket()
        },
        created () {
        },
        watch: {
            selected: function (newp, oldp) {
                // this.t = this.orderNum
                // alert('watch:'+newp)
                if (newp === 'order') {
                    if (this.$route.params.status && this.$route.params.status !== 'wait') {
                        return
                    }
                    this.$router.push({name: 'order', path: '/order', params: {'status': 'wait'}})
                    this.t = 0
                } else if (newp === 'personal') {
                    this.$router.push({name: 'personal'})
                } else if (newp === 'index') {
                    this.$router.push({name: 'index'})
                } else {
                    // alert('dd')
                    console.log(newp)
                }
            },
            '$route' (to, from) {
                let name = to.name
                // alert(name)
                this.setSelected(name)
            },
            'orderNum' (to, from) {
                // alert(to)
                this.t = to
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/min.scss";

    .mint-navbar .mint-tab-item.is-selected {
        color: #20b6f9;
        border: 0;
    }

    /*.mint-tab-item-label {*/
    /*color: inherit;*/
    /*font-size: 12px;*/
    /*line-height: 1;*/
    /*}*/
</style>

<template>
  <div class="page" style="height: 100%">
    <div id="tran" style="overflow-x: auto">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div style="height: 60px">
      <Footer ref="footer"></Footer>
    </div>
  </div>
</template>

<script>
import Footer from '../components/foot'

export default {
  components: {Footer},
  data () {
    return {
      sysName: 'FanZone',
      collapsed: false,
      sysUserName: '',
      sysUserAvatar: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.transition = this.checkDirecition(to.name, from.name) && 'slide-left' || 'slide-right'
      // alert('ss')
      // this.$refs.footer.setSelected(to.name);
    }
  },
  methods: {
    checkDirecition (to, from) {
      let map = ['index', 'foot', 'happy', 'join', 'order', 'preGroupon', 'preJoin', 'message']
      return (map.indexOf(to) - map.indexOf(from)) > 0
    },
    toFooter () {
      // alert('ss')
      // alert(this.$route.name)
      let name = this.$route.name
      if (name === undefined) {
        // alert(name)
        return this.$router.push({name: 'fanzone'})
      }
      // let param = name ? name : 'Fanzone'
      // alert(name)
      this.$refs.footer.setSelected(name)
    }
  },
  mounted () {
    let height = window.screen.availHeight - 60
    console.log('=============main' + height)
    document.getElementById('tran').style.height = height + 'px'
    this.toFooter()
    // wxjs.wx_share('聚汇', '', location.href)
    // this.$router.push({ name: 'index'});
  },
  events: {
    changed (msg) {
      console.log('Something changed: ' + msg)
    },
    connect () {
      console.log('Websocket connected to ' + this.$socket.nsp)
    },
    disconnect () {
      console.log('Websocket disconnected from ' + this.$socket.nsp)
    },
    error (err) {
      console.error('Websocket error!', err)
    }
  },
  watch: {
    websocket (newp, oldp) {
      if (newp === 'closed') {
        // websocket.reload('ws://pay.qingzhao.net.cn/fanZone/webSocket')
      } else {
        console.log('websocket: 异常了')
      }
    }
  }

}

</script>
<style lang="scss" scoped>
  @import "../assets/scss/min.scss";

  .mint-navbar .mint-tab-item.is-selected {
    color: #20b6f9;
    border: 0;
  }
</style>

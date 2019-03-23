import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login'
import index from '../view/index'
import order from '@/view/order/index'
import orderOver from '@/view/order/over'
import Home from '@/view/Home'
import personal from '@/view/personal/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/index',
          component: index,
          name: 'index',
          meta: {
            title: '聚汇 - 修改手机号'
          }
        }, {
          path: '/order',
          name: 'order',
          component: order
        }, {
          path: '/personal',
          name: 'personal',
          component: personal
        }, {
          path: 'orderOver',
          name: 'orderOver',
          component: orderOver
        }
      ]
    }

  ]
})

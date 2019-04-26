import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login'
import index from '../view/index'
import order from '@/view/order/index'
import orderOver from '@/view/order/over'
import Home from '@/view/Home'
import personal from '@/view/personal/index'
import goods from '@/view/goods/index'
import goodDetials from '@/view/goods/detials'
import addGood from '@/view/goods/add'
import classfy from '@/view/classfy/index'
import shopUpdate from '@/view/personal/update'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '*',
      redirect: {
        name: 'index'
      }
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
          path: '/order/:status',
          name: 'order',
          component: order
        }, {
          path: '/personal',
          name: 'personal',
          component: personal
        }, {
          path: '/orderOver/:status',
          name: 'orderOver',
          component: orderOver
        }, {
          path: 'goods',
          name: 'goods',
          component: goods
        }, {
          path: '/goodDetials/:id',
          name: 'goodDetials',
          component: goodDetials
        }, {
          path: 'addGood',
          name: 'addGood',
          component: addGood
        }, {
          path: 'classfy',
          name: 'classfy',
          component: classfy
        }, {
          path: 'shopUpdate',
          name: 'shopUpdate',
          component: shopUpdate
        }
      ]
    }

  ]
})

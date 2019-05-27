import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login'
import index from '../view/index'
import order from '@/view/order/index'
import Home from '@/view/Home'
import personal from '@/view/personal/index'
import goods from '@/view/goods/index'
import goodDetials from '@/view/goods/detials'
import goodUpdate from '@/view/goods/update'
import addGood from '@/view/goods/add'
import classfy from '@/view/classfy/index'
import shopUpdate from '@/view/personal/update'

Vue.use(Router)

// mode 打包app要用hash模式
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '',
      redirect: {
        name: 'index',
          path: '/index',
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
          path: 'goods',
          name: 'goods',
          component: goods
        }, {
          path: '/goodDetials/:id',
          name: 'goodDetials',
          component: goodDetials
        },{
              path: '/good/update/:id',
              name: 'update',
              component: goodUpdate
          },
          {
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

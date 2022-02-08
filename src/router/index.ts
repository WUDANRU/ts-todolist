import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Add from '@/components/Add.vue'
import Edit from '@/components/Edit.vue'
import Delete from '@/components/Delete.vue'
import Done from '@/components/Done.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      { path: '', redirect: { name: 'add' } }, //具名路由
      { path: '/add', name: 'add', component: Add },
      {
        path: '/edit',
        name: 'edit',
        component: Edit,
        beforeEnter: (to, from, next) => {//到哪去，从哪来，下一步
          console.log('from path',from.path)
          if (from.path === '/add') { //add页面点击编辑，走这里，再跳到edit页面
            // console.log('aa',from.path)
            next() //点击了有打印aa，但是不会跳转到edit页面，因为没有写next()
          } else { //刷新edit页面走这里
            // console.log('bb',from.path)
            next('/add') //edit页面刷新是不会保存数据的所以要返回add页面
            // next() //不加next(),edit页面刷新就会是空白的
          }
        }
      }, //这里的name:'edit'与Add.vue的router.push({name:'edit'})的name(edit)一样
      { path: '/delete', name: 'delete', component: Delete },
      { path: '/done', name: 'done', component: Done }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkExactActiveClass: 'active'
})

export default router

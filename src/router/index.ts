import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/task',
    name: 'task',
    // route level code-splitting
    // this generates a separate chunk (task.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "task" */ '../views/TaskView.vue')
  },
  {
    path: '/element',
    name: 'element',
    // route level code-splitting
    // this generates a separate chunk (task.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "element" */ '../views/Element/ElementView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

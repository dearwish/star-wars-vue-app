import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import FirstPart from '../views/PartOne.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'part1',
    component: FirstPart
  },
  {
    path: '/part2',
    name: 'part2',
    // lazy-loaded when the route is visited for the first time
    component: () => import('../views/PartTwo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

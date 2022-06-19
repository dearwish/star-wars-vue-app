import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PartOne from '../views/PartOne.vue'
import PartTwo from '../views/PartTwo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'part1',
    component: PartOne
  },
  {
    path: '/part2',
    name: 'part2',
    component: PartTwo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

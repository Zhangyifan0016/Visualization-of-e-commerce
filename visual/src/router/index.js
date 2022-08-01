import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from '@/views/TrendPage'
import MapPage from '@/views/MapPage'
import RankPage from '@/views/RankPage'
import HotPage from '@/views/HotPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    name: 'sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    name: 'trendpage',
    component: TrendPage
  },
  {
    path: '/mappage',
    name: 'mappage',
    component: MapPage
  },
  {
    path: '/rankpage',
    name: 'rankpage',
    component: RankPage
  },
  {
    path: '/hotpage',
    name: 'hotpage',
    component: HotPage
  }
]

const router = new VueRouter({
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Contact from '../pages/Contact.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/contact', name: 'contact', component: Contact },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

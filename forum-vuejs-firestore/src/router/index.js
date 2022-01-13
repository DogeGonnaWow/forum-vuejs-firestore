import Vue from 'vue'
import VueRouter from 'vue-router'
import Forum from '../views/Forum/Forum.vue'
import Post from "../views/Forum/Post";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/Forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/user/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Forum/Settings.vue')
  },
  {
    path: '/forum/:topic',
    name: 'Topic',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Forum/Topic.vue')
  },
  {
    path: '/forum/:topic/:post',
    name: 'Post',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Post
  },
  {
    path: '/user/post/:topic',
    name: 'Add',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Forum/AddPost.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to) {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: { x: 0, y: 150 },
        behavior: 'smooth'
      }
    }
  }
})

export default router

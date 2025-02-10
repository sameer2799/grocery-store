import Index from './homePage.js'
import Dash from './Components/dash.js'
import Login from './Components/login.js'
import Register from './Components/register.js'
import loghome from './Components/loghome.js'


const routes = [
    { path: '/', component: Index, name: 'Ind' },
    { path: '/home', component: loghome, name: 'Home' },
    { path: '/dashboard', component: Dash, name: 'Dash'},
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Register, name: 'Register' },
  ]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export default router

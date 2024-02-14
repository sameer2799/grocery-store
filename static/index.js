import MainComponent from './Components/mainComp.js'
import NavBar from './Components/navBar.js'
import router from './router.js'

const { createApp } = Vue


router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Ind' && !localStorage.getItem('auth-token') ? true : false ) 
    next({ name: 'Login'})
  else if (to.name === 'Login' && localStorage.getItem('auth-token') ? true : false)
    next({ name: 'Home'})
  else if (to.name === 'Register' && localStorage.getItem('auth-token') ? true : false)
    next({ name: 'Home'})
  else if (to.name === 'Ind' && localStorage.getItem('auth-token') ? true : false)
    next({ name: 'Home'})
  else next()

})


const app = createApp({
  template: `
  <div>
    <nav-bar :key="has_changed"></nav-bar>
    <main-component></main-component>
  </div>
  `,
  data(){
    return {
      has_changed: true,
    }
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed
    },
  },
  components: {
    MainComponent,
    NavBar
  }
})
  
app.use(router)

app.mount('#app')

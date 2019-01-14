import Vue from 'vue'
import Router from 'vue-router'
import LoginIndex from '@/components/LoginIndex'
import PhoneLogin from '@/components/PhoneLogin'
import Register from '@/components/Register'
import FindPwd from '@/components/FindPwd'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/loginNew',
      name: 'LoginIndex',
      component: LoginIndex
    },
    {
      path: '/loginNew/PhoneLogin',
      name: 'PhoneLogin',
      component: PhoneLogin
    },
    {
      path: '/loginNew/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/loginNew/FindPwd',
      name: 'FindPwd',
      component: FindPwd
    }
  ]
})

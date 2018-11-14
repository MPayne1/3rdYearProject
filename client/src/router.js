import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/Signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },
  ],
});

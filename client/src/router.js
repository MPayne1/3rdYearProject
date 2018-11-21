import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

// if user has a token theyre already logged in so redirect to dashboard
function loggedInRedirectDashboard(to, from, next) {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
}

// if user is logged in, has a token, then let them continue
function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next();
  } else {
    next('/login');
  }
}

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
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: isLoggedIn,
    },
  ],
});

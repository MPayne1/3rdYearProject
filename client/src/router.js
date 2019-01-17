import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import createLeague from './views/createLeague.vue';
import findLeague from './views/findLeague.vue';
import createTeam from './views/createTeam.vue';
import teamInfo from './views/teamInfo.vue';
import addPlayer from './views/addPlayer.vue';
import leagueInfo from './views/leagueInfo.vue';

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
    next('/auth/login');
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
      path: '/auth/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/auth/login',
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
    {
      path: '/league/create',
      name: 'createLeague',
      component: createLeague,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/league/find',
      name: 'findLeague',
      component: findLeague,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/team/create/:leagueID',
      name: 'createTeam',
      component: createTeam,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/team/info',
      name: 'teamInfo',
      component: teamInfo,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/team/addPlayer',
      name: 'addPlayer',
      component: addPlayer,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/league/info',
      name: 'leagueInfo',
      component: leagueInfo,
      beforeEnter: isLoggedIn,
    },
  ],
});

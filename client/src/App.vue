
<template>
  <div id="app">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand" :to="{name: 'home'}">SportsBook</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarColor01" aria-controls="navbarColor01"
          aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">(current)</span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'dashboard'}">Dashboard</router-link>
          </li>
          <li class="nav-item dropdown show"  :class="{'open': open}">
            <a class="nav-link dropdown-toggle" @click="open = !open, teamOpen = false"
            role="button" aria-haspopup="true" aria-expanded="false">League</a>
              <div class="dropdown-menu show" v-if="open" v-model="leagues"
              x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 41px, 0px);">
                  <a class="dropdown-item" id="leaguesIn" v-for="league in leagues"
                  v-on:click="leaguePage(league.leagueName)" @click="open = !open">{{ league.leagueName }}</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#/league/find" @click="open = !open">Find a league to join</a>
                  <a class="dropdown-item" href="#/league/create" @click="open = !open">Create League</a>
              </div>
          </li>

          <li class="nav-item dropdown show" :class="{'open': open}">
            <a class="nav-link dropdown-toggle" @click="teamOpen = !teamOpen ,open = false"
            role="button" aria-haspopup="true" aria-expanded="false">Teams</a>
            <div class="dropdown-menu show" v-if="teamOpen" v-model="teams"
              x-placement="bottom-start" style="position: absolute;
              will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 41px, 0px);">
              <a class="dropdown-item" id="teamInfo" v-for="team in teams" v-on:click="teamPage(team.teamName)" @click="teamOpen = !teamOpen" >{{team.teamName}}</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link  class="nav-link" :to="{ name: 'playerInfo',
            params: {username: user.username}}">{{user.username}} </router-link> <!--needs :to property -->
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-4" />
  </div>
</template>

<script>
const API_URL = 'https://localhost:3000/';
const TEAMS_URL = 'https://localhost:3000/team/playsfor';
const LEAGUES_URL = 'https://localhost:3000/league/playsIn';

export default {
  data: () => ({
    open: false,
    teamOpen: false,
    teams: [],
    user: {},
    leagues: [],
  }),
  mounted() {
    // get the authorization header
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => res.json())
      .then((result) => {
        // if there's no user object in the response then remove the token
        if (result.user) {
          this.user = result.user;
          console.log(result);
        } else {
          localStorage.removeItem('token');
        }
      }).then((res) => {
        // get teams user playsFor
        this.loadTeams();
      })
      .then((res) => {
      // get leagues user plays in
        this.loadLeagues();
      });
  },
  methods: {
    teamPage(teamName) {
      if (this.teams) {
        this.$router.push({ path: '/team/info/', query: { teamName } });
      }
    },
    leaguePage(leagueName) {
      this.$router.push({ path: '/league/info', query: { leagueName } });
    },
    // leagues user playsin
    loadLeagues() {
      fetch(LEAGUES_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((result) => {
          if (result) {
            this.leagues = result.result;
          }
        });
    },
    // teams user playsin
    loadTeams() {
      fetch(TEAMS_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((result) => {
          if (result) {
            this.teams = result.result;
          }
        });
    },
  },
};

</script>

<style>

#leaguesIn:hover, #teamInfo:hover{
  background-color: #2C3E50;
  color: #fff;
  text-decoration: none;
}

#leaguesIn, #teamInfo {
  color: #7b8a8b;
  text-decoration: none;
}
</style>

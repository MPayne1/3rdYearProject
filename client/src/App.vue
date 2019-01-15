
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
            <a class="nav-link dropdown-toggle" @click="open = !open"
            role="button" aria-haspopup="true" aria-expanded="false">League</a>
              <div class="dropdown-menu show" v-if="open" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 41px, 0px);">
                  <a class="dropdown-item" href="#/league/find" @click="open = !open">Find a league to join</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#/league/create" @click="open = !open">Create League</a>
              </div>
          </li>

          <li class="nav-item dropdown show" :class="{'open': open}">
            <a class="nav-link dropdown-toggle" @click="teamOpen = !teamOpen"
            role="button" aria-haspopup="true" aria-expanded="false">Teams</a>
            <div class="dropdown-menu show" v-if="teamOpen" v-model="teams"
              x-placement="bottom-start" style="position: absolute;
              will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 41px, 0px);">
              <a class="dropdown-item" id="teamInfo" v-for="team in teams" v-on:click="teamPage(team.teamName)" @click="teamOpen = !teamOpen" >{{team.teamName}}</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link">{{user.username}}</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-2" />
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/';
const TEAMS_URL = 'http://localhost:3000/team/playsfor';
export default {
  data: () => ({
    open: false,
    teamOpen: false,
    teams: [],
    user: {},
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
      }).then(res => {
        // get teams user playsFor
        var body = {
          userID: this.user.UserID,
        }
        fetch(TEAMS_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(body),
        }).then(res => res.json())
          .then((result) => {
            if (result){
              this.teams = result.result;
              console.log(this.teams);
            }
          })
    });
  },
  methods: {
    teamPage(teamName) {
      if (this.teams) {
        this.$router.push({ path: '/team/info/', query: { teamName: teamName } });
      }
    },
  },
};

</script>

<style>

#teamInfo:hover{
  background-color: #2C3E50;
  color: #fff;
  text-decoration: none;
}

#teamInfo{
  color: #7b8a8b;
  text-decoration: none;
}
</style>

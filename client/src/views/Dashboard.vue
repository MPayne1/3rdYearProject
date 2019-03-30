<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>Dashboard</h2>
      <h2>Hello {{user.username}}</h2>
      <button v-if="loggedIn" @click="logout()" class="btn btn-primary btn-lg"
        type="submit">Logout</button>

      <button v-if="!loggedIn" @click="login()" class="btn btn-primary btn-lg"
        type="submit">Login</button>
    </div>
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div id="announcementCard" class="card  bg-secondary">
          <div id="announcementList" class="card-header text-white"><h4>Your League Announcements</h4></div>
          <ul class="list-group list-group-flush text-center">
            <li class="list-group-item d-flex justify-content-between align-items-center card-body text-center"
            v-for="announcement in LeagueAnnouncements" @click="goToLeaguePage(announcement.leaguename)">
              <h5><b>{{announcement.leaguename}}: </b>{{announcement.message}}</h5>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div id="announcementCard" class="card  bg-secondary">
          <div id="announcementList" class="card-header text-white"><h4>Your Team Announcements</h4></div>
          <ul class="list-group list-group-flush text-center">
            <li class="list-group-item d-flex justify-content-between align-items-center card-body text-center"
            v-for="announcement in TeamAnnouncements" @click="goToTeamPage(announcement.teamname)">
              <h5><b>{{announcement.teamname}}:</b> {{announcement.message}}</h5>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://localhost:3000/';
const GET_LEAGUE_ANNOUNCEMENT_URL = 'https://localhost:3000/player/dashboard/LeagueAnnouncements';
const GET_TEAM_ANNOUNCEMENT_URL = 'https://localhost:3000/player/dashboard/TeamAnnouncements';

export default {
  data: () => ({
    user: {},
    loggedIn: false,
    LeagueAnnouncements: {},
    TeamAnnouncements: {},
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
          this.loggedIn = true;
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
      this.getLeagueAnnouncements();
      this.getTeamAnnouncements();
  },
  methods: {
    getLeagueAnnouncements() {
      fetch(GET_LEAGUE_ANNOUNCEMENT_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((result) => {
          if (result.message) {
            this.announcementErrorMessage = result.message;
          } else {
            console.log(result);
            this.LeagueAnnouncements = result;
          }
        });
    },
    getTeamAnnouncements() {
      fetch(GET_TEAM_ANNOUNCEMENT_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((result) => {
          if (result.message) {
            this.announcementErrorMessage = result.message;
          } else {
            console.log(result);
            this.TeamAnnouncements = result;
          }
        });
    },
    goToLeaguePage(leagueName) {
        this.$router.push({ path: '/league/info', query: { leagueName } });
    },
    goToTeamPage(teamName) {
      this.$router.push({ path: '/team/info', query: { teamName } });
    },
    logout() {
      localStorage.removeItem('token');
      location.reload();
      this.$router.push('/auth/login');
    },
    login() {
      localStorage.removeItem('token');
      this.$router.push('/auth/login');
    },
  },
};
</script>

<style>
button {
  margin-left: 10px;
}

</style>

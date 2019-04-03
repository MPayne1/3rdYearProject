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
            <div v-if="announcementErrorMessage" class="alert alert-danger" role="alert">
              {{announcementErrorMessage}}
            </div>
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
            <div v-if="TeamErrorMessage" class="alert alert-danger" role="alert">
              {{TeamErrorMessage}}
            </div>
            <li class="list-group-item d-flex justify-content-between align-items-center card-body text-center"
            v-for="announcement in TeamAnnouncements" @click="goToTeamPage(announcement.teamname)">
              <h5><b>{{announcement.teamname}}:</b> {{announcement.message}}</h5>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <vue-scheduler
        :min-date="null"
        :max-date="null"
        :labels="{
          today: 'Today',
          back: 'Back',
          next: 'Next',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          all_day: 'All Day'
        }"
        :time-range="[10,20]"
        :available-views="['month', 'week', 'day']"
        :initial-date= "new Date()"
        initial-view="month"
        use12
        :show-today-button="true"
        :events="fixtures"
        :disable-dialog="true">
      </vue-scheduler>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueScheduler from 'v-calendar-scheduler';
import  'v-calendar-scheduler/lib/main.css';
Vue.use(VueScheduler);

const API_URL = 'https://localhost:3000/';
const GET_LEAGUE_ANNOUNCEMENT_URL = 'https://localhost:3000/player/dashboard/LeagueAnnouncements';
const GET_TEAM_ANNOUNCEMENT_URL = 'https://localhost:3000/player/dashboard/TeamAnnouncements';
const GET_USERS_FIXTURES_URL = 'https://localhost:3000/player/dashboard/upcomingFixtures';


export default {
  data: () => ({
    user: {},
    loggedIn: false,
    LeagueAnnouncements: {},
    TeamAnnouncements: {},
    announcementErrorMessage: '',
    TeamErrorMessage: '',
    FixtureErrorMessage: '',
    fixtures: [],
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
      this.getUpcomingFixtures();
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
            this.TeamErrorMessage = result.message;
          } else {
            console.log(result);
            this.TeamAnnouncements = result;
          }
        });
    },
    getUpcomingFixtures() {
      fetch(GET_USERS_FIXTURES_URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((result) => {
          if (result.message) {
            this.FixtureErrorMessage = result.message;
          } else {
            console.log(result);
            this.fixtures = result;
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

<template>
  <div class="home text-center" @click="fixtureUpdated=false">
    <div class="jumbotron">
      <h2>{{ this.leagueName }}</h2>
    </div>
    <div class="text-center row">
      <div class="col-md-8">
        <table id="rankingsTable" class="table table-hover">
          <thead id="rankingsHeader">
            <tr class="text-white">
              <th scope="col">Team Name</th>
              <th scope="col">Played</th>
              <th scope="col">Wins</th>
              <th scope="col">Draws</th>
              <th scope="col">Losses</th>
              <th v-if="sport == 'Football'" scope="col">Goals Scored</th>
              <th v-if="sport == 'Football'" scope="col">Goals Conceded</th>
              <th v-if="sport == 'Hockey'" scope="col">Goals Scored</th>
              <th v-if="sport == 'Hockey'" scope="col">Goals Conceded</th>
              <th v-if="sport == 'American Football'" scope="col">Points Scored</th>
              <th v-if="sport == 'American Football'" scope="col">Points Conceded</th>
              <th v-if="sport == 'Rugby'" scope="col">Points Scored</th>
              <th v-if="sport == 'Rugby'" scope="col">Points Conceded</th>
              <th v-if="sport == 'Basketball'" scope="col">Points Scored</th>
              <th v-if="sport == 'Basketball'" scope="col">Points Conceded</th>
              <th v-if="sport == 'Tennis'" scope="col">Sets Won</th>
              <th v-if="sport == 'Tennis'" scope="col">Sets Lost</th>
              <th v-if="sport == 'Table Tennis'" scope="col">Sets Won</th>
              <th v-if="sport == 'Table Tennis'" scope="col">Sets Lost</th>
              <th v-if="sport == 'Volleyball'" scope="col">Games Won</th>
              <th v-if="sport == 'Volleyball'" scope="col">Games Lost</th>
              <th v-if="sport == 'Cricket'" scope="col">Runs For</th>
              <th v-if="sport == 'Cricket'" scope="col">Wickets For</th>
              <th v-if="sport == 'Cricket'" scope="col">Runs Against</th>
              <th v-if="sport == 'Cricket'" scope="col">Wickets Against</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in rankings" @click="goToTeamPage(team.teamname)">
                <th scope="row">{{ team.teamname }}</th>
                <td>{{ team.Played }}</td>
                <td>{{ team.Wins }}</td>
                <td>{{ team.Draws }}</td>
                <td>{{ team.Losses }}</td>
                <td v-if="sport == 'Football'">{{ team.GoalsScored }}</td>
                <td v-if="sport == 'Football'">{{ team.GoalsConceded }}</td>
                <td v-if="sport == 'Hockey'">{{ team.GoalsScored }}</td>
                <td v-if="sport == 'Hockey'">{{ team.GoalsConceded }}</td>
                <td v-if="sport == 'American Football'">{{ team.PointsScored }}</td>
                <td v-if="sport == 'American Football'">{{ team.PointsConceded }}</td>
                <td v-if="sport == 'Rugby'">{{ team.PointsScored }}</td>
                <td v-if="sport == 'Rugby'">{{ team.PointsConceded }}</td>
                <td v-if="sport == 'Basketball'">{{ team.PointsScored }}</td>
                <td v-if="sport == 'Basketball'">{{ team.PointsConceded }}</td>
                <td v-if="sport == 'Tennis'">{{ team.SetsFor }}</td>
                <td v-if="sport == 'Tennis'">{{ team.SetsAgainst }}</td>
                <td v-if="sport == 'Table Tennis'">{{ team.SetsFor }}</td>
                <td v-if="sport == 'Table Tennis'">{{ team.SetsAgainst }}</td>
                <td v-if="sport == 'Volleyball'">{{ team.GamesFor }}</td>
                <td v-if="sport == 'Volleyball'">{{ team.GamesAgainst }}</td>
                <td v-if="sport == 'Cricket'">{{ team.RunsFor }}</td>
                <td v-if="sport == 'Cricket'">{{ team.WicketsFor }}</td>
                <td v-if="sport == 'Cricket'">{{ team.RunsAgainst }}</td>
                <td v-if="sport == 'Cricket'">{{ team.WicketsAgainst }}</td>
                <td>{{ team.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-4">
        <div class="card bg-secondary border-secondary ">
          <div id="fixList" class="text-white card-header"><h4>Upcoming Fixtures</h4></div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between
              align-items-center card-body" v-for="(fixture,index) in fixtures" @click="showDatePicker(), fixtureIndex=index">
              <div id="fixtureInfo" class="align-items-center">
                <div>
                  <router-link :to="{ name: `${fixture.Sport}Results`, params: {fixtureID: fixture.fixtureID} }"><h5>{{ fixture.HomeTeamName }} vs. {{ fixture.AwayTeamName }}</h5></router-link>
                </div>
                <div v-if="fixtureInfoOpen && index == fixtureIndex">
                  <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                  </div>
                  <!--Show data picker with appropiate label, depending on if date has been entered or not -->
                  <VueCtkDateTimePicker v-if="fixture.date != null" id="dateTimePicker" @click="fixtureInfoOpen=true" :label="fixture.date.slice(0,10) + fixture.date.slice(11,16)" v-model="fixture.date" color="#2C3E50"></VueCtkDateTimePicker>
                  <VueCtkDateTimePicker v-if="fixture.date === null" id="dateTimePicker" @click="fixtureInfoOpen=true" label="Date" v-model="fixture.date" color="#2C3E50"></VueCtkDateTimePicker>
                  <form @submit.prevent="updateFixture(fixtureIndex)">
                    <div class="form-group">
                      <input v-model="fixture.address" type="text" class="form-control"
                        id="address" placeholder="Address" required>
                    </div>
                    <div class="form-group">
                      <input v-model="fixture.city" type="text" class="form-control"
                        placeholder="City" required>
                    </div>
                    <div class="form-group">
                      <input v-model="fixture.county" type="text" class="form-control"
                        placeholder="County/State" required>
                    </div>
                    <div class="form-group">
                      <input v-model="fixture.postcode" type="text" class="form-control"
                        placeholder="Postcode/ZIP code" required>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Update Fixture</button>
                    </div>
                    <div id="fixtureUpdatedDiv" v-if="fixtureUpdated" class="alert alert-success">
                      <h6 class="text-center">
                        Fixture Updated
                     </h6>
                    </div>
                  </form>
                </div>
              </div>
            </li>
          </ul>
          <div class="text-white card-footer" v-if="fixtures[0] === undefined">
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
            <div class="form-group">
              <h5>No Upcoming Fixtures</h5>
              <button @click="startSeason()" class="btn btn-primary btn-lg"
                type="submit">Start a new Season</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import joi from 'joi';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

const API_URL = 'https://localhost:3000/';
const START_SEASON_URL = 'https://localhost:3000/league/fixtures/update/startSeason';
const LEAGUEID_URL = 'https://localhost:3000/league/leagueID';
const UPCOMING_FIXTURES_URL = 'https://localhost:3000/league/fixtures/update/upcomingFixtures';
const UPDATE_FIXTURES_URL = 'https://localhost:3000/league/fixtures/update/updateFixture';
var FETCH_RANKINGS_URL = 'https://localhost:3000/league/rankings/fetch/';

const updateFixtureSchema = joi.object().keys({
  fixtureID: joi.number().positive().required(),
  date: joi.string().min(2).max(30).required(),
  address: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  city: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  county: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  postcode: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
});

export default {
  data: () => ({
    fixtures: [],
    user: {},
    leagueName: '',
    leagueID: '',
    fixtureInfoOpen: false,
    fixtureIndex: '',
    fixtureDate: '',
    errorMessage: '',
    fixtureUpdated: false,
    sport:'',
    rankings: [],
  }),
  watch: {
    fixtures: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  mounted() {
    // get the leagueName query
    if (this.$route.query.leagueName) {
      this.leagueName = this.$route.query.leagueName;
    } else {
      this.$router.push('/dashboard/');
    }
    // set the authorization header
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => res.json())
      .then((result) => {
        // if there's no user object in the response then remove the token
        if (result.user) {
          this.user = result.user;
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
    const leagueName = {
      leagueName: this.leagueName,
    };
    // get the leagueID
    fetch(LEAGUEID_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify(leagueName),
    }).then(res => res.json())
      .then((result) => {
        if (result) {
          this.leagueID = result.result[0].leagueID;
        }
      }).then((res) => {
        // get upcoming Fixtures
        this.upcomingFixtures();
      });
  },
  methods: {
    // show date picker without closing FixtureInfo
    showDatePicker() {
      if (this.fixtureInfoOpen !== true) {
        this.fixtureInfoOpen = true;
      }
    },

    // update fixture info
    updateFixture(index) {
      const body = {
        fixtureID: this.fixtures[index].fixtureID,
        date: this.fixtures[index].date,
        address: this.fixtures[index].address,
        city: this.fixtures[index].city,
        county: this.fixtures[index].county,
        postcode: this.fixtures[index].postcode,
      };
      if (this.validFixtureUpdate(body)) {
        fetch(UPDATE_FIXTURES_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(body),
        }).then(res => res.json())
          .then((result) => {
            if (result) {
              console.log(result);
              this.fixtureUpdated = true;
            }
          });
      }
    },
    // check entered info is valid
    validFixtureUpdate(body) {
      const result = joi.validate(body, updateFixtureSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('date')) {
        this.errorMessage = 'Please enter a valid Date';
      }
      if (result.error.message.includes('address')) {
        this.errorMessage = 'Please enter a valid Address';
      }
      if (result.error.message.includes('city')) {
        this.errorMessage = 'Please enter a valid city';
      }
      if (result.error.message.includes('county')) {
        this.errorMessage = 'Please enter a valid county';
      }
      if (result.error.message.includes('postcode')) {
        this.errorMessage = 'Please enter a valid Postcode/ZIP code';
      }
      console.log(result.error.message);
      return false;
    },

    // load upcoming Fixtures
    upcomingFixtures() {
      const leagueID = {
        leagueID: this.leagueID,
      };
      fetch(UPCOMING_FIXTURES_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID),
      }).then(res => res.json())
        .then((result) => {
          if (result) {
            this.fixtures = result.result;
            this.sport = this.fixtures[0].Sport;
            console.log(this.sport);
            this.getRankings();
          }
        });
    },
    // get the league Rankings
    getRankings() {
      const leagueID = {
        leagueID: this.leagueID,
      };
      const URL = FETCH_RANKINGS_URL+this.sport;
      fetch(URL,  {
        method: 'POST',
        headers : {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body : JSON.stringify(leagueID),
      }).then(res => res.json())
        .then((result) => {
          console.log(result);
          this.rankings = result;
        });
    },
    // start a new season
    startSeason() {
      this.errorMessage = '';
      const leagueID = {
        leagueID: this.leagueID,
      };
      fetch(START_SEASON_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID),
      }).then(res => res.json())
      .then((result) => {
        if (result) {
          console.log(result);
          this.upcomingFixtures();
        }
      });
    },
    goToTeamPage(teamName) {
      this.$router.push({ path: '/team/info/', query: { teamName } });
    }
  },
};
</script>

<style>
  #address {
    margin-top: 15px;
  }
  #fixtureInfo {
    margin-left: auto;
    margin-right: auto;
  }
  #fixtureUpdatedDiv {
    margin: 8px;
    padding: 3px;
  }
  #dateTimePicker {
    margin-top: 5px;
  }
  #fixList{
    background-color: #2C3E50
  }
  #rankingsHeader {
    background-color: #2C3E50;
  }
  table thead:first-child th:first-child{
    border-top-left-radius: 5px;
  }
  table thead:first-child th:last-child{
    border-top-right-radius: 5px;
  }
  table tr:last-child th:first-child {
    border-bottom-left-radius: 5px;
  }
  table tr:last-child td:last-child {
      border-bottom-right-radius: 5px;
  }
</style>

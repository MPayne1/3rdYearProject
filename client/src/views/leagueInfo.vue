<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>{{ this.leagueName }}</h2>
    </div>
    <div class="text-center row">
      <div class="col-md-8 jumbotron">
        <h4>show table here</h4>
      </div>

      <div class="col-md-4">
        <div class="card bg-secondary border-secondary ">
          <div id="fixList" class="text-white card-header"><h4>Upcoming Fixtures</h4></div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between
              align-items-center card-body" v-for="(fixture,index) in fixtures" @click="showDatePicker(), fixtureIndex=index">
              <div id="fixtureInfo" class="align-items-center">
                <div>
                  <router-link :to="{ name: '', params: {} }"><h5>{{ fixture.HomeTeamName }} vs. {{ fixture.AwayTeamName }}</h5></router-link>
                </div>
                <div v-if="fixtureInfoOpen && index == fixtureIndex">
                  <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                  </div>
                  <!--Show data picker with appropiate label, depending on if date has been entered or not -->
                  <VueCtkDateTimePicker v-if="fixture.date != null" id="dateTimePicker" @click="fixtureInfoOpen=true" :label="fixture.date" v-model="fixture.Date" color="#2C3E50"></VueCtkDateTimePicker>
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
                  </form>
                </div>
              </div>
            </li>
          </ul>
          <div class="text-white card-footer" v-if="fixtures[0] === undefined">
            <div class="form-group">
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
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
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
import joi from 'joi';

const API_URL = 'http://localhost:3000/';
const START_SEASON_URL = 'http://localhost:3000/league/startSeason';
const LEAGUEID_URL = 'http://localhost:3000/league/leagueID';
const UPCOMING_FIXTURES_URL = 'http://localhost:3000/league/upcomingFixtures';
const UPDATE_FIXTURES_URL = 'http://localhost:3000/league/updateFixtures';

const updateFixtureSchema = joi.object().keys({
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
            }
          });
      });
  },
  methods: {
    // show date picker without closing FixtureInfo
    showDatePicker() {
      if(this.fixtureInfoOpen !== true) {
        this.fixtureInfoOpen = true;
      }
    },

    //update fixture info
    updateFixture(index) {
      console.log(this.fixtures[index]);
      if(this.validFixtureUpdate(index)) {
        const body = {
          fixtureID: this.fixtures[index].fixtureID,
          date: this.fixtures[index].date,
          address: this.fixtures[index].address,
          city: this.fixtures[index].city,
          county: this.fixtures[index].county,
          postcode: this.fixtures[index].postcode,
        };
        console.log(body);
      }

    },
    // check entered info is valid
    validFixtureUpdate(index) {
      const result = joi.validate(this.fixtures[index], updateFixtureSchema);
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
      return false;
    },

    // start a new season
    startSeason() {
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
          }
        });
    },
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
  #dateTimePicker {
    margin-top: 5px;
  }
  #fixList{
    background-color: #2C3E50
  }
</style>

<template>
  <div class="home text-center" @click="fixtureUpdated=false">
    <div class="jumbotron">
      <h2>{{ this.leagueName }}</h2>
      <h5>{{this.leagueDescription}}</h5>
    </div>
    <div v-if="this.errorMessage" class="alert alert-danger" role="alert">
      {{this.errorMessage}}
    </div>
    <div class="text-center row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div id="announcementCard" class="card  bg-secondary">
          <div id="announcementList" class="card-header text-white"><h4>Announcements</h4></div>
          <ul class="list-group list-group-flush text-center">
            <div v-if="announcementErrorMessage && !isLeagueAdmin" class="alert alert-danger" role="alert">
              {{announcementErrorMessage}}
            </div>
            <li v-if="announcements"class="list-group-item d-flex justify-content-between align-items-center card-body text-center"
            v-for="(announcement,index) in announcements" @click="showAnnouncementInfo(index)">
              <h5 class="text-center">{{announcement.message}}</h5>
              <div v-if="announcementOpen && announcementIndex == index && isLeagueAdmin" class="">
                <button class="btn btn-primary" type="submit"
                @click="deleteAnnouncement(announcement.LeagueAnnouncementID)"
                name="button">Delete Announcement</button>
              </div>
            </li>
          </ul>
          <div class="card-footer"v-if="isLeagueAdmin">
            <div v-if="announcementErrorMessage" class="alert alert-danger" role="alert">
              {{announcementErrorMessage}}
            </div>
            <div v-if="announcementSuccess" class="alert alert-success" role="alert">
              {{announcementSuccess}}
            </div>
            <form  @submit.prevent="addAnnoucement()">
            <div class="form-group">
              <input v-model="newAnnouncement.message" type="text" class="form-control"
                placeholder="Enter message" required>
                <br>
              <button class="btn btn-primary btn-lg"
                type="submit">Add a new announcement</button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center row">
      <div class="col-md-2"></div>
      <div  style="overflow-x:auto" class="col-md-8">
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
                <th scope="row">
                  <img id="teamImage" :src="require(`../assets/Team Images/${team.imagePath}`)" alt="Profile Picture">
                  <br>
                  {{ team.teamname }}
                </th>
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
    </div>

    <div class="text-center row">
      <div class="col-md-2"></div>
      <div class="col-md-4">
        <div id="fixtureCard" class="card bg-secondary border-secondary ">
          <div id="fixList" class="text-white card-header"><h4>Upcoming Fixtures</h4> <small>If your team is playing itself you have a bye game.</small></div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between
              align-items-center card-body" v-for="(fixture,index) in fixtures" @click="showDatePicker(), fixtureIndex=index">
              <div id="fixtureInfo" class="align-items-center">
                <div>
                  <router-link :to="{ name: `${fixture.Sport}Results`, params: {fixtureID: fixture.fixtureID} }"><h5>{{ fixture.HomeTeamName }} vs. {{ fixture.AwayTeamName }}</h5></router-link>
                </div>
                <div v-if="fixtureInfoOpen && index == fixtureIndex">
                  <h6>Date</h6>
                  <!--Show date picker with appropiate label, depending on if date has been entered or not -->
                  <VueCtkDateTimePicker v-if="fixture.date != null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true" :label="fixture.date.slice(0,10)"
                    v-model="fixture.date" formatted="ll" color="#2C3E50"
                    :only-date="true" button-color="#2C3E50">
                 </VueCtkDateTimePicker>
                 <VueCtkDateTimePicker v-if="fixture.date === null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true" label="Date" v-model="fixture.date"
                    color="#2C3E50" formatted="ll" :only-date="true" button-color="#2C3E50">
                  </VueCtkDateTimePicker>

                  <!--Show date picker with appropiate label, depending on if date has been entered or not for startTime-->
                  <h6>Start Time</h6>
                  <VueCtkDateTimePicker v-if="fixture.startTime != null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true" :format=timeFormat
                    :formatted=timeFormat :output-format=timeFormat
                    :label="fixture.startTime" v-model="fixture.startTime"
                    color="#2C3E50" :only-time="true" button-color="#2C3E50">
                  </VueCtkDateTimePicker>
                  <VueCtkDateTimePicker v-if="fixture.startTime === null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true" :format=timeFormat
                    :formatted=timeFormat :output-format=timeFormat
                    label="Start Time" v-model="fixture.startTime" color="#2C3E50"
                    :only-time="true" button-color="#2C3E50">
                  </VueCtkDateTimePicker>

                  <h6>End Time</h6>
                  <VueCtkDateTimePicker v-if="fixture.endTime != null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true"  :format=timeFormat :formatted=timeFormat
                    :output-format=timeFormat :label="fixture.endTime"
                    v-model="fixture.endTime" color="#2C3E50" :only-time="true"
                    button-color="#2C3E50">
                  </VueCtkDateTimePicker>
                  <VueCtkDateTimePicker v-if="fixture.endTime === null" id="dateTimePicker"
                    @click="fixtureInfoOpen=true" :format=timeFormat
                    :formatted=timeFormat :output-format=timeFormat
                    label="End Time" v-model="fixture.endTime" color="#2C3E50"
                    :only-time="true" button-color="#2C3E50">
                  </VueCtkDateTimePicker>

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
                    <div class="text-center" v-if="(isATeamAdmin || isLeagueAdmin)">
                      <button type="submit" class="btn btn-primary">Update Fixture</button>
                    </div>
                    <div id="fixtureUpdatedDiv" v-if="FixtureErrorMessage" class="alert alert-danger" role="alert">
                      {{FixtureErrorMessage}}
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
            <div class="form-group">
              <h5>No Upcoming Fixtures</h5>
              <button @click="startSeason()" class="btn btn-primary btn-lg"
                type="submit" v-if="isLeagueAdmin">Start a new Season</button>
            </div>
          </div>
          <div class="text-white card-footer" v-if="fixturesExtra[0] != undefined && isAllFixtures == true">
            <button @click="showAllFixtures(), isAllFixtures = !isAllFixtures"
            class="btn btn-primary btn-lg">Show all upcoming fixtures</button>
          </div>
          <div class="text-white card-footer" v-if="this.fixtures.length > showMax">
            <button @click="splitFixtures(fixtures), isAllFixtures = true"
            class="btn btn-primary btn-lg">Hide Fixtures</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
          <div id="resultCard" class="card bg-secondary border-secondary">
            <div id="resultsList" class="text-white card-header">
              <h4>Results</h4>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between
                align-items-center card-body text-center" v-for="(result, index) in results"
                @click="showResultsInfo(index)">
                <div id="resultsInfo" class="align-items-center">
                  <h5>{{result.HomeTeamName}} vs {{result.AwayTeamName}}</h5>
                  <div v-if="resultsInfoOpen && resultIndex == index">
                    <div v-if="sport =='Football'">
                      <hr class="my-3">
                      <h5>{{result.HomeGoalsScoredFT}} - FT - {{result.AwayGoalsScoredFT}}</h5>
                      <h6>{{result.HomeGoalsScoredHT}} - HT - {{result.AwayGoalsScoredHT}}</h6>
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'American Football'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredFT}} - FT - {{result.AwayPointsScoredFT}}</h5>
                      <h6>{{result.HomePointsScoredQ3}} - Q3 - {{result.AwayPointsScoredQ3}}</h6>
                      <h6>{{result.HomePointsScoredHT}} - HT - {{result.AwayPointsScoredHT}}</h6>
                      <h6>{{result.HomePointsScoredQ1}} - Q1 - {{result.AwayPointsScoredQ1}}</h6>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Hockey'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredFT}} - FT - {{result.AwayPointsScoredFT}}</h5>
                      <h6>{{result.HomePointsScoredHT}} - HT - {{result.AwayPointsScoredHT}}</h6>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Basketball'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredFT}} - FT - {{result.AwayPointsScoredFT}}</h5>
                      <h6>{{result.HomePointsScoredQ3}} - Q3 - {{result.AwayPointsScoredQ3}}</h6>
                      <h6>{{result.HomePointsScoredHT}} - HT - {{result.AwayPointsScoredHT}}</h6>
                      <h6>{{result.HomePointsScoredQ1}} - Q1 - {{result.AwayPointsScoredQ1}}</h6>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Rugby'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredFT}} - FT - {{result.AwayPointsScoredFT}}</h5>
                      <h6>{{result.HomePointsScoredHT}} - HT - {{result.AwayPointsScoredHT}}</h6>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Volleyball'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredG1}} - game 1 - {{result.AwayPointsScoredG1}}</h5>
                      <h5>{{result.HomePointsScoredG2}} - game 2 - {{result.AwayPointsScoredG2}}</h5>
                      <h5>{{result.HomePointsScoredG3}} - game 3 - {{result.AwayPointsScoredG3}}</h5>
                      <h5>{{result.HomePointsScoredG4}} - game 4 - {{result.AwayPointsScoredG4}}</h5>
                      <h5>{{result.HomePointsScoredG5}} - game 5 - {{result.AwayPointsScoredG5}}</h5>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Table Tennis'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredG1}} - game 1 - {{result.AwayPointsScoredG1}}</h5>
                      <h5>{{result.HomePointsScoredG2}} - game 2 - {{result.AwayPointsScoredG2}}</h5>
                      <h5>{{result.HomePointsScoredG3}} - game 3 - {{result.AwayPointsScoredG3}}</h5>
                      <h5>{{result.HomePointsScoredG4}} - game 4 - {{result.AwayPointsScoredG4}}</h5>
                      <h5>{{result.HomePointsScoredG5}} - game 5 - {{result.AwayPointsScoredG5}}</h5>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Tennis'">
                      <hr class="my-3">
                      <h5>{{result.HomePointsScoredS1}} - 1st Set - {{result.AwayPointsScoredS1}}</h5>
                      <h5>{{result.HomePointsScoredS2}} - 2nd Set - {{result.AwayPointsScoredS2}}</h5>
                      <h5>{{result.HomePointsScoredS3}} - 3rd Set - {{result.AwayPointsScoredS3}}</h5>
                      <h5>{{result.HomePointsScoredS4}} - 4th Set - {{result.AwayPointsScoredS4}}</h5>
                      <h5>{{result.HomePointsScoredS5}} - 5th Set - {{result.AwayPointsScoredS5}}</h5>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                    <div v-if="sport == 'Cricket'">
                      <hr class="my-3">
                      <h5>{{result.HomeRunsI1}}/{{result.HomeWicketsLostI1}} - 1st Innings - {{result.AwayRunsI1}}/{{result.AwayWicketsLostI1}}</h5>
                      <h5>{{result.HomeRunsI2}}/{{result.HomeWicketsLostI2}} - 2nd Innings - {{result.AwayRunsI2}}/{{result.AwayWicketsLostI2}}</h5>
                      <hr class="my-3">
                      <div id="matchDescription">
                        <h6>Match Description:</h6>
                        <p>{{result.MatchDescription}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="text-white card-footer" v-if="results[0] === undefined">
              <h5>No Recent Results</h5>
            </div>
            <div class="text-white card-footer" v-if="resultsExtra[0] != undefined && isAllResults == true">
              <button @click="showAllResults(), isAllResults = !isAllResults"
              class="btn btn-primary btn-lg">Show all results</button>
            </div>
            <div class="text-white card-footer" v-if="this.results.length > showMax">
              <button @click="splitResults(results), isAllResults = true"
              class="btn btn-primary btn-lg">Hide Results</button>
            </div>
          </div>
        </div>
      <div class="col-md-2"></div>
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
const FETCH_RANKINGS_URL = 'https://localhost:3000/league/rankings/fetch/';
const FETCH_RESULTS_URL = 'https://localhost:3000/league/results/fetch/';
const GET_SPORT_URL = 'https://localhost:3000/league/sport';
const GET_ANNOUNCEMENT_URL = 'https://localhost:3000/league/announcements/selectAll';
const ADD_ANNOUNCEMENT_URL = 'https://localhost:3000/league/announcements/new';
const DELETE_ANNOUNCEMENT_URL = 'https://localhost:3000/league/announcements/remove';
const IS_LEAGUE_ADMIN_URL = 'https://localhost:3000/league/isLeagueAdmin';
const IS_A_TEAM_ADMIN_URL = 'https://localhost:3000/league/isTeamAdmin';

const updateFixtureSchema = joi.object().keys({
  fixtureID: joi.number().positive().required(),
  date: joi.string().min(2).max(30).required(),
  startTime: joi.string().min(2).max(30).required(),
  endTime: joi.string().min(2).max(30).required(),
  address: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  city: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  county: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  postcode: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
});

const addAnnouncementSchema = joi.object().keys({
  message: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,200}$/).required(),
  LeagueID: joi.number().positive().required(),
});

const deleteAnnouncementSchema = joi.object().keys({
  AnnouncementID: joi.number().positive().required(),
  LeagueID: joi.number().positive().required(),
});


export default {
  data: () => ({
    fixtures: [],
    timeFormat: 'HH:mm',
    fixturesExtra: [],
    isAllFixtures: true,
    user: {},
    leagueName: '',
    leagueID: '',
    fixtureInfoOpen: false,
    fixtureIndex: '',
    fixtureDate: '',
    errorMessage: '',
    fixtureUpdated: false,
    sport: '',
    rankings: [],
    results: [],
    resultsExtra: [],
    isAllResults: true,
    resultsInfoOpen: false,
    resultIndex: '',
    showMax: 10,
    announcements: {},
    newAnnouncement: {
      message: '',
      LeagueID: '',
    },
    announcementOpen: false,
    announcementIndex: '',
    announcementSuccess: '',
    announcementErrorMessage: '',
    isLeagueAdmin: false,
    isATeamAdmin: false,
    leagueDescription: '',
    FixtureErrorMessage: '',
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
        this.getSport();
        this.getAnnouncements();
        // get upcoming Fixtures
        this.upcomingFixtures();
        this.getIsLeagueAdmin();
        this.getIsATeamAdmin();
      });
  },
  methods: {
    // open the announcement item
    showAnnouncementInfo(index){
      if (this.announcementOpen == true && this.announcementIndex == index) {
        this.announcementOpen = false;
        this.announcementIndex = index;
      } else if (this.announcementOpen == true && this.announcementIndex != index) {
        this.announcementIndex = index;
        this.announcementOpen = true;
      } else {
        this.announcementOpen = !this.announcementOpen;
      }
    },
    // show date picker without closing FixtureInfo
    showDatePicker() {
      if (this.fixtureInfoOpen !== true) {
        this.fixtureInfoOpen = true;
      }
    },
    // open the results details
    showResultsInfo(index) {
      if (this.resultsInfoOpen == true && this.resultIndex == index) {
        this.resultsInfoOpen = false;
        this.resultIndex = index;
      } else if (this.resultsInfoOpen == true && this.resultIndex != index) {
        this.resultIndex = index;
        this.resultsInfoOpen = true;
      } else {
        this.resultsInfoOpen = !this.resultsInfoOpen;
      }
    },
    // show the list of all fixtures
    showAllFixtures() {
      this.fixtures = this.fixtures.concat(this.fixturesExtra);
    },
    // show the list of all results
    showAllResults() {
      this.results = this.results.concat(this.resultsExtra);
    },
    // update fixture info
    updateFixture(index) {
      console.log(this.fixtures[index].date);
      const body = {
        fixtureID: this.fixtures[index].fixtureID,
        date: this.fixtures[index].date,
        startTime: this.fixtures[index].startTime,
        endTime: this.fixtures[index].endTime,
        address: this.fixtures[index].address,
        city: this.fixtures[index].city,
        county: this.fixtures[index].county,
        postcode: this.fixtures[index].postcode,
      };
      if (this.validFixtureUpdate(body) && (this.isLeagueAdmin || this.isATeamAdmin)) {
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
        this.FixtureErrorMessage = 'Please enter a valid Date';
      }
      if (result.error.message.includes('address')) {
        this.FixtureErrorMessage = 'Please enter a valid Address';
      }
      if (result.error.message.includes('city')) {
        this.FixtureErrorMessage = 'Please enter a valid city';
      }
      if (result.error.message.includes('county')) {
        this.FixtureErrorMessage = 'Please enter a valid county';
      }
      if (result.error.message.includes('postcode')) {
        this.FixtureErrorMessage = 'Please enter a valid Postcode/ZIP code';
      }
      console.log(result.error.message);
      return false;
    },

    // get the sport of the league
    getSport() {
      const leagueID = {
        leagueID: this.leagueID,
      };
      fetch(GET_SPORT_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID),
      }).then(res => res.json())
        .then((result) => {
          if (result) {
            this.sport = result.result[0].Sport;
            this.leagueDescription = result.result[0].leagueDescription;
            console.log(this.sport);

            this.getRankings();
            this.getResults();
          }
        });
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
          if (result.result != undefined) {
            this.splitFixtures(result.result);
          }
          console.log(result.result);
        });
    },

    // split the fixtures, so only show showMax (10) of them
    splitFixtures(result) {
      if (result.length > this.showMax) {
        const length = result.length;
        this.fixturesExtra = result.slice();
        this.fixtures = result.splice(0, this.showMax);
        this.fixturesExtra = result.splice(0, length);
      } else {
        this.fixtures = result;
      }
    },

    // split the results, so only show showMax (10) of them
    splitResults(result) {
      if (result.length > this.showMax) {
        const length = result.length;
        this.resultsExtra = result.slice();
        this.results = result.splice(0, this.showMax);
        this.resultsExtra = result.splice(0, length);
      } else {
        this.results = result;
      }
      console.log(this.results);
    },

    // get the league Rankings
    getRankings() {
      const leagueID = {
        leagueID: this.leagueID,
      };
      const URL = FETCH_RANKINGS_URL + this.sport;
      fetch(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID),
      }).then(res => res.json())
        .then((rank) => {
          console.log(rank);
          this.rankings = rank;
        });
    },
    // start a new season
    startSeason() {
      this.errorMessage = '';
      if(this.isLeagueAdmin) {
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
              if (result.message) {
                throw new Error(result.message);
              } else {
                this.upcomingFixtures();
              }
            }
          }).catch((error) => {
            this.errorMessage = error.message;
            console.log(this.errorMessage);
          });
      }
    },
    // navigate to the team page
    goToTeamPage(teamName) {
      this.$router.push({ path: '/team/info/', query: { teamName } });
    },
    // get the past results
    getResults() {
      this.errorMessage = '';
      const leagueID = {
        leagueID: this.leagueID,
      };
      const URL = FETCH_RESULTS_URL + this.sport;
      fetch(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID),
      }).then(res => res.json())
        .then((result) => {
          if (result != undefined) {
            this.splitResults(result);
          }
        });
    },
    // send req for the league announcements
    getAnnouncements() {
      if(this.leagueID) {
        const body = {
          LeagueID: this.leagueID
        };
        fetch(GET_ANNOUNCEMENT_URL, {
          method: 'POST',
          body: JSON.stringify(body),
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
              this.announcements = result;
            }
          });
      }
    },
    // send req to add a new announcement
    addAnnoucement() {
      this.announcementErrorMessage = '';
      const body = {
        message: this.newAnnouncement.message,
        LeagueID: this.leagueID,
      };
      if (this.validAddAnnouncement(body) && this.isLeagueAdmin) {
        // send the request to the backend
        fetch(ADD_ANNOUNCEMENT_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then(response => response.json())
        .then((result) => {
          if (result.message) {
            this.announcementSuccess = result.message;
            this.getAnnouncements();
            this.newAnnouncement.message = '';
          }
        }).catch((error) => { // if any errors catch them any display error message
          this.errorMessage = error.message;
        });
      }
    },
    // send req to delete announcement
    deleteAnnouncement(announcementID) {
      console.log(announcementID);
      const body = {
        AnnouncementID: announcementID,
        LeagueID: this.leagueID,
      };
      if(this.validDeleteAnnouncement(body) && this.isLeagueAdmin) {
        fetch(DELETE_ANNOUNCEMENT_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
        }).then(res => res.json())
          .then((result) => {
            if (result.message) {
              this.announcements = '';
              this.announcementSuccess = result.message;
              this.getAnnouncements();
            } else {
              console.log(result);
            }
          });
      }
    },
    // send req to check if user is a league admin
    getIsLeagueAdmin() {
      if(this.leagueID) {
        const body = {
          LeagueID: this.leagueID
        };
        fetch(IS_LEAGUE_ADMIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
        }).then(res => res.json())
          .then((result) => {
            if (result.LeagueAdmin) {
            console.log(result);
              this.isLeagueAdmin = true;
            } else {
              console.log(result);
              this.isLeagueAdmin = false;
            }
          });
      }
    },
    // send req to check if user is a team captain
    getIsATeamAdmin() {
      if(this.leagueID) {
        const body = {
          LeagueID: this.leagueID
        };
        fetch(IS_A_TEAM_ADMIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
        }).then(res => res.json())
          .then((result) => {
            if (result.TeamAdmin) {
            console.log(result);
              this.isATeamAdmin = true;
            } else {
              console.log(result);
              this.isATeamAdmin = false;
            }
          });
      }
    },
    // check new announcement is valid
    validAddAnnouncement(body) {
      const result = joi.validate(body, addAnnouncementSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('message')) {
        this.announcementErrorMessage = 'Messsage must be less than 200 characters';
      }
      if (result.error.message.includes('LeagueID')) {
        this.announcementErrorMessage = 'Invlaid league, please refresh the page';
      }
      return false;
    },
    // check delete announcement is valid
    validDeleteAnnouncement(body) {
      const result = joi.validate(body, deleteAnnouncementSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('AnnouncementID')) {
        this.announcementErrorMessage = 'Invalid announcement please refresh the page';
      }
      if (result.error.message.includes('LeagueID')) {
        this.announcementErrorMessage = 'Invlaid league, please refresh the page';
      }
      return false;
    },
  },
};
</script>

<style>
  #address {
    margin-top: 15px;
  }
  #fixtureInfo, #resultsInfo {
    margin-left: auto;
    margin-right: auto;
  }
  #fixtureUpdatedDiv {
    margin: 8px;
    padding: 3px;
  }
  #dateTimePicker {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  #fixList, #resultsList{
    background-color: #2C3E50;
  }
  #rankingsHeader {
    background-color: #2C3E50;
  }
  #rankingsTable {
    margin-bottom: 40px;
    border: 1px solid #95a3a4;
  }
  #resultsInfo {
    word-spacing: 0.5em;
  }
  #matchDescription {
    word-spacing: normal;
  }
  #resultCard, #fixtureCard {
    margin-bottom: 20px;
  }
  #teamImage {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .vdp-datepicker__calendar .cell.selected,
  .vdp-datepicker__calendar .cell.selected:hover,
  .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover {
    background: #2C3E50;
    border: #2C3E50;
    color: white;
  }

  .month-container {
    height: auto !important;
  }

  #DatePicker.datepicker-container
  .datepicker-days .datepicker-day.enable[data-v-59132e9e] {
    margin-left: 0px;
  }
</style>

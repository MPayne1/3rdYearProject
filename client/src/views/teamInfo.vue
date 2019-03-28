<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>TeamInfo</h2>
      <h4>{{teamName}}</h4>
    </div>
    <div class="text-center row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div id="announcementCard" class="card  bg-secondary">
          <div id="announcementList" class="card-header text-white"><h4>Announcements</h4></div>
          <ul class="list-group list-group-flush text-center">
            <li class="list-group-item d-flex justify-content-between align-items-center card-body text-center"
            v-for="(announcement,index) in announcements" @click="showAnnouncementInfo(index)">
              <h5 class="text-center">{{announcement.message}}</h5>
              <div v-if="announcementOpen && announcementIndex == index " class="">
                <button class="btn btn-primary" type="submit" @click="deleteAnnouncement(announcement.AnnouncementID)"name="button">Delete Announcement</button>
              </div>
            </li>
          </ul>
          <div class="card-footer">
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
      <div class="col-md-4">
        <div id="playersCard" class="card text-white bg-secondary">
          <div id="playerList" class="card-header"><h4>Players</h4></div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center card-body" v-for="player in players">
              <router-link :to="{ name: 'playerInfo', params: {username: player.username} }">
                {{ player.username }}</router-link>
            </li>
          </ul>
          <div class="card-footer">
            <form  @submit.prevent="addPlayer()">
            <div class="form-group">
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{errorMessage}}
              </div>
              <label for="username">Player's Username</label>
              <input v-model="username" type="text" class="form-control"
                id="username" placeholder="Username" required>
                <br>
              <button @click="addPlayer()" class="btn btn-primary btn-lg"
                type="submit">Add a player</button>
            </div>
          </form>
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
    </div>
      <div class="col-md-2"></div>
  </div>
</template>

<script>
  import joi from 'joi';

  const API_URL = 'https://localhost:3000/';
  const PLAYERS_URL = 'https://localhost:3000/team/allplayers';
  const TEAMID_URL = 'https://localhost:3000/team/teamID';
  const ADDPLAYER_URL = 'https://localhost:3000/team/addPlayer';
  const GET_SPORT_URL = 'https://localhost:3000/team/sport';
  const FETCH_RESULTS_URL = 'https://localhost:3000/team/results/';
  const GET_ANNOUNCEMENT_URL = 'https://localhost:3000/team/announcements/selectAll';
  const ADD_ANNOUNCEMENT_URL = 'https://localhost:3000/team/announcements/new';
  const DELETE_ANNOUNCEMENT_URL = 'https://localhost:3000/team/announcements/remove';

  const addPlayerSchema = joi.object().keys({
    username: joi.string().alphanum().min(2).max(20)
      .required(),
    teamID: joi.number().positive().required(),
  });

  const addAnnouncementSchema = joi.object().keys({
    message: joi.string().regex(/^[\w\-\s]{0,200}$/).required(),
    TeamID: joi.number().positive().required(),
  });

  const deleteAnnouncementSchema = joi.object().keys({
    AnnouncementID: joi.number().positive().required(),
    TeamID: joi.number().positive().required(),
  });

  export default {
    data: () => ({
      user: {},
      players: [],
      teamName: '',
      username: '',
      errorMessage: '',
      announcementErrorMessage: '',
      teamID: '',
      sport: '',
      results: [],
      resultsExtra: [],
      isAllResults: true,
      resultsInfoOpen: false,
      resultIndex: '',
      showMax: 10,
      announcements: {},
      newAnnouncement: {
        message: '',
        TeamID: '',
      },
      announcementOpen: false,
      announcementIndex: '',
      announcementSuccess: '',
    }),
    watch: {
      username: {
        handler() {
          this.errorMessage = '';
        },
        deep: true,
      },
      teamID: {
        handler() {
          this.errorMessage = '';
        },
        deep: true,
      },
      teamName: {
        handler() {
          this.errorMessage = '';
        },
        deep: true,
      },
    },
    mounted() {
      // get the teamName query
      if (this.$route.query.teamName) {
        this.teamName = this.$route.query.teamName;
      } else {
        this.$router.push('/dashboard/');
      }
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
            this.$router.push('/auth/login');
          }
        });
      const teamName = {
        teamName: this.teamName,
      };
      // get the teamID
      fetch(TEAMID_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(teamName),
      }).then(res => res.json())
        .then((result) => {
          if (result) {
            this.teamID = result.result[0].teamID;
            console.log(this.teamID);
            // get the players in the team
            this.playerList();
            this.getSport();
            this.getAnnouncements();
          }
        });
    },
    methods: {
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
      // show the list of all results
      showAllResults() {
        this.results = this.results.concat(this.resultsExtra);
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
      // get the past results
      getResults() {
        this.errorMessage = '';
        const teamID = {
          teamID: this.teamID,
        };
        const URL = FETCH_RESULTS_URL + this.sport;
        fetch(URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(teamID),
        }).then(res => res.json())
          .then((result) => {
            if (result != undefined) {
              this.splitResults(result);
            }
          });
      },
      // get the sport of the league
      getSport() {
        const teamID = {
          teamID: this.teamID,
        };
        fetch(GET_SPORT_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(teamID),
        }).then(res => res.json())
          .then((result) => {
            if (result) {
              this.sport = result.result[0].Sport;
              console.log(this.sport);
              this.getResults();
            }
          });
      },
      // get list of teams players
      playerList() {
        if (this.teamName) {
          const body = {
            teamName: this.teamName,
          };
          fetch(PLAYERS_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${localStorage.token}`,
            },
          }).then(res => res.json())
            .then((result) => {
              if (result) {
                this.players = result.result;
              }
            });
        }
      },
      addPlayer() {
        this.errorMessage = '';
        const body = {
          username: this.username,
          teamID: this.teamID,
        };
        if (this.validAddPlayer(body)) {
          // send the request to the backend
          this.adding = true;
          fetch(ADDPLAYER_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${localStorage.token}`,
            },
          }).then((response) => {
            if (response.ok) {
              return response.json();
            }
            // handle any errors the server returns
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }).then(() => { // if no errors refresh players list
            this.playerList();
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        }
      },

      getAnnouncements() {
        if(this.teamID) {
          const body = {
            TeamID: this.teamID
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
      addAnnoucement() {
        this.announcementErrorMessage = '';
        const body = {
          message: this.newAnnouncement.message,
          TeamID: this.teamID,
        };
        if (this.validAddAnnouncement(body)) {
          // send the request to the backend
          this.adding = true;
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
      deleteAnnouncement(announcementID) {
        const body = {
          AnnouncementID: announcementID,
          TeamID: this.teamID,
        };
        if(this.validDeleteAnnouncement(body)) {
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
                this.announcementSuccess = result.message;
                this.getAnnouncements();
              } else {
                console.log(result);
              }
            });
        }
      },
      validAddPlayer(body) {
        const result = joi.validate(body, addPlayerSchema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes('username')) {
          this.errorMessage = 'Invalid username';
        }
        if (result.error.message.includes('teamID')) {
          this.errorMessage = 'Invlaid team, please go back to previous page';
        }
        return false;
      },
      validAddAnnouncement(body) {
        const result = joi.validate(body, addAnnouncementSchema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes('message')) {
          this.announcementErrorMessage = 'Messsage must be less than 200 characters';
        }
        if (result.error.message.includes('teamID')) {
          this.announcementErrorMessage = 'Invlaid team, please refresh the page';
        }
        return false;
      },
      validDeleteAnnouncement(body) {
        const result = joi.validate(body, deleteAnnouncementSchema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes('AnnouncementID')) {
          this.announcementErrorMessage = 'Invalid announcement please refresh the page';
        }
        if (result.error.message.includes('TeamID')) {
          this.announcementErrorMessage = 'Invlaid team, please refresh the page';
        }
        return false;
      },
    },
  };
</script>

<style>
  #playerList, #announcementList{
    background-color: #2C3E50;
  }
  #playersCard, #announcementCard {
    margin-bottom: 20px;
  }
</style>

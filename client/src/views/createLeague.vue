<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Create League</h1>
  </div>
  <div class="text-center">
    <p>Enter in the details for the new league, including the; name, sport,
       no. of teams and how points allocated </p>
  </div>
  <div v-if="creating" class="text-center">
    <img src="../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <div v-if="MoreThanWin" class="alert alert-warning">
    <h4 class="alert-heading">Warning!</h4>
    {{MoreThanWin}}
  </div>
  <form v-if="!creating" @submit.prevent="create()">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="LeagueName">League Name</label>
          <input v-model="league.name" type="text" class="form-control"
            id="LeagueName" placeholder="League Name" required>
        </div>
        <div class="form-group col-md-6">
         <label for="sportSelect">Select Sport</label>
         <select v-model="league.sport" class="form-control" placeholder="Please Choose a Sport">
           <option disabled value="">Please Choose a Sport</option>
           <option value="Football">Football</option>
           <option value="Rugby">Rugby</option>
           <option value="Tennis">Tennis</option>
           <option value="Basketball">Basketball</option>
         </select>
         </div>
       </div>
       <div class="form-row">
         <div class="form-group col-md-6">
           <label for="maxTeams">Maximum no. of teams</label>
           <input v-model.number="league.maxTeams" type="text" class="form-control"
             id="maxTeams" placeholder="Maximum no. of teams" required>
         </div>
         <div class="form-group col-md-6">
           <label for="games">Number of times each team plays each other per season</label>
           <input v-model.number="league.games" type="text" class="form-control"
             id="games" placeholder="No. of times" required>
         </div>
       </div>
       <div class="form-row">
         <div class="form-group col-md-4">
           <label for="loss">Points for a loss</label>
           <input v-model.number="league.loss" type="text" class="form-control"
             id="loss" placeholder="Points for a loss" required>
         </div>
         <div class="form-group col-md-4">
           <label for="draw">Points for a draw</label>
           <input v-model.number="league.draw" type="text" class="form-control"
             id="draw" placeholder="Points for a draw" required>
         </div>
         <div class="form-group col-md-4">
           <label for="loss">Points for a win</label>
           <input v-model.number="league.win" type="text" class="form-control"
             id="win" placeholder="Points for a win" required>
         </div>
        </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Create League</button>
      </div>
  </form>
</div>
</div>
</template>

<script>
import joi from 'joi';
const CREATE_LEAGUE_URL = 'http://localhost:3000/league/create';
const API_URL = 'http://localhost:3000/';

const schema = joi.object().keys({
  name: joi.string().alphanum().min(2).max(20)
    .required(),
  sport: joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
  admin: joi.required(),
  maxTeams: joi.number().positive().required(),
  loss: joi.number().min(0).required(),
  draw: joi.number().min(0).required(),
  win: joi.number().positive().required(),
  games: joi.number().positive().required(),
});

export default {
  data: () => ({
    creating: false,
    errorMessage: '',
    MoreThanWin: '',
    user: {},
    league: {
      name: '',
      sport: '',
      admin: '',
      maxTeams: '',
      draw: '',
      loss: '',
      win: '',
      games: '',
    },

  }),
  watch: {
    league: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
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
          this.admin = this.user.UserID;
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      });
  },
  methods: {
    create() {
      if (this.validLeague()) {
        const body = {
          leagueName: this.league.name,
          Sport: this.league.sport,
          leagueAdmin: this.user.UserID,
          maxTeams: this.league.maxTeams,
          loss: this.league.loss,
          draw: this.league.draw,
          win: this.league.win,
          games: this.league.games,
        };
        // send the request to the backend
        this.creating = true;
        fetch(CREATE_LEAGUE_URL, {
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
        }).then(() => { // if no errors redirect to dashboard
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.creating = false;
            this.$router.push('/dashboard');
          }, 700);
        }).catch((error) => { // if any errors catch them any display error message
          this.creating = false;
          this.errorMessage = error.message;
        });
      }
    },
    // check if inputted league is valid
    validLeague() {
      const result = joi.validate(this.league, schema);
      if (result.error === null) {
        return true;
      }
      console.log(result.errorMessage);
      if (result.error.message.includes('leagueName')) {
        this.errorMessage = 'League name is invalid, must be between 2 and 20 characters and not include any symbols';
      }
      if (result.error.message.includes('sport')) {
        this.errorMessage = 'Sport is invalid please select a sport';
      }
      if (result.error.message.includes('maxTeams')) {
        this.errorMessage = 'You must enter a maximum number of teams allowed in the league.';
      }
      if(result.error.message.includes('games')) {
        this.error.message = 'You must enter a number of games to play each team per season';
      }
      if(this.loss > this.win) {
        this.MoreThanWin = 'You will award a loss more points than a win';
      }
      if(this.draw > this.win) {
        this.MoreThanWin = 'You will award a draw more points than a win';
      }
      return false;
    },
  },
};
</script>
<style>
</style>

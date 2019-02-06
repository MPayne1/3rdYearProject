<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Create Team</h1>
  </div>
  <div class="text-center">
    <p>Enter in the team name for the new team, take care as this can't be changed once the team is created.</p>
  </div>
  <div v-if="creating" class="text-center">
    <img src="../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <form v-if="!creating" @submit.prevent="create()">
        <div class="form-group col-sm-4">
          <label for="teamName">Team Name</label>
          <input v-model="team.name" type="text" class="form-control"
            id="teamName" placeholder="Team Name" required>
        </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Create team and join League</button>
      </div>
  </form>
</div>
</div>
</template>

<script>
import joi from 'joi';
import router from '../router.js';

const CREATE_TEAM_URL = 'http://localhost:3000/team/create';
const API_URL = 'http://localhost:3000/';

const schema = joi.object().keys({
  name: joi.string().alphanum().min(2).max(20)
    .required(),
  sport: joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
  admin: joi.required(),
  league: joi.required(),
});

export default {
  data: () => ({
    creating: false,
    errorMessage: '',
    MoreThanWin: '',
    user: {},
    team: {
      name: '',
      sport: '',
      admin: '',
      league: '',
    },
  }),
  watch: {
    team: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  mounted() {
    this.team.league = this.$route.params.leagueID;
    if (this.$route.query.Sport) {
      this.team.sport = this.$route.query.Sport;
    } else {
      this.$router.push('/league/find');
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
          this.team.admin = this.user.UserID;
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
  },
  methods: {
    create() {
      if (this.validLeague()) {
        const body = {
          TeamName: this.team.name,
          Sport: this.team.sport,
          TeamAdmin: this.user.UserID,
          LeagueID: this.team.league,
        };
        // send the request to the backend
        this.creating = true;
        fetch(CREATE_TEAM_URL, {
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
      if (result.error.message.includes('teamName')) {
        this.errorMessage = 'Team name is invalid, must be between 2 and 20 characters and not include any symbols';
      }
      if (result.error.message.includes('sport')) {
        this.errorMessage = 'Please find a league to join first';
      }
      return false;
    },
  },
};
</script>
<style>
</style>

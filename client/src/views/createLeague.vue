<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Create Legue</h1>
  </div>
  <div v-if="creating" class="text-center">
    <img src="../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <form v-if="!creating" @submit.prevent="create()">
      <div class="form-group ">
        <label for="LeagueName">League Name</label>
        <input v-model="league.name" type="text" class="form-control"
          id="LeagueName" placeholder="League Name" required>
      </div>
      <div class="form-group">
       <label for="sportSelect">Select Sport</label>
       <select v-model="league.sport" class="form-control" placeholder="Please Choose a Sport">
         <option disabled value="">Please Choose a Sport</option>
         <option value="Football">Football</option>
         <option value="Rugby">Rugby</option>
         <option value="Tennis">Tennis</option>
         <option value="Basketball">Basketball</option>
       </select>
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
  sport:  joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
  admin: joi.required()
});

export default {
  data: () => ({
    creating: false,
    errorMessage: '',
      user: {},
    league: {
      name: '',
      sport: '',
      admin: '',
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
        };
        // send the request to the backend
        this.creating = true;
        fetch(CREATE_LEAGUE_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${localStorage.token}`,
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          // handle any errors the server returns
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then(() => { // if no errors redirect to login page
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
    validLeague() {
      const result = joi.validate(this.league, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('leagueName')) {
        this.errorMessage = 'League name is invalid, must be between 2 and 20 characters and not include any symbols';
      }
      if (result.error.message.includes('sport')) {
        this.errorMessage = 'Sport is invalid please select a sport';
      }
      return false;
    },
  },
};
</script>
<style>
</style>

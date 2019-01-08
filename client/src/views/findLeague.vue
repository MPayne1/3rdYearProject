<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h3>Find a League</h3>
  </div>
  <div v-if="finding" class="text-center">
    <img src="../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
    <form v-if="!finding" @submit.prevent="find()">
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="country">Country</label>
          <input v-model="league.country" type="text" class="form-control" id="country"
            placeholder="Enter Country" required>
        </div>
        <div class="form-group col-md-3">
          <label for="county">County/State</label>
          <input v-model="league.county" type="text" class="form-control" id="county"
            placeholder="Enter County/State" required>
        </div>
        <div class="form-group col-md-3">
          <label for="city">City</label>
          <input v-model="league.city" type="text" class="form-control" id="city"
            placeholder="Enter City" required>
        </div>
        <div class="form-group col-md-3">
         <label for="sport">Select Sport</label>
         <select v-model="league.sport" class="form-control" placeholder="Please Choose a Sport" id ="sport">
           <option disabled value="">Please Choose a Sport</option>
           <option value="Football">Football</option>
           <option value="Rugby">Rugby</option>
           <option value="Tennis">Tennis</option>
           <option value="Basketball">Basketball</option>
         </select>
         </div>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Find League</button>
      </div>
    </form>
  </div>
  <div class="jumbotron" v-if="foundLeagues">
    <h4>League Name</h4>
    <h6>{{ errorMessage }}</h6>
    <router-link v-for="league in Leagues" :to="{ name: 'createTeam',
      params: {leagueID: league.leagueID}, query:{Sport: league.Sport}}">
      {{ league.LeagueName }}</router-link>
    <!--  <a href=`team/create/?=${league.LeagueName}` v-for="league in Leagues">{{ league.LeagueName }}</a> -->
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const FIND_URL = 'http://localhost:3000/league/find';

const schema = joi.object().keys({
  city: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  county: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  country: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  sport: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
});

export default {
  data: () => ({
    finding: false,
    errorMessage: '',
    user: {},
    league: {
      city: '',
      county: '',
      country: '',
      sport: '',
    },
    Leagues: [{
      LeagueName: '',
      Sport: '',
      LeagueID: '',
    }],
    foundLeagues: false,
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
          this.$router.push('/auth/login');
        }
      });
  },
  methods: {
    find() {
      this.errorMessage = '';
      if (this.validLeague()) {
        const body = {
          city: this.league.city,
          county: this.league.county,
          country: this.league.country,
          sport: this.league.sport,
        };
        this.finding = true;
        fetch(FIND_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          // handle any errors the server returns
          return response.json().then((error) => {
            this.foundLeagues = false;
            this.errorMessage = error.message;
            throw new Error(error.message);
          });
        }).then((result) => {
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.finding = false;
            console.log(result);
            this.foundLeagues = true;
            this.Leagues = result;
          }, 700);
        }).catch((error) => { // if any errors catch them any display error message
          this.finding = false;
          this.foundLeagues = false;
          this.errorMessage = error.message;
        });
      }
    },
    validLeague() {
      const result = joi.validate(this.league, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('country')) {
        this.errorMessage = 'Please enter a valid country';
      }
      if (result.error.message.includes('city')) {
        this.errorMessage = 'Please enter a valid city';
      }
      if (result.error.message.includes('county')) {
        this.errorMessage = 'Please enter a valid state/county';
      }
      if (result.error.message.includes('sport')) {
        this.errorMessage = 'Please enter a valid sport';
      }
      return false;
    },
  },
};
</script>

<style>

</style>

<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Find a League to join</h1>
  </div>
  <div v-if="finding" class="text-center">
    <img src="../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
    <form v-if="!finding" @submit.prevent="find()">

    </form>
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const FIND_URL = 'http://localhost:3000/league/find';

const schema = joi.object().keys({
  city: joi.string().min(2).max(30).required(),
  county: joi.string().min(2).max(30).required(),
  country: joi.string().min(2).max(30).required(),
  sport: joi.string().min(2).max(30).required(),
});
export default {
  data: () => ({
    finding: false,
    errorMessage: '',
    league: {
      city: '',
      county: '',
      country: '',
      sport: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
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
          },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          // handle any errors the server returns
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.finding = false;
            this.$router.push('#/league/join');
          }, 700);

          // HERE show the leagues that can be joined

        }).catch((error) => { // if any errors catch them any display error message
          this.loggingIn = false;
          this.errorMessage = error.message;
        });
      }
    },
    validLegaue() {
      const result = joi.validate(this.league, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('city')) {
        this.errorMessage = 'Please select a city';
      }
      if (result.error.message.includes('county')) {
        this.errorMessage = 'Please select a state/county';
      }
      if(result.error.message.includes('country')) {
        this.errorMessage = 'Please select a country';
      }
      if(result.error.message.includes('sport')) {
        this.errorMessage = 'Please select a sport';
      }
      return false;
    },
  },
};
</script>

<style>

</style>

<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Results</h1>
    <div class="text-center">
      <p>Enter in the results for the match, take care as these can't be changed once they're uploaded.</p>
    </div>
  </div>
  <div v-if="updatingResults" class="text-center">
    <img src="../../assets/loading_ring.svg"/>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
    <form v-if="!updatingResults" @submit.prevent="updateResults()">

      <div class="text-center">
        <h5>Half-Time</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredHT">Home Team HT</label>
          <input v-model="results.HomePointsScoredHT" type="text" class="form-control" id="HomePointsScoredHT"
            placeholder="Home team score at half-time." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredHT">Away Team HT</label>
          <input v-model="results.AwayPointsScoredHT" type="text" class="form-control" id="AwayPointsScoredHT"
            placeholder="Away team score at half-time." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Full-Time</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredFT">Home Team FT</label>
          <input v-model="results.HomePointsScoredFT" type="text" class="form-control" id="HomePointsScoredFT"
            placeholder="Home team score at full-time." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredFT">Away Team FT</label>
          <input v-model="results.AwayPointsScoredFT" type="text" class="form-control" id="AwayPointsScoredFT"
            placeholder="Away team score at full-time." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Match Description</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-12">
          <textarea v-model="results.MatchDescription" type="text" class="form-control" id="MatchDescription"
            placeholder="Enter a description of the match." required></textarea>
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Upload Results</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const RESULTS_URL = 'https://localhost:3000/league/results/update/rugby';

// schema for inserting hockey results
const schema = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredHT: joi.number().min(0).required(),
  AwayPointsScoredHT: joi.number().min(0).required(),
  HomePointsScoredFT: joi.number().min(0).required(),
  AwayPointsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});

export default {
  data: () => ({
    updatingResults: false,
    errorMessage: '',
    results: {
      FixtureID: '',
      HomePointsScoredHT: '',
      AwayPointsScoredHT: '',
      HomePointsScoredFT: '',
      AwayPointsScoredFT: '',
      MatchDescription: '',
    },
  }),
  watch: {
    results: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  mounted() {
    this.results.FixtureID = this.$route.params.fixtureID;
  },
  methods: {
    updateResults() {
      this.errorMessage = '';
      if (this.validResults()) {
        const body = {
          FixtureID: this.results.FixtureID,
          HomePointsScoredHT: this.results.HomePointsScoredHT,
          AwayPointsScoredHT: this.results.AwayPointsScoredHT,
          HomePointsScoredFT: this.results.HomePointsScoredFT,
          AwayPointsScoredFT: this.results.AwayPointsScoredFT,
          MatchDescription: this.results.MatchDescription,
        };
        this.updatingResults = true;
        fetch(RESULTS_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          // handle any other errors the server returns
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.updatingResults = false;
            // go back to leagueInfo page
            this.$router.go(-1);
          }, 700);
        }).catch((error) => { // if any errors catch them any display error message
          this.updatingResults = false;
          this.errorMessage = error.message;
        });
      }
    },
    validResults() {
      const result = joi.validate(this.results, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('HomePointsScoredHT')) {
        this.errorMessage = "Home team's score for half-time is invalid, can only contain numbers.";
        return false;
      }
      if (result.error.message.includes('HomePointsScoredFT')) {
        this.errorMessage = "Home team's score for full-time is invalid, can only contain numbers.";
        return false;
      }
      if (result.error.message.includes('AwayPointsScoredHT')) {
        this.errorMessage = "Away team's score for half-time is invalid, can only contain numbers.";
        return false;
      }
      if (result.error.message.includes('AwayPointsScoredFT')) {
        this.errorMessage = "Away team's score for full-time is invalid, can only contain numbers.";
        return false;
      }
      if (result.error.message.includes('MatchDescription')) {
        this.errorMessage = 'Match Description is invlaid, can only contain letters or numbers.';
        return false;
      }
      return false;
    },
  },
};
</script>

<style>

</style>

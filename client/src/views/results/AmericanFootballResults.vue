<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Results</h1>
    <div class="text-center">
      <p>Enter in the results for the fixutre, take care as these can't be changed once they're uploaded.</p>
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
        <h5>First Quater</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="HomePointsScoredQ1">Home Team Q1</label>
          <input v-model="results.HomePointsScoredQ1" type="text" class="form-control" id="HomePointsScoredQ1"
            placeholder="Home team score after the first quater." required>
        </div>
        <div class="form-group col-md-6">
          <label for="AwayPointsScoredQ1">Away Team Q1</label>
          <input v-model="results.AwayPointsScoredQ1" type="text" class="form-control" id="AwayPointsScoredQ1"
            placeholder="Away team score after the first quater." required>
        </div>
      </div>
      <hr class="my-4">
      <div class="text-center">
        <h5>Half-Time</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="HomePointsScoredHT">Home Team HT</label>
          <input v-model="results.HomePointsScoredHT" type="text" class="form-control" id="HomePointsScoredHT"
            placeholder="Home team score at half-time." required>
        </div>
        <div class="form-group col-md-6">
          <label for="AwayPointsScoredHT">Away Team HT</label>
          <input v-model="results.AwayPointsScoredHT" type="text" class="form-control" id="AwayPointsScoredHT"
            placeholder="Away team score at half-time." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Third Quater</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="HomePointsScoredQ3">Home Team Q3</label>
          <input v-model="results.HomePointsScoredQ3" type="text" class="form-control" id="HomePointsScoredQ3"
            placeholder="Home team score after the third quater." required>
        </div>
        <div class="form-group col-md-6">
          <label for="AwayPointsScoredQ3">Away Team Q3</label>
          <input v-model="results.AwayPointsScoredQ3" type="text" class="form-control" id="AwayPointsScoredQ3"
            placeholder="Away team score after the third quater." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Full-Time</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="HomePointsScoredFT">Home Team FT</label>
          <input v-model="results.HomePointsScoredFT" type="text" class="form-control" id="HomePointsScoredFT"
            placeholder="Home team score at full-time." required>
        </div>
        <div class="form-group col-md-6">
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
import App from '../../App.vue';

const RESULTS_URL = 'https://localhost:3000/league/results/update/americanFootball';

// schema for inserting american football results
const schema = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredQ1: joi.number().min(0).required(),
  AwayPointsScoredQ1: joi.number().min(0).required(),
  HomePointsScoredHT: joi.number().min(0).required(),
  AwayPointsScoredHT: joi.number().min(0).required(),
  HomePointsScoredQ3: joi.number().min(0).required(),
  AwayPointsScoredQ3: joi.number().min(0).required(),
  HomePointsScoredFT: joi.number().min(0).required(),
  AwayPointsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().trim().regex(/^[\w\-\s]{0,300}$/).required(),
});

export default {
  data: () => ({
    updatingResults: false,
    errorMessage: '',
    results: {
      FixtureID: '',
      HomePointsScoredQ1: '',
      AwayPointsScoredQ1: '',
      HomePointsScoredHT: '',
      AwayPointsScoredHT: '',
      HomePointsScoredQ3: '',
      AwayPointsScoredQ3: '',
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
          HomePointsScoredQ1: this.results.HomePointsScoredQ1,
          AwayPointsScoredQ1: this.results.AwayPointsScoredQ1,
          HomePointsScoredHT: this.results.HomePointsScoredHT,
          AwayPointsScoredHT: this.results.AwayPointsScoredHT,
          HomePointsScoredQ3: this.results.HomePointsScoredQ3,
          AwayPointsScoredQ3: this.results.AwayPointsScoredQ3,
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
      if (result.error.message.includes('HomePointsScoredQ1')) {
        this.errorMessage = "Home team's score for the first quater is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredQ3')) {
        this.errorMessage = "Home team's score for the third quater is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredHT')) {
        this.errorMessage = "Home team's score for the half-time is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredFT')) {
        this.errorMessage = "Home team's score for the full-time is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredQ1')) {
        this.errorMessage = "Away team's score for the first quater is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredQ3')) {
        this.errorMessage = "Away team's score for the third quater is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredHT')) {
        this.errorMessage = "Away team's score for the half-time is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredFT')) {
        this.errorMessage = "Away team's score for the full-time is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('MatchDescription')) {
        this.errorMessage = 'Match Description is invlaid, can only contain letters or numbers.';
      }
      return false;
    },
  },
};
</script>

<style>

</style>

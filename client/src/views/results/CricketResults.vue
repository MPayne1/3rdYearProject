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
        <h5>First Innings</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomeRunsI1">Home Team Runs</label>
          <input v-model="results.HomeRunsI1" type="text" class="form-control" id="HomeRunsI1"
            placeholder="Home team runs." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="HomeWicketsLostI1">Home Team Wickets Lost</label>
          <input v-model="results.HomeWicketsLostI1" type="text" class="form-control" id="HomeWicketsLostI1"
            placeholder="Home team wickets lost" required>
        </div>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayRunsI1">Away Team Runs</label>
          <input v-model="results.AwayRunsI1" type="text" class="form-control" id="AwayRunsI1"
            placeholder="Away team runs." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayWicketsLostI1">Away Team Wickets Lost</label>
          <input v-model="results.AwayWicketsLostI1" type="text" class="form-control" id="AwayWicketsLostI1"
            placeholder="Away team wickets lost" required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Second Innings</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomeRunsI2">Home Team Runs</label>
          <input v-model="results.HomeRunsI2" type="text" class="form-control" id="HomeRunsI2"
            placeholder="Home team runs." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="HomeWicketsLostI2">Home Team Wickets Lost</label>
          <input v-model="results.HomeWicketsLostI2" type="text" class="form-control" id="HomeWicketsLostI2"
            placeholder="Home team wickets lost" required>
        </div>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayRunsI2">Away Team Runs</label>
          <input v-model="results.AwayRunsI2" type="text" class="form-control" id="AwayRunsI2"
            placeholder="Away team runs." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayWicketsLostI2">Away Team Wickets Lost</label>
          <input v-model="results.AwayWicketsLostI2" type="text" class="form-control" id="AwayWicketsLostI2"
            placeholder="Away team wickets lost" required>
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
      <br>
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

const RESULTS_URL = 'https://localhost:3000/league/results/update/cricket';

// schema for inserting american football results
const schema = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomeRunsI1: joi.number().min(0).required(),
  AwayRunsI1: joi.number().min(0).required(),
  HomeWicketsLostI1: joi.number().min(0).required(),
  AwayWicketsLostI1: joi.number().min(0).required(),
  HomeRunsI2: joi.number().min(0).required(),
  AwayRunsI2: joi.number().min(0).required(),
  HomeWicketsLostI2: joi.number().min(0).required(),
  AwayWicketsLostI2: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,300}$/).required(),
});

export default {
  data: () => ({
    updatingResults: false,
    errorMessage: '',
    results: {
      FixtureID: '',
      HomeRunsI1: '',
      AwayRunsI1: '',
      HomeWicketsLostI1: '',
      AwayWicketsLostI1: '',
      HomeRunsI2: '',
      AwayRunsI2: '',
      HomeWicketsLostI2: '',
      AwayWicketsLostI2: '',
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
    // send req to update results
    updateResults() {
      this.errorMessage = '';
      if (this.validResults()) {
        const body = {
          FixtureID: this.results.FixtureID,
          HomeRunsI1: this.results.HomeRunsI1,
          AwayRunsI1: this.results.AwayRunsI1,
          HomeWicketsLostI1: this.results.HomeWicketsLostI1,
          AwayWicketsLostI1: this.results.AwayWicketsLostI1,
          HomeRunsI2: this.results.HomeRunsI2,
          AwayRunsI2: this.results.AwayRunsI2,
          HomeWicketsLostI2: this.results.HomeWicketsLostI2,
          AwayWicketsLostI2: this.results.AwayWicketsLostI2,
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
    // check results are valid
    validResults() {
      const result = joi.validate(this.results, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('HomeRunsI1')) {
        this.errorMessage = "Home team's runs for the first innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayRunsI1')) {
        this.errorMessage = "Away team's runs for the first innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomeWicketsLostI1')) {
        this.errorMessage = "Home team's wickets for the second innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayWicketsLostI1')) {
        this.errorMessage = "Away team's wickets for the second innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomeRunsI2')) {
        this.errorMessage = "Home team's runs for the first innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayRunsI2')) {
        this.errorMessage = "Away team's runs for the first inning is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomeWicketsLostI2')) {
        this.errorMessage = "Home team's wickets for the second innings is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayWicketsLostI2')) {
        this.errorMessage = "Away team's wickets for the second innings is invalid, can only contain numbers.";
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

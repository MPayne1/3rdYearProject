<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Results</h1>
    <div class="text-center">
      <p>Enter in the results for the match, take care as these can't be changed once they're uploaded.
        <br>
        <small>For any sets you didn't play enter the score as 0.</small>
      </p>
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
        <h5>First Set</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredS1">Home Team 1st Set</label>
          <input v-model="results.HomePointsScoredS1" type="text" class="form-control" id="HomePointsScoredS1"
            placeholder="Home team score for the 1st set." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredS1">Away Team 1st Set</label>
          <input v-model="results.AwayPointsScoredS1" type="text" class="form-control" id="AwayPointsScoredS1"
            placeholder="Away team score for the 1st set." required>
        </div>
      </div>
      <hr class="my-4">
      <div class="text-center">
        <h5>Second Set</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredS2">Home Team 2nd Set</label>
          <input v-model="results.HomePointsScoredS2" type="text" class="form-control" id="HomePointsScoredS2"
            placeholder="Home team score for the 2nd set." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredS2">Away Team 2nd Set</label>
          <input v-model="results.AwayPointsScoredS2" type="text" class="form-control" id="AwayPointsScoredS2"
            placeholder="Away team score for the 2nd set." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Third Set</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredS3">Home Team 3rd Set</label>
          <input v-model="results.HomePointsScoredS3" type="text" class="form-control" id="HomePointsScoredS3"
            placeholder="Home team score for the 3rd set." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredS3">Away Team 3rd Set</label>
          <input v-model="results.AwayPointsScoredS3" type="text" class="form-control" id="AwayPointsScoredS3"
            placeholder="Away team score for the 3rd set." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Fourth Set</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredS4">Home Team 4th Set</label>
          <input v-model="results.HomePointsScoredS4" type="text" class="form-control" id="HomePointsScoredS4"
            placeholder="Home team score for the 4th set." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredS4">Away Team 4th Set</label>
          <input v-model="results.AwayPointsScoredS4" type="text" class="form-control" id="AwayPointsScoredS4"
            placeholder="Away team score for the 4th set." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Fifth Set</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredS5">Home Team 5th Set</label>
          <input v-model="results.HomePointsScoredS5" type="text" class="form-control" id="HomePointsScoredS5"
            placeholder="Home team score for the 5th set." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredS5">Away Team 5th Set</label>
          <input v-model="results.AwayPointsScoredS5" type="text" class="form-control" id="AwayPointsScoredS5"
            placeholder="Away team score for the 5th set." required>
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

const RESULTS_URL = 'https://localhost:3000/league/results/update/tennis';

// schema for inserting tennis results
const schema = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredS1: joi.number().min(0).max(7).required(),
  AwayPointsScoredS1: joi.number().min(0).max(7).required(),
  HomePointsScoredS2: joi.number().min(0).max(7).required(),
  AwayPointsScoredS2: joi.number().min(0).max(7).required(),
  HomePointsScoredS3: joi.number().min(0).required(),
  AwayPointsScoredS3: joi.number().min(0).required(),
  HomePointsScoredS4: joi.number().min(0).max(7).required(),
  AwayPointsScoredS4: joi.number().min(0).max(7).required(),
  HomePointsScoredS5: joi.number().min(0).required(),
  AwayPointsScoredS5: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,300}$/).required(),
});

export default {
  data: () => ({
    updatingResults: false,
    errorMessage: '',
    results: {
      FixtureID: '',
      HomePointsScoredS1: '',
      AwayPointsScoredS1: '',
      HomePointsScoredS2: '',
      AwayPointsScoredS2: '',
      HomePointsScoredS3: '',
      AwayPointsScoredS3: '',
      HomePointsScoredS4: '',
      AwayPointsScoredS4: '',
      HomePointsScoredS5: '',
      AwayPointsScoredS5: '',
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
          HomePointsScoredS1: this.results.HomePointsScoredS1,
          AwayPointsScoredS1: this.results.AwayPointsScoredS1,
          HomePointsScoredS2: this.results.HomePointsScoredS2,
          AwayPointsScoredS2: this.results.AwayPointsScoredS2,
          HomePointsScoredS3: this.results.HomePointsScoredS3,
          AwayPointsScoredS3: this.results.AwayPointsScoredS3,
          HomePointsScoredS4: this.results.HomePointsScoredS4,
          AwayPointsScoredS4: this.results.AwayPointsScoredS4,
          HomePointsScoredS5: this.results.HomePointsScoredS5,
          AwayPointsScoredS5: this.results.AwayPointsScoredS5,
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
      if (result.error.message.includes('HomePointsScoredS1')) {
        this.errorMessage = "Home team's score for the first set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredS2')) {
        this.errorMessage = "Home team's score for the second set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredS3')) {
        this.errorMessage = "Home team's score for the third set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredS4')) {
        this.errorMessage = "Home team's score for the fourth set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredS5')) {
        this.errorMessage = "Home team's score for the fifth set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredS1')) {
        this.errorMessage = "Away team's score for the first set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredS2')) {
        this.errorMessage = "Away team's score for the second set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredS3')) {
        this.errorMessage = "Away team's score for the third set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredS4')) {
        this.errorMessage = "Away team's score for the fourth set is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredS5')) {
        this.errorMessage = "Away team's score for the fifth set is invalid, can only contain numbers.";
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

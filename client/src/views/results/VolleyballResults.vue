<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Results</h1>
    <div class="text-center">
      <p>Enter in the results for the match, take care as these can't be changed once they're uploaded.
        <br>
        <small>For any games you didn't play enter the scores as 0.</small>
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
        <h5>First Game</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredG1">Home Team 1st Game</label>
          <input v-model="results.HomePointsScoredG1" type="text" class="form-control" id="HomePointsScoredG1"
            placeholder="Home team score for the 1st game." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredG1">Away Team 1st Game</label>
          <input v-model="results.AwayPointsScoredG1" type="text" class="form-control" id="AwayPointsScoredG1"
            placeholder="Away team score for the 1st game." required>
        </div>
      </div>
      <hr class="my-4">
      <div class="text-center">
        <h5>Second Game</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredG2">Home Team 2nd Game</label>
          <input v-model="results.HomePointsScoredG2" type="text" class="form-control" id="HomePointsScoredG2"
            placeholder="Home team score for the 2nd game." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredG2">Away Team 2nd Game</label>
          <input v-model="results.AwayPointsScoredG2" type="text" class="form-control" id="AwayPointsScoredG2"
            placeholder="Away team score for the 2nd game." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Third Game</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredG3">Home Team 3rd Game</label>
          <input v-model="results.HomePointsScoredG3" type="text" class="form-control" id="HomePointsScoredG3"
            placeholder="Home team score for the 3rd game." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredG3">Away Team 3rd Game</label>
          <input v-model="results.AwayPointsScoredG3" type="text" class="form-control" id="AwayPointsScoredG3"
            placeholder="Away team score for the 3rd game." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Fourth Game</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredG4">Home Team 4th Game</label>
          <input v-model="results.HomePointsScoredG4" type="text" class="form-control" id="HomePointsScoredG4"
            placeholder="Home team score for the 4th game." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredG4">Away Team 4th Game</label>
          <input v-model="results.AwayPointsScoredG4" type="text" class="form-control" id="AwayPointsScoredG4"
            placeholder="Away team score for the 4th game." required>
        </div>
      </div>

      <hr class="my-4">
      <div class="text-center">
        <h5>Fifth Game</h5>
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-1">

        </div>
        <div class="form-group col-md-4">
          <label for="HomePointsScoredG5">Home Team 5th Game</label>
          <input v-model="results.HomePointsScoredG5" type="text" class="form-control" id="HomePointsScoredG5"
            placeholder="Home team score for the 5th game." required>
        </div>
        <div class="form-group col-md-2">

        </div>
        <div class="form-group col-md-4">
          <label for="AwayPointsScoredG5">Away Team 5th Game</label>
          <input v-model="results.AwayPointsScoredG5" type="text" class="form-control" id="AwayPointsScoredG5"
            placeholder="Away team score for the 5th game." required>
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

const RESULTS_URL = 'https://localhost:3000/league/results/update/volleyball';

// schema for inserting tennis results
const schema = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredG1: joi.number().min(0).required(),
  AwayPointsScoredG1: joi.number().min(0).required(),
  HomePointsScoredG2: joi.number().min(0).required(),
  AwayPointsScoredG2: joi.number().min(0).required(),
  HomePointsScoredG3: joi.number().min(0).required(),
  AwayPointsScoredG3: joi.number().min(0).required(),
  HomePointsScoredG4: joi.number().min(0).required(),
  AwayPointsScoredG4: joi.number().min(0).required(),
  HomePointsScoredG5: joi.number().min(0).required(),
  AwayPointsScoredG5: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,300}$/).required(),
});

export default {
  data: () => ({
    updatingResults: false,
    errorMessage: '',
    results: {
      FixtureID: '',
      HomePointsScoredG1: '',
      AwayPointsScoredG1: '',
      HomePointsScoredG2: '',
      AwayPointsScoredG2: '',
      HomePointsScoredG3: '',
      AwayPointsScoredG3: '',
      HomePointsScoredG4: '',
      AwayPointsScoredG4: '',
      HomePointsScoredG5: '',
      AwayPointsScoredG5: '',
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
          HomePointsScoredG1: this.results.HomePointsScoredG1,
          AwayPointsScoredG1: this.results.AwayPointsScoredG1,
          HomePointsScoredG2: this.results.HomePointsScoredG2,
          AwayPointsScoredG2: this.results.AwayPointsScoredG2,
          HomePointsScoredG3: this.results.HomePointsScoredG3,
          AwayPointsScoredG3: this.results.AwayPointsScoredG3,
          HomePointsScoredG4: this.results.HomePointsScoredG4,
          AwayPointsScoredG4: this.results.AwayPointsScoredG4,
          HomePointsScoredG5: this.results.HomePointsScoredG5,
          AwayPointsScoredG5: this.results.AwayPointsScoredG5,
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
      if (result.error.message.includes('HomePointsScoredG1')) {
        this.errorMessage = "Home team's score for the first game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredG2')) {
        this.errorMessage = "Home team's score for the second game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredG3')) {
        this.errorMessage = "Home team's score for the third game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredG4')) {
        this.errorMessage = "Home team's score for the fourth game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('HomePointsScoredG5')) {
        this.errorMessage = "Home team's score for the fifth game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredG1')) {
        this.errorMessage = "Away team's score for the first game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredG2')) {
        this.errorMessage = "Away team's score for the second game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredG3')) {
        this.errorMessage = "Away team's score for the third game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredG4')) {
        this.errorMessage = "Away team's score for the fourth game is invalid, can only contain numbers.";
      }
      if (result.error.message.includes('AwayPointsScoredG5')) {
        this.errorMessage = "Away team's score for the fifth game is invalid, can only contain numbers.";
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

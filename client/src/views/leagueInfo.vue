<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>{{this.leagueName}}</h2>
    </div>
    <div class="text-center row">
      <div class="col-md-8 jumbotron">
        <h4>show table here</h4>
      </div>

      <div class="col-md-4">
        <div class="card text-white bg-secondary">
          <div class="card-header"><h4>Upcoming Fixtures</h4></div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between
              align-items-center card-body" v-for="fixture in fixtures">
              <a>{{ fixture.HomeTeam }} vs {{ fixture.AwayTeam}}</a>
            </li>
          </ul>
          <div class="card-footer" v-if="fixtures[0] == null">
            <div class="form-group">
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{errorMessage}}
              </div>
                <h5>No upcoming fixtures</h5>
              <button @click="startSeason()" class="btn btn-primary btn-lg"
                type="submit">Start a new Season</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
const API_URL = 'http://localhost:3000/';
const START_SEASON_URL = 'http://localhost:3000/league/startSeason';
const LEAGUEID_URL = 'http://localhost:3000/league/leagueID';

export default {
  data: () => ({
    fixtures: [],
    user: {},
    leagueName: '',
    leagueID: '',
  }),
  mounted() {
    // get the leagueName query
    if (this.$route.query.leagueName) {
      this.leagueName = this.$route.query.leagueName;
      // console.log(this.leagueName);
    } else {
      this.$router.push('/dashboard/');
    }
    // set the authorization header
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => res.json())
      .then((result) => {
        // if there's no user object in the response then remove the token
        if (result.user) {
          this.user = result.user;
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
      var leagueName ={
        leagueName: this.leagueName,
      }
      // get the leagueID
      fetch(LEAGUEID_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueName),
      }).then(res => res.json())
        .then((result) => {
          if(result){
            this.leagueID = result.result[0].leagueID;
          }
        });

  },
  methods: {
    // start a new season
    startSeason() {
      var leagueID = {
        leagueID: this.leagueID,
      }
      fetch(START_SEASON_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(leagueID)
      }).then(res => res.json())
        .then((result) => {
          if(result){
            console.log(result);
          }
        });
    },
  },
};
</script>

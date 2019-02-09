<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>TeamInfo</h2>
      <h4>{{teamName}}</h4>
    </div>

    <div class="card text-white bg-secondary border-secondary mb-3" style="max-width: 20rem;">
      <div id="playerList" class="card-header"><h4>Players</h4></div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-center card-body" v-for="player in players">
          <router-link :to="{ name: 'playerInfo', params: {} }">
            {{ player.username }}</router-link>
        </li>
      </ul>
      <div class="card-footer">
        <form  @submit.prevent="addPlayer()">
        <div class="form-group">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
          </div>
          <label for="username">Player's Username</label>
          <input v-model="username" type="text" class="form-control"
            id="username" placeholder="Username" required>
            <br>
          <button @click="addPlayer()" class="btn btn-primary btn-lg"
            type="submit">Add a player</button>
        </div>
      </form>
      </div>
    </div>

  </div>

</template>

<script>
import joi from 'joi';

const API_URL = 'https://localhost:3000/';
const PLAYERS_URL = 'https://localhost:3000/team/allplayers';
const TEAMID_URL = 'https://localhost:3000/team/teamID';
const ADDPLAYER_URL = 'https://localhost:3000/team/addPlayer';

const addPlayerSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20)
    .required(),
  teamID: joi.number().positive().required(),
});

export default {
  data: () => ({
    user: {},
    players: [],
    teamName: '',
    username: '',
    errorMessage: '',
    teamID: '',
  }),
  watch: {
    username: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
    teamID: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
    teamName: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  mounted() {
    // get the teamName query
    if (this.$route.query.teamName) {
      this.teamName = this.$route.query.teamName;
    } else {
      this.$router.push('/dashboard/');
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
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
    const teamName = {
      teamName: this.teamName,
    };
    // get the teamID
    fetch(TEAMID_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify(teamName),
    }).then(res => res.json())
      .then((result) => {
        if (result) {
          this.teamID = result.result[0].teamID;
          console.log(this.teamID);
        }
      });

    // get the players in the team
    this.playerList();
  },
  methods: {
    playerList() {
      if (this.teamName) {
        const body = {
          teamName: this.teamName,
        };
        fetch(PLAYERS_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`,
          },
        }).then(res => res.json())
          .then((result) => {
            if (result) {
              this.players = result.result;
            }
          });
      }
    },
    addPlayer() {
      this.errorMessage = '';
      const body = {
        username: this.username,
        teamID: this.teamID,
      };
      if (this.validAddPlayer(body)) {
        // send the request to the backend
        this.adding = true;
        fetch(ADDPLAYER_URL, {
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
        }).then(() => { // if no errors refresh players list
          this.playerList();
        }).catch((error) => { // if any errors catch them any display error message
          this.errorMessage = error.message;
        });
      }
    },
    validAddPlayer(body) {
      const result = joi.validate(body, addPlayerSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid username';
      }
      if (result.error.message.includes('teamID')) {
        this.errorMessage = 'Invlaid team, please go back to previous page';
      }
      return false;
    },
  },
};
</script>

<style>
  #playerList {
    background-color: #2C3E50
  }
</style>

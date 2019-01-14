<template>
  <div class="home">
    <div class="jumbotron">
      <div class="text-center">
        <h1>Add a player</h1>
        <p>Enter the player's username, to add them to {{this.teamName}}.</p>
      </div>
      <div v-if="adding" class="text-center">
        <img src="../assets/loading_ring.svg"/>
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{errorMessage}}
      </div>
      <form v-if="!adding" @submit.prevent="addPlayer()">
            <div class="form-group">
              <label for="username">Player's Username</label>
              <input v-model="username" type="text" class="form-control"
                id="username" placeholder="Username" required>
            </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-lg">Add Player</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import joi from 'joi';
const API_URL = 'http://localhost:3000/';
const ADDPLAYER_URL = 'http://localhost:3000/team/addPlayer';
const TEAMID_URL = 'http://localhost:3000/team/teamID';

const addPlayerSchema = joi.object().keys({
  user: joi.number().positive().required(),
  username: joi.string().alphanum().min(2).max(20)
    .required(),
  teamID: joi.number().positive().required(),
});
export default {
  data: () => ({
    userData: {},
    adding: false,
    errorMessage: '',
    user: '',
    username: '',
    teamID: '',
    teamName: '',
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
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
    if(this.$route.query.teamName) {
      this.teamName = this.$route.query.teamName;
    } else{
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
          this.userData = result.user;
          this.user = result.user.UserID;
          console.log(this.user);

        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
      var teamName = {
        teamName: this.teamName,
      };
    fetch(TEAMID_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify(teamName),
    }).then(res => res.json())
      .then((result) => {
        if(result){
          this.teamID = result.result[0].teamID;
          console.log(this.teamID);
        }
      });
  },
  methods: {
    addPlayer() {
        this.errorMessage = '';
        const body = {
          user: this.user,
          username: this.username,
          teamID: this.teamID,
        };
        console.log(body);
        if(this.validAddPlayer(body)) {

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
          }).then(() => { // if no errors redirect to dashboard
            setTimeout(() => { // wait so loading icon is shown, improves ui
              this.adding = false;
              this.$router.push({ path: '/team/info/', query:{teamName: this.teamName}});
            }, 700);
          }).catch((error) => { // if any errors catch them any display error message
            this.adding = false;
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
      if(result.error.message.includes('teamID')) {
        this.errorMessage = 'Invlaid team, please go back to previous page';
      }
      return false;
    },
  },
};
</script>

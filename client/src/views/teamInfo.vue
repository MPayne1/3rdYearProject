<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>TeamInfo</h2>
      <h4>{{teamName}}</h4>
    </div>

    <div class="card text-white bg-secondary mb-3" style="max-width: 20rem;">
      <div class="card-header">Players</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-center card-body" v-for="player in players">
          <router-link :to="{ name: 'playerInfo', params: {} }">
            {{ player.username }}</router-link>
        </li>
      </ul>
      <div class="card-footer">
        <button @click="AddPlayer()" class="btn btn-primary btn-lg"
          type="submit">Add a player</button>
      </div>
    </div>

  </div>

</template>

<script>
const API_URL = 'http://localhost:3000/';
const PLAYERS_URL = 'http://localhost:3000/team/allplayers';
export default {
  data: () => ({
    user: {},
    players: [],
    teamName: '',
  }),
  mounted() {
    // get the teamName query
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
          this.user = result.user;
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });

    // get the players in the team
    if(this.teamName) {
      const body = {
        teamName: this.teamName,
      }
      fetch(PLAYERS_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
      .then((result) => {
        if(result) {
          this.players = result.result;
          console.log(this.players);
        }
      })
  }
  },
  methods: {
    AddPlayer() {
      if(this.teamName) {
          this.$router.push({ path: '/team/addPlayer/', query:{teamName: this.teamName}});
      }
    },
  },
};
</script>

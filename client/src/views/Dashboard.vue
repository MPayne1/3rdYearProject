<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Dashboard</h1>
      <h1 class="display-3">Hello {{user.username}}</h1>
      <button v-if="loggedIn" @click="logout()" class="btn btn-primary btn-lg"
        type="submit">Logout</button>

      <button v-if="!loggedIn" @click="login()" class="btn btn-primary btn-lg"
        type="submit">Login</button>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/';
export default {
  data: () => ({
    user: {},
    loggedIn: false,
  }),
  mounted() {
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
          this.loggedIn = true;
          console.log(result);
        } else {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/auth/login');
    },
    login() {
      localStorage.removeItem('token');
      this.$router.push('/auth/login');
    }
  },
};
</script>

<style>
button {
  margin-left: 10px;
}

</style>

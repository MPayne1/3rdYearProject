<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>Player Info</h2>
      <h4>{{username}}</h4>
    </div>

  </div>
</template>

<script>
  import joi from 'joi';

  const API_URL = 'https://localhost:3000/';

  export default {
    data: () => ({
      user: {},
      username: '',
      errorMessage: '',
    }),
    watch: {
      username: {
        handler() {
          this.errorMessage = '';
        },
        deep: true,
      },
    },
    mounted() {
      // get the username
      if (this.$route.params.username) {
        this.username = this.$route.params.username;
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
    },
    methods: {

    }
  }
</script>

<style>
</style>

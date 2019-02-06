<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>{{this.leagueName}}</h2>
    </div>
    <div class="text-center row">
      <div class="col-md-6 jumbotron">
        <h4>show table here</h4>
      </div>

      <div class="col-md-4">
        <h4>show upcoming fixtures here</h4>
      </div>
    </div>
  </div>

</template>

<script>
const API_URL = 'http://localhost:3000/';
export default {
  data: () => ({
    user: {},
    leagueName: '',
  }),
  mounted() {
    // get the leagueName query
    if (this.$route.query.leagueName) {
      this.leagueName = this.$route.query.leagueName;
      console.log(this.leagueName);
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
  },
  methods: {
  },
};
</script>

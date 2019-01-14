<template>
  <div class="jumbotron">
    <h2>TeamInfo</h2>
    <h4>{{teamName}}</h4>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/';
export default {
  data: () => ({
    user: {},
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
  },
  methods: {
  },
};
</script>

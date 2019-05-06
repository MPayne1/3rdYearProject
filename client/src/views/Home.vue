<template>
  <div class="home">
    <div class="jumbotron">
      <div class="text-center">
        <h1 class="display-3">SportsBook</h1>
        <p class="lead">SportsBook is an easy to use web application to
          manage your amateur sports team.</p>
      </div>
      <div class="text-center">

      </div>
      <h5>You can:</h5>
      <ul>
        <li>Create a team/league for a range of sports</li>
        <li>Automatically generate fixtures</li>
        <li>Easily record match results</li>
        <li>Automatically update the league table</li>
        <li>Receive important email updates</li>
      </ul>
      <hr class="my-4">
      <div class="text-center">
        <h5>Sign up and start today!</h5>
        <p class="lead">
          <router-link id="signupBtn" class="btn btn-primary btn-lg" :to="{name: 'signup'}"
            role="button">Sign Up</router-link>
          <router-link id="loginBtn" class="btn btn-primary btn-lg" :to="{name: 'login'}"
            role="button">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
  },
};
</script>

<style>
  #signupBtn, #loginBtn {
    margin: 5px;
  }
</style>

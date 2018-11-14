<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">SportsBook</h1>
      <p class="lead">SportsBook is an easy to use web application to
        manage your amateur sports team.</p>
      <hr class="my-4">
      <p>Sign up and start today!</p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg" :to="{name: 'signup'}"
          role="button">Sign Up</router-link>
      </p>
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

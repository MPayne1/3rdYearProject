
<template>
  <div id="app">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand" :to="{name: 'home'}">SportsBook</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarColor01" aria-controls="navbarColor01"
          aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">(current)</span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'dashboard'}">Dashboard</router-link>
          </li>
          <li class="nav-item dropdown show"  :class="{'open': open}">
            <a class="nav-link dropdown-toggle" @click="open = !open"
            role="button" aria-haspopup="true" aria-expanded="false">League</a>
              <div class="dropdown-menu show" v-if="open" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 41px, 0px);">
                  <a class="dropdown-item" href="#/league/find" @click="open = !open">Find a league to join</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#/league/create" @click="open = !open">Create League</a>
              </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Teams</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-2" />
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/';
export default {
  data: () => ({
    open: false,
    user: {},
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
          console.log(result);
        } else {
          localStorage.removeItem('token');
        }
      });
  },
};

</script>

<style>

</style>

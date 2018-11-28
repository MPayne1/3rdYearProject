
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
          <li class="nav-item">
                <router-link class="nav-link" :to="{name: 'createLeague'}">
                Leagues</router-link>
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

<style>

</style>

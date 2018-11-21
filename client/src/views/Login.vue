<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Login</h1>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
    <form @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="user.username" type="text" class="form-control" id="username"
          aria-describedby="usernameHelp" placeholder="Enter Username" required>
        <small id="usernameHelp" class="form-text text-muted">
          Enter your username.
        </small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="user.password" type="password" class="form-control"
          id="password" aria-describedby="passswordHelp"
          placeholder="Password" required>
        <small id="passwordHelp" class="form-text text-muted">
          Enter your password
        </small>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Login</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
});
export default {
  data: () => ({
  errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if(this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        

      }
    },
    validUser() {
      const result = joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid Login Attempt';
      }
      if (result.error.message.includes('password')) {
        this.errorMessage = 'Invalid Login Attempt'
      }
      return false;
    },
  },
};
</script>

<style>

</style>

<template>
<div home>
<div class="jumbotron">
  <div v-if="loading" class="text-center">
    <img src="../assets/loading_ring.svg"/>
    <a href="https://loading.io/">powered by loading.io</a>
  </div>
  <div class="text-center">
    <h1>Reset Password</h1>
    <br>
    <h5>Enter in your username and new password.</h5>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <div v-if="successMessage" class="alert alert-success" role="alert">
    {{successMessage}}
  </div>
    <form  @submit.prevent="resetPassword()">
      <br>
      <div class="form-group">
        <input v-model="reset.username" type="text" class="form-control" id="username"
           placeholder="Username" required>
      </div>
      <br>
      <div class="form-group">
        <input v-model="reset.password" type="password" class="form-control"
          placeholder="New Password" required>
      </div>
      <br>
      <div class="form-group">
        <input v-model="reset.confirmPassword" type="password" class="form-control"
          placeholder="Confirm Password" required>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Submit</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const RESET_PASSWORD_URL = 'https://localhost:3000/auth/resetPassword';

const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20)
    .required(),
  password: joi.string().trim().min(8).required(),
  confirmPassword: joi.string().trim().min(8).required(),
  token: joi.required(),
});

export default {
  data: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
    reset: {
      username: '',
      password: '',
      confirmPassword: '',
      token: '',
    },
  }),
  watch: {
    reset: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  mounted() {
    // get the username
    if (this.$route.params.token) {
      this.reset.token = this.$route.params.token;
      console.log(this.reset.token);
    } else {
      this.$router.push('/dashboard/');
    }
  },
  methods: {
    // send req to reset password
    resetPassword() {
      this.errorMessage = '';
      if (this.validPassword()) {
        const body = {
          username: this.reset.username,
          password: this.reset.password,
          resetToken: this.reset.token,
        };
        this.loading = true;
        fetch(RESET_PASSWORD_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((response) => response.json())
        .then(res => {
          if (res.message) {
            this.successMessage = res.message;
            console.log(res);

          }
          if(res.error) {
            this.errorMessage = res.error;
          }
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.loading = false;
            this.$router.push('/dashboard');
          }, 700);
        }).catch((error) => { // if any errors catch them any display error message
          this.loggingIn = false;
          this.errorMessage = error.message;
        });
      }
    },
    // check details are valid
    validPassword() {
      if (this.reset.password !== this.reset.confirmPassword) {
        this.errorMessage = 'Passwords must match';
        return false;
      }
      const result = joi.validate(this.forgotPassword, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid username';
      }
      if (result.error.message.includes('password')) {
        this.errorMessage = 'Invalid password, must be at least 8 characters';
      }
      return false;
    },
  },
};
</script>

<style>

</style>

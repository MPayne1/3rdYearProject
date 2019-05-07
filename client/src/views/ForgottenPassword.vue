<template>
<div home>
<div class="jumbotron">
  <div v-if="loading" class="text-center">
    <img src="../assets/loading_ring.svg"/>
    <a href="https://loading.io/">powered by loading.io</a>
  </div>
  <div class="text-center">
    <h1>Forgotten Password</h1>
    <br>
    <h5>Enter in your username and email address and an email will be sent so you can reset your password.</h5>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <div v-if="successMessage" class="alert alert-success" role="alert">
    {{successMessage}}
  </div>
    <form  @submit.prevent="forgottenPassword()">
      <br>
      <div class="form-group">
        <input v-model="forgotPassword.username" type="text" class="form-control" id="username"
           placeholder="Username" required>
      </div>
      <br>
      <div class="form-group">
        <input v-model="forgotPassword.email" type="text" class="form-control"
          placeholder="Email" required>
      </div>
      <br>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg">Submit</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import joi from 'joi';

const FORGOTTEN_PASSWORD_URL = 'https://localhost:3000/auth/forgottenPassword';

const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20)
    .required(),
  email: joi.string().email({minDomainAtoms: 2 }).required(),
});

export default {
  data: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
    forgotPassword: {
      username: '',
      email: '',
    },
  }),
  watch: {
    forgotPassword: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    forgottenPassword() {
      this.errorMessage = '';
      if (this.validPassword()) {
        const body = {
          username: this.forgotPassword.username,
          email: this.forgotPassword.email,
        };
        this.loading = true;
        fetch(FORGOTTEN_PASSWORD_URL, {
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
    validPassword() {
      const result = joi.validate(this.forgotPassword, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid username';
      }
      if (result.error.message.includes('email')) {
        this.errorMessage = 'Invalid email Address';
      }
      return false;
    },
  },
};
</script>

<style>

</style>

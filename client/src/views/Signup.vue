<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Sign Up</h1>
  </div>
  <div v-if="signingUp" class="text-center">
    <img src="../assets/loading_ring.svg"/>
    <a href="https://loading.io/">powered by loading.io</a>
  </div>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{errorMessage}}
  </div>
  <form v-if="!signingUp" @submit.prevent="signup">
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="user.email" type="email" class="form-control" id="email"
      placeholder="Email" required>
    </div>
    <br>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="FirstName">First name</label>
        <input v-model="user.FirstName" type="text" class="form-control"
          id="FirstName" placeholder="First name" required>
      </div>
      <div class="form-group col-md-6">
        <label for="LastName">Last name</label>
        <input v-model="user.LastName" type="text"
          class="form-control" id="LastName"
          placeholder="Last name" required>
      </div>
    </div>
    <br>
    <div class="form-row">
      <div class="form-group col-md-12">
        <label for="Bio">Bio, a short description about yourself.</label>
        <textarea v-model="user.Bio" type="email" class="form-control" id="Bio"
        placeholder="A short description about yourself." required></textarea>
      </div>
    </div>
    <br>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="phoneNumber">Phone number</label>
        <input v-model="user.phoneNumber" type="text" class="form-control"
          placeholder="Phone Number" id="phoneNumber" required>
      </div>
    </div>
    <br>
    <div class="form-group">
      <label for="username">Username</label>
      <input v-model="user.username" type="text" class="form-control" id="username"
        aria-describedby="usernameHelp" placeholder="Enter Username" required>
      <small id="usernameHelp" class="form-text text-muted">
        Username must be between 2 and 20 characters.
      </small>
    </div>
    <br>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="password">Password</label>
        <input v-model="user.password" type="password" class="form-control"
          id="password" aria-describedby="passswordHelp"
          placeholder="Password" required>
        <small id="passwordHelp" class="form-text text-muted">
          Password must be at least 8 characters.
        </small>
      </div>
      <div class="form-group col-md-6">
        <label for="confirmPassword">Confirm Password</label>
        <input v-model="user.confirmPassword" type="password"
          class="form-control" id="confirmPassword"
          placeholder="Confirm Password" required>
      </div>
    </div>
    <br>
    <div class="form-row">
      <div class="form-group col-md-6">
        <div class="custom-control custom-switch">
          <label for="toggleSwitch">Do you want other users to be able to see your email, phone number, name and bio?</label>
         <input type="checkbox" v-model="user.publiclyShow"class="custom-control-input"  id="toggleSwitch" checked="">
         <label class="custom-control-label" for="toggleSwitch">Show your profile information publicly</label>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-primary btn-lg">Sign Up</button>
    </div>
  </form>
</div>
</div>
</template>


<script>
import joi from 'joi';

const SIGNUP_URL = 'https://localhost:3000/auth/signup';

const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20)
    .required(),
  password: joi.string().trim().min(8).required(),
  confirmPassword: joi.string().trim().min(8).required(),
  email: joi.string().email({ minDomainAtoms: 2 }).required(),
  FirstName: joi.string().alphanum().min(2).max(30)
    .required(),
  LastName: joi.string().alphanum().min(2).max(30)
    .required(),
  phoneNumber: joi.string().regex(/^[0-9]{3,15}$/).required(),
  Bio: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,200}$/).required(),
  publiclyShow: joi.required()
});

export default {
  data: () => ({
    signingUp: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
      LastName: '',
      FirstName: '',
      email: '',
      Bio: '',
      phoneNumber: '',
      publiclyShow: true,
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    // send req to signup new user
    signup() {
      var show = '';
      if(this.user.publiclyShow == false) {
        show = 'False';
      } else {
        show = 'True';
      }
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
          LastName: this.user.LastName,
          FirstName: this.user.FirstName,
          email: this.user.email,
          Bio: this.user.Bio,
          phoneNumber: this.user.phoneNumber,
          publiclyShow: show
        };
        // send the request to the backend
        this.signingUp = true;
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          // handle any errors the server returns
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then(() => { // if no errors redirect to login page
          setTimeout(() => { // wait so loading icon is shown, improves ui
            this.signingUp = false;
            this.$router.push('/auth/login');
          }, 700);
        }).catch((error) => { // if any errors catch them any display error message
          this.signingUp = false;
          this.errorMessage = error.message;
        });
      }
    },
    // check signup info is valid
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match';
        return false;
      }
      const result = joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid, must be at least 2 characters and not include any symbols';
      }
      if (result.error.message.includes('email')) {
        this.errorMessage = 'Email is invalid, please enter a valid email address';
      }
      if (result.error.message.includes('FirstName') || result.error.message.includes('LastName')) {
        this.errorMessage = 'Names can only contain letters.';
      }
      if(result.error.message.includes('Bio')) {
        this.errorMessage = 'Bio must be shorter than 200 characters';
      }
      if(result.error.message.includes('phoneNumber')) {
        this.errorMessage = 'Phone number can only contain letters and must be 3-15 diigits';
      }
      if(result.error.message.includes('password')){
        this.errorMessage = 'Password is invalid, must be at least 8 characters';
      }
      return false;
    },
  },
};
</script>
<style>
</style>

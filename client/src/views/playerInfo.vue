<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h2>Player Info</h2>
      <h4>{{username}}</h4>
    </div>



    <div class="text-center row">
      <div v-if="showSettings" class="col-md-4">
        <div id="settingsCard" class="card">
          <div class="text-white card-header bg-primary"><h4>Settings</h4></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div  id="settingsItem" class="align-items-center">
                  <h5 @click="emailOpen = !emailOpen">Change Email</h5>
                  <div v-if="emailOpen"class="">
                    <form  @submit.prevent="changeEmail()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <input v-model="email.username" type="text" class="form-control"
                        placeholder="Username" required>
                      <br>
                      <input v-model="email.email" type="text" class="form-control"
                        placeholder="New Email address" required>
                      <br>
                      <input v-model="email.password" type="password" class="form-control"
                        placeholder="Password" required>
                      <br>
                      <button @click="changeEmail()" class="btn btn-primary btn-lg"
                        type="submit">Change Email</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div id="settingsItem" class="align-items-center">
                  <h5 @click="passwordOpen = !passwordOpen">Change Password</h5>
                  <div v-if="passwordOpen"class="">
                    <form  @submit.prevent="changePassword()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <input v-model="newPassword.username" type="text" class="form-control"
                        placeholder="Username" required>
                      <br>
                      <input v-model="newPassword.password" type="password" class="form-control"
                        placeholder="Current Password" required>
                      <br>
                      <input v-model="newPassword.newpassword" type="password" class="form-control"
                        placeholder="New Password" required>
                      <br>
                      <input v-model="newPassword.confirmPassword" type="password" class="form-control"
                        placeholder="Confirm New Password" required>
                      <br>
                      <button @click="changePassword()" class="btn btn-primary btn-lg"
                        type="submit">Change Password</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>
            </ul>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
  import joi from 'joi';

  const API_URL = 'https://localhost:3000/';
  const CHANGE_EMAIL_URL = 'https://localhost:3000/auth/changeEmail';
  const CHANGE_PASSWORD_URL = 'https://localhost:3000/auth/changePassword';

  const changeEmailSchema = joi.object().keys({
    username: joi.string().alphanum().min(2).max(20)
      .required(),
    password: joi.string().trim().min(8).required(),
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
  });

  const changePasswordSchema = joi.object().keys({
    username: joi.string().alphanum().min(2).max(20).required(),
    password: joi.string().trim().min(8).required(),
    newpassword: joi.string().trim().min(8).required(),
    confirmPassword: joi.string().trim().min(8).required(),
  });

  export default {
    data: () => ({
      user: {},
      email: {
        email: '',
        username: '',
        password: '',
      },
      newPassword: {
        username: '',
        newpassword: '',
        confirmPassword:'',
        password: '',
      },
      username: '',
      errorMessage: '',
      successMessage: '',
      showSettings: false,
      emailOpen: false,
      passwordOpen: false,
    }),
    watch: {
      email: {
        handler() {
          this.errorMessage = '';
        },
        deep: true,
      },
    },
    mounted() {
      // get the username
      if (this.$route.params.username) {
        this.username = this.$route.params.username;
      } else {
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
          if(this.user.username === this.username) {
            this.showSettings = true;
          }
        });
    },
    methods: {
      changeEmail() {
        if (this.validEmail()) {
          const body = {
            username: this.email.username,
            password: this.email.password,
            email: this.email.email,
          };
          // send the request to the backend
          fetch(CHANGE_EMAIL_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${localStorage.token}`,
            },
          }).then(response => response.json())
          .then((res) =>{
            if (res.message) {
              this.successMessage = res.message;
            }
            console.log(res);
            this.email.username = '';
            this.email.email = '';
            this.email.password = '';
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        }
      },

      changePassword() {
        if(this.validPassword()) {
          const body = {
            username: this.newPassword.username,
            password: this.newPassword.password,
            newPassword: this.newPassword.newpassword,
          };
          // send the request to the backend
          fetch(CHANGE_PASSWORD_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${localStorage.token}`,
            },
          }).then(response => response.json())
          .then((res) =>{
            if (res.message) {
              this.successMessage = res.message;
            }
            console.log(res);
            this.newPassword.username = '';
            this.newPassword.password = '';
            this.newPassword.newpassword = '';
            this.newPassword.confirmPassword = '';
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        }
      },

      // check change password info is valid
      validPassword() {
        if (this.newPassword.newpassword !== this.newPassword.confirmPassword) {
          this.errorMessage = 'Passwords must match';
          return false;
        }
        const result = joi.validate(this.newPassword, changePasswordSchema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes('username')) {
          this.errorMessage = 'Username is invalid, must be at least 2 characters and not include any symbols';
        } else {
          this.errorMessage = 'Password is invalid, must be at least 8 characters';
        }
        return false;
      },
      // check change email info is valid
      validEmail() {
        const result = joi.validate(this.email, changeEmailSchema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes('username')) {
          this.errorMessage = 'Username is invalid, must be at least 2 characters and not include any symbols';
        }
        if (result.error.message.includes('email')) {
          this.errorMessage = 'Email is invalid, please enter a valid email address';
        } else {
          this.errorMessage = 'Password is invalid, must be at least 8 characters';
        }
        return false;
      },
    }
  }
</script>

<style>

#settingsItem {
  margin-left: auto;
  margin-right: auto;
}
</style>

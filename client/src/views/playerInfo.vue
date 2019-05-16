<template>
  <div class="home text-center">
    <div class="jumbotron">
      <div class="row" id="imageAndName">
        <div class="crop col-md-12">
        <img style="height: 200px; width:200px" :src="require(`../assets/Profile Pictures/${profile.imagePath}`)" alt="Profile Picture">
        <h2>{{username}}</h2>
        </div>
      </div>
    </div>

    <div v-if="!showInfo" class="alert alert-warning" role="alert">
      <h4>{{username}} has no information to publicly show.</h4>
    </div>

    <div v-if="showInfo" class="text-center row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div id="settingsCard" class="card">
          <div class="text-white card-header bg-primary"><h4>Information</h4></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div  id="settingsItem" class="align-items-center">
                  <h5>Name: {{profile.FirstName}} {{profile.LastName}}</h5>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div  id="settingsItem" class="align-items-center">
                  <h5 @click="bioOpen = !bioOpen, openCloseLi()">Bio: {{profile.Bio}}</h5>
                  <div v-if="bioOpen && showEditOptions == true"class="">
                    <form  @submit.prevent="changeBio()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <br>
                      <input v-model="profile.Bio" type="text" class="form-control"
                        placeholder="New Bio" required>
                      <br>
                      <button @click="changeBio()" class="btn btn-primary btn-lg"
                        type="submit">Change Bio</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div  id="settingsItem" class="align-items-center">
                  <h5 @click="phoneOpen = !phoneOpen, openCloseLi()">Phone No: {{profile.PhoneNumber}}</h5>
                  <div v-if="phoneOpen && showEditOptions == true"class="">
                    <form  @submit.prevent="changePhoneNo()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <br>
                      <input v-model="profile.PhoneNumber" type="text" class="form-control"
                        placeholder="Phone Number" required>
                      <br>
                      <button @click="changePhoneNo()" class="btn btn-primary btn-lg"
                        type="submit">Change Phone No.</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>

              <li class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div  id="settingsItem" class="align-items-center">
                  <h5 @click="emailOpen = !emailOpen, openCloseLi()">Email: {{profile.Email}}</h5>
                  <div v-if="emailOpen && showEditOptions == true"class="">
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
              <li v-if="showEditOptions" class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div id="settingsItem" class="align-items-center">
                  <h5 @click="passwordOpen = !passwordOpen, openCloseLi()">Change Password</h5>
                  <div v-if="passwordOpen && showEditOptions == true" class="">
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
              <li v-if="showEditOptions" class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div id="settingsItem" class="align-items-center">
                  <h5 @click="publiclyShowOpen = !publiclyShowOpen, openCloseLi()">Change Privacy</h5>
                  <div v-if="publiclyShowOpen && showEditOptions == true" class="">
                    <h6>Change if your profile information, name, bio, phone number and email is publicly shown to anyone logged into Sportsbook.</h6>
                    <form  @submit.prevent="changePubliclyShown()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <div class="form-group">
                         <div class="custom-control custom-switch">
                          <input type="checkbox" v-model="profile.publiclyShow"class="custom-control-input"  id="toggleSwitch" checked="">
                          <label class="custom-control-label" for="toggleSwitch">Show your profile information publicly</label>
                         </div>
                       </div>
                      <button class="btn btn-primary btn-lg"
                        type="submit">Change Privacy</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>

              <li v-if="showEditOptions" class="list-group-item d-flex justify-content-between align-items-center card-body">
                <div id="settingsItem" class="align-items-center">
                  <h5 @click="profileImageOpen = !profileImageOpen, openCloseLi()">Change Profile Image</h5>
                  <div v-if="profileImageOpen && showEditOptions == true" class="">
                    <form @submit.prevent="changeProfileImage()">
                    <div class="form-group">
                      <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{errorMessage}}
                      </div>
                      <div v-if="successMessage" class="alert alert-success" role="alert">
                        {{successMessage}}
                      </div>
                      <div class="form-group">
                         <div>
                          <input type="file" name="profileImage" v-on:change="onImageUpload($event.target.name, $event.target.files)"class="form-control-file" accept="">
                          <label for="profileImage">Upload a new Profile Image</label>
                         </div>
                       </div>
                      <button class="btn btn-primary btn-lg"
                        type="submit">Change Profile Image</button>
                    </div>
                  </form>
                  </div>
                </div>
              </li>

            </ul>
        </div>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>

<script>
  import joi from 'joi';

  const API_URL = 'https://localhost:3000/';
  const CHANGE_EMAIL_URL = 'https://localhost:3000/auth/changeEmail';
  const CHANGE_PASSWORD_URL = 'https://localhost:3000/auth/changePassword';
  const VIEW_PROFILE_URL = 'https://localhost:3000/player/profile/view';
  const CHANGE_BIO_URL = 'https://localhost:3000/player/profile/changeInfo/Bio';
  const CHANGE_PHONE_NO_URL = 'https://localhost:3000/player/profile/changeInfo/phoneNumber';
  const CHANGE_PUBLICLY_SHOW_URL = 'https://localhost:3000/player/profile/changeInfo/publiclyShow';
  const CHANGE_PROFILE_IMAGE_URL =  'https://localhost:3000/player/profile/changeInfo/picture';

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

  const viewProfileSchema = joi.object().keys({
    username: joi.string().alphanum().min(2).max(20).required()
  });

  export default {
    data: () => ({
      user: {},
      profile: {},
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
      bioOpen: false,
      phoneOpen: false,
      publiclyShowOpen: false,
      showEditOptions: false,
      showInfo: false,
      profileImageOpen: false,
      newImage: '',
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
        this.getProfileInfo();
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
            this.showEditOptions = true;
          }
        });


    },
    methods: {
      // reset message
      openCloseLi() {
        this.successMessage = '';
      },
      // get the users info
      getProfileInfo() {
          const body = {
            username: this.username,
          };
          fetch(VIEW_PROFILE_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${localStorage.token}`,
            },
          }).then(response => response.json())
          .then((res) =>{
            if (res.message) {
              this.showInfo = false;
            } else{
              this.profile = res[0];
              this.showInfo = true;
            }
            console.log(res);
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
      },
      // check image is correct size and format
      onImageUpload(fileName, file) {
        var imageFile = file[0];
        if(!imageFile.type.match('image.*')) {
          this.errorMessage = "Please upload a jpg, jpeg or png image smaller than 10MB.";
        } else {
          this.newImage = new FormData();
          this.newImage.append('profileImage', imageFile);
          console.log("image selected");
        }
      },
      // send req to change image
      changeProfileImage() {
        if(this.newImage) {
          // send the request to the backend
          fetch(CHANGE_PROFILE_IMAGE_URL, {
            method: 'POST',
            body: this.newImage,
            headers: {
              Authorization: `Bearer ${localStorage.token}`,
            },
          }).then(response => response.json())
          .then((res) =>{
            if (res.message) {
              this.successMessage = res.message;
            }
            if(res.errorMessage) {
              this.errorMessage = res.errorMessage;
            }
            if(res.imagePath) {
              this.profile.imagePath = res.imagePath;
            }
            console.log(res);
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        } else {
          this.errorMessage = "Please upload a jpg, jpeg or png image smaller than 10MB.";
        }
      },
      // send req to change privact details
      changePubliclyShown() {
        var show = '';
        console.log(this.profile.publiclyShow);
        if(this.profile.publiclyShow == false) {
          show = 'False';
        } else {
          show = 'True';
        }
        const body = {
          publiclyShow: show,
        }
        // send the request to the backend
        fetch(CHANGE_PUBLICLY_SHOW_URL, {
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
        }).catch((error) => { // if any errors catch them any display error message
          this.errorMessage = error.message;
        });
      },
      // send req to change phone no.
      changePhoneNo() {
        if(this.profile.PhoneNumber != '') {
          const body = {
            phoneNumber: this.profile.PhoneNumber,
          };
          // send the request to the backend
          fetch(CHANGE_PHONE_NO_URL, {
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
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        }
      },
      // send req to change bio
      changeBio() {
        if(this.profile.Bio != '') {
          const body = {
            Bio: this.profile.Bio,
          };
          // send the request to the backend
          fetch(CHANGE_BIO_URL, {
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
          }).catch((error) => { // if any errors catch them any display error message
            this.errorMessage = error.message;
          });
        }
      },
      // send req to change email
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
      // send req to change password
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

      validProfileInfo() {
        const result = joi.validate(this.username, viewProfileSchema);
        if(result.error === null) {
          return true;
        }
        if(result.error.message.includes('username')){
          this.errorMessage = 'Please refresh the page';
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
#settingsCard {
  margin-bottom: 20px;
}
.crop {
  height: auto;
  width: auto;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
}

.crop img {
  height: auto;
  width: auto;
}

.jumbotron{
  padding: 2rem;
}
</style>

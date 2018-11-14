<template>
<div home>
<div class="jumbotron">
  <h1>Sign Up</h1>
  <form>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username"
        aria-describedby="usernameHelp" placeholder="Enter Username">
      <small id="usernameHelp" class="form-text text-muted">
        Username must be between 2 and 20 characters.
      </small>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password"
        aria-describedby="passswordHelp" placeholder="Password">
      <small id="passwordHelp" class="form-text text-muted">
        Password must be at least 8 characters.
      </small>
    </div>
    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" class="form-control" id="confirmPassword"
        placeholder="Confirm Password">
    </div>
    <button type="submit" class="btn btn-primary">Sign Up</button>
  </form>
</div>
</div>
</template>


<script>
export default {
};
</script>
<style>
</style>

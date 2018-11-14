<template>
<div home>
<div class="jumbotron">
  <div class="text-center">
    <h1>Sign Up</h1>
  </div>
  <form>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username"
        aria-describedby="usernameHelp" placeholder="Enter Username" required>
      <small id="usernameHelp" class="form-text text-muted">
        Username must be between 2 and 20 characters.
      </small>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password"
          aria-describedby="passswordHelp" placeholder="Password" required>
        <small id="passwordHelp" class="form-text text-muted">
          Password must be at least 8 characters.
        </small>
      </div>
      <div class="form-group col-md-6">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" class="form-control" id="confirmPassword"
          placeholder="Confirm Password" required>
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
export default {
};
</script>
<style>
</style>

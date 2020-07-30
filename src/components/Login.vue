<template>
  <b-form @submit.prevent="login" style="margin: 2.2rem">
    <b-form-group>
      <b-form-input
        size="lg"
        style="max-width: 25rem; margin: 0 auto"
        id="username-input"
        placeholder="Enter username..."
        required
        v-model="username"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script>
import { EventBus } from "../main.js";
export default {
  props: ["socket"],
  data() {
    return {
      username: ""
    };
  },
  methods: {
    login() {
      EventBus.$emit("login", this.username);
      this.socket.emit("user-joined", {
        username: this.username
      });
    }
  }
};
</script>

<style>
.login-form {
  margin-top: 2.2rem !important;
  margin-bottom: 2rem !important;
  margin: 0 auto;
}
</style>
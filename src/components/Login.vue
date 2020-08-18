<template>
  <b-form @submit.prevent="authenticateLogin" style="margin: 2.2rem; text-align: center;">
    <b-form-group>
      <b-form-input
        size="lg"
        style="max-width: 25rem; margin: 0 auto"
        id="username-input"
        placeholder="Enter username..."
        required
        v-model="userAccount.username"
      ></b-form-input>
      <b-form-input
        size="lg"
        style="max-width: 25rem; margin-top: 2.2rem; margin-left: auto; margin-right: auto;"
        id="password-input"
        placeholder="Enter password..."
        required
        type="password"
        v-model="userAccount.password"
      ></b-form-input>
      <b-alert
        style="margin: 2.2rem auto; max-width: 25vw; text-align: center;"
        variant="danger"
        :show="failedAuth"
      >{{errMsg}}</b-alert>
      <b-button @click="authenticateLogin" style="margin-top: 1.2rem" variant="primary">Login</b-button>
      <b-button
        @click="createAccount"
        variant="info"
        style="margin-top: 1.2rem; margin-left: 1.2rem"
      >Create Account</b-button>
    </b-form-group>
  </b-form>
</template>

<script>
import { EventBus } from "../main.js";

export default {
  props: ["socket"],
  data() {
    return {
      userAccount: {
        username: "",
        password: "",
      },
      users: [],
      failedAuth: false,
      errMsg: "",
    };
  },
  methods: {
    createAccount() {
      this.socket.emit("create-account", this.userAccount);
    },
    authenticateLogin() {
      this.socket.emit("auth-login", this.userAccount);
    },
    login() {
      EventBus.$emit("login", this.userAccount.username);
      this.socket.emit("user-joined", {
        username: this.userAccount.username,
      });
    },
  },
  created() {
    this.socket.on("send-users", (users) => {
      console.log(users);
      this.users = users;
    });

    this.socket.on("authentication-failed", () => {
      this.failedAuth = true;
      this.errMsg = "Username is already taken...";
    });

    this.socket.on("login-failed", () => {
      this.failedAuth = true;
      this.errMsg = "Username or password is incorrect...";
    });

    this.socket.on("login-success", () => {
      this.login();
    });
  },
};
</script>

<style>
.login-form {
  margin-top: 2.2rem !important;
  margin-bottom: 2rem !important;
  margin: 0 auto;
}
</style>
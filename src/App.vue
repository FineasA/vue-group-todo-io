<template>
  <b-container align-v="end">
    <b-row>
      <b-col cols="12">
        <h1 class="title-text display-4 text-white text-center">group todo</h1>
      </b-col>
    </b-row>
    <b-row v-show="!userSelectedConfig">
      <b-col cols="12">
        <first-time-user></first-time-user>
      </b-col>
    </b-row>
    <b-row v-show="userSelectedConfig" style="justify-content: center">
      <b-col>
        <login v-show="!login" :socket="socket" :userConfigSelection="userConfigSelection"></login>
        <list-display v-show="login" :socket="socket"></list-display>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
//App will be a todo list that will use sockets for group editing and use firebase to save data to database...
import io from "socket.io-client";
import Login from "./components/Login.vue";
import ListDisplay from "./components/ListDisplay.vue";
import FirstTimeUser from "./components/FirstTimeUser.vue";

//import EventBus
import { EventBus } from "./main.js";

export default {
  components: {
    Login,
    ListDisplay,
    FirstTimeUser,
  },
  data() {
    return {
      userSelectedConfig: false,
      login: false,
      socket: io("https://vue-group-todo-io.herokuapp.com/"),
      //if local make sure localhost:3000
      //if not local make sure heroku link https://vue-group-todo-io.herokuapp.com/
      //also makesure its node server.js not nodemon
      userConfigSelection: "",
    };
  },
  created() {
    EventBus.$on("login", () => {
      this.login = true;
    });

    EventBus.$on("user-config-selected", (selection) => {
      this.userConfigSelection = selection;
      this.userSelectedConfig = true;
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");
@import url("https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap");

body {
  background: rgb(196, 32, 32);
  background: radial-gradient(
    circle,
    rgba(196, 32, 32, 0.6192979144782913) 35%,
    rgba(233, 90, 203, 1) 79%
  );
}
.title-text {
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0.5em;
  opacity: 0.65 !important;
  margin: 0 auto;
  margin-top: 1.2em;
}
</style>
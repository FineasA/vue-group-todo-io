<template>
  <b-container align-v="end">
    <b-row>
      <b-col cols="12">
        <h1 class="title-text display-4 text-white text-center">group todo</h1>
      </b-col>
    </b-row>
    <b-row style="justify-content: center">
      <b-col>
        <login v-show="!login" :socket="socket"></login>
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

//import EventBus
import { EventBus } from "./main.js";

export default {
  components: {
    Login,
    ListDisplay,
  },
  data() {
    return {
      login: false,
      socket: io("localhost:8080"),
    };
  },
  created() {
    EventBus.$on("login", () => {
      this.login = true;
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
  opacity: 65%;
  margin: 0 auto;
  margin-top: 1.2em;
}
</style>
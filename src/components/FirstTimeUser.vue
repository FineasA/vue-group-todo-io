<template>
  <b-container class="user-config">
    <b-card
      title="First Time User?"
      style="max-width: 25rem; margin-top: 2.2rem; margin-left: auto; margin-right: auto; text-align: center;"
    >
      <b-button variant="info" @click="userSelection('new-user')">Create Account</b-button>
    </b-card>
    <b-card
      title="Returning User?"
      style="max-width: 25rem; margin-top: 2.2rem; margin-left: auto; margin-right: auto; text-align: center;"
    >
      <b-button variant="primary" @click="userSelection('returning-user')">Login</b-button>
    </b-card>
  </b-container>
</template>

<script>
import { EventBus } from "../main.js";
export default {
  methods: {
    userSelection(selection) {
      EventBus.$emit("user-config-selected", selection);
    },
  },
};
</script>

<style scoped>
.user-config {
  display: flex;
  flex-direction: row;
}
</style>
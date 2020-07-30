<template>
  <b-card
    class="overflow-hidden todo-list-card mb-2 text-center"
    title="what to do?"
    style="max-width: 45rem"
  >
    <hr />
    <b-row>
      <b-col cols="8" align-self="end">
        <b-card-text class="custom-border-card">
          <ul class="todo-list" style="text-align: left">
            <li v-if="todoItems.length === 0">It's empty in here...</li>
            <b-input
              @keyup.enter="confirmEdit(index)"
              v-show="editing"
              v-model="newTask"
              placeholder="Edit task..."
            ></b-input>
            <li
              v-show="!editing"
              @click="editTask(index)"
              v-for="(todo, index) in todoItems"
              :key="index"
            >
              {{todo.todo}}
              <em class="text-muted small mt-3" style="float: right; font-size: 1rem">
                submitted by {{todo.username}}
                <strong>{{new Date() | moment("h:mm a")}}</strong>
              </em>

              <hr />
            </li>
          </ul>
        </b-card-text>
        <b-form @submit.prevent="makeToDo">
          <b-form-group id="input-group">
            <b-form-input
              required
              id="todo-input"
              placeholder="Enter something to do..."
              v-model="user.todo"
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col cols="4" align-self="start">
        <p class="text-muted">Team Members</p>
        <hr />
        <ul>
          <li class="users-list" v-for="(user, index) in users" :key="index">
            <font-awesome-icon color="lime" :icon="['fa', 'plug']" />
            {{' '}}{{user}}
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
//import EventBus
import { EventBus } from "../main.js";

export default {
  props: ["socket", "username"],
  data() {
    return {
      index: 0,
      todoItems: [],
      user: {
        userName: "",
        todo: "",
      },
      users: [],
      editing: false,
      newTask: "",
    };
  },
  methods: {
    confirmEdit(index) {
      console.log(index);
      this.todoItems[index].todo = this.newTask;
      this.newTask = "";
      this.editing = false;
    },
    editTask(index) {
      this.index = index;
      this.editing = true;
    },
    makeToDo() {
      this.socket.emit("user-entered-task", {
        todo: this.user.todo,
        username: this.user.userName,
        id: this.socket.id,
      });
      this.user.todo = "";
    },
  },
  created() {
    EventBus.$on("login", (username) => {
      this.user.userName = username;
      console.log(this.users);
    });

    //get users from server when others join
    this.socket.on("username-sent", (username) => {
      this.users.push(username);
    });

    //get updated task data from server
    this.socket.on("send-task-data", (taskData) => {
      console.log(taskData);
      this.todoItems.push(taskData);
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap");

.todo-list-card {
  margin-top: 2.2rem !important;
  margin-bottom: 2rem !important;
  margin: 0 auto;
}

.todo-list {
  list-style: none;
  font-family: "PT Sans Narrow", sans-serif;
  font-size: 1.5rem;
  margin-left: -30px;
}

.card-title {
  font-size: 2.5rem;
  font-family: "Roboto Mono", monospace;
  opacity: 65%;
}

.test-row {
  flex-direction: row;
}

.users-list {
  list-style: none;
  font-family: "Comfortaa", cursive;
  font-size: 0.9rem;

  text-align: initial;
}

.custom-border-card {
  border: 1px solid #d4d9df;
  border-radius: 0.25rem;
  padding: 0.5rem;
}
</style>
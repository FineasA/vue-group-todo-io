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

            <li
              @click="editTask(index, todoItems[index].todo)"
              v-for="(todo, index) in todoItems"
              :key="index"
            >
              <span>
                {{todo.todo}}
                <b-input
                  @keyup.enter="confirmEdit(index)"
                  v-if="editing && index === indexClicked"
                  v-model="newTask"
                  placeholder="Edit task..."
                  style="max-width: 50%"
                ></b-input>
              </span>

              <em class="text-muted small mt-3" style="float: right; font-size: 1rem">
                submitted by {{todo.username}}
                <strong>{{todo.createdAt | moment('calendar')}}</strong>
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
          <li class="users-list" v-for="(userOnline, index) in usersOnline" :key="index">
            <font-awesome-icon color="lime" :icon="['fa', 'plug']" />
            {{' '}}{{userOnline.username}}
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
      indexClicked: 0,
      todoItems: [],
      user: {
        userName: "",
        todo: "",
      },
      usersOnline: [],
      editing: false,
      newTask: "",
      oldTask: "",
    };
  },
  methods: {
    confirmEdit(index) {
      this.socket.emit(
        "user-edited-task",
        {
          todoEdit: this.newTask,
          index: index,
        },
        this.oldTask
      );
    },
    editTask(index, oldTask) {
      console.log(oldTask);
      this.oldTask = oldTask;
      this.indexClicked = index;
      this.editing = true;
    },
    makeToDo() {
      this.socket.emit("user-entered-task", {
        todo: this.user.todo,
        username: this.user.userName,
        id: this.socket.id,
        createdAt: new Date(),
      });
      this.user.todo = "";
    },
  },
  created() {
    this.socket.on("data-recieved", (data) => {
      console.log(data);
      this.todoItems = data;
    });
    EventBus.$on("login", (username) => {
      this.user.userName = username;
    });

    //get users from server when others join
    this.socket.on("users-list-updated", (usersOnline) => {
      console.log("????????????");
      console.log(usersOnline);
      this.usersOnline = usersOnline;
    });

    //get updated task data from server
    this.socket.on("send-task-data", (taskData) => {
      this.todoItems.push(taskData);
    });

    //get updated edited tasks from server
    this.socket.on("send-edited-data", (editData) => {
      this.todoItems[editData.index].todo = editData.todoEdit;

      this.newTask = "";
      this.editing = false;
    });

    //get updated team members online from server
    this.socket.on("user-disconnected-update", (socketId) => {
      console.log(this.users);
      console.log(socketId);
      const result = this.users.filter((user) => user.socketId !== socketId);
      console.log(result);
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
  opacity: 0.65 !important;
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
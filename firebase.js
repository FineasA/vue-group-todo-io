import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAOwV83SdH2VJ2uYX-EXURRrHkxh3bbK10",
  authDomain: "vue-group-todo.firebaseapp.com",
  databaseURL: "https://vue-group-todo.firebaseio.com",
  projectId: "vue-group-todo",
  storageBucket: "vue-group-todo.appspot.com",
  messagingSenderId: "967366155052",
  appId: "1:967366155052:web:086f2c271e3bb8649bea89",
  measurementId: "G-EVGTJQFM7N",
};

firebase.initializeApp(config);
const db = firebase.firestore();

export default db;

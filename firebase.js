var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyDiGACkmSXuANAozKI4MxTr2vnYEmP-lqk",
  authDomain: "boardgame-app-db.firebaseapp.com",
  databaseURL: "https://boardgame-app-db.firebaseio.com",
  storageBucket: "boardgame-app-db.appspot.com",
  messagingSenderId: "157620636752"

};
firebase.initializeApp(config);

var database = firebase.database();

module.exports = {firebase, database};

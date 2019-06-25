import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyA9TpJMMVqUq81HFLExdhAogyeXkyxQkg0",
    authDomain: "react-chat-feb7e.firebaseapp.com",
    databaseURL: "https://react-chat-feb7e.firebaseio.com",
    projectId: "react-chat-feb7e",
    storageBucket: "react-chat-feb7e.appspot.com",
    messagingSenderId: "75466828240",
    appId: "1:75466828240:web:12ea9d786eb1f455"
  };
  firebase.initializeApp(firebaseConfig);

  export default firebase;
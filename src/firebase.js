import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "your key",
    authDomain: "domain",
    databaseURL: //ur url,
    projectId: // your id,
    storageBucket: //your bucket,
    messagingSenderId: //your data,
    appId: //your id
  };
  firebase.initializeApp(firebaseConfig);

  export default firebase;
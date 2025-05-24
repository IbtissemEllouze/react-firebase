// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA8Z9cg54Xmiwm29_LvbQn6BgnWfWyzvno",
  authDomain: "tpaaaa-8a618.firebaseapp.com",
  databaseURL: "https://tpaaaa-8a618-default-rtdb.firebaseio.com",
  projectId: "tpaaaa-8a618",
  storageBucket: "tpaaaa-8a618.appspot.com",
  messagingSenderId: "286386887929",
  appId: "1:286386887929:web:c64c5a9f7eeb18c737d628",
  measurementId: "G-G61T08M03N"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

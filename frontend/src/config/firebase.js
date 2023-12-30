// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy73g4yj6ffSMhypsPb1D4YO3Itw7Gwss",
  authDomain: "wedding-task.firebaseapp.com",
  projectId: "wedding-task",
  storageBucket: "wedding-task.appspot.com",
  messagingSenderId: "277012310374",
  appId: "1:277012310374:web:b2bc4c7875eb99ae0000a7",
  measurementId: "G-5SVJMYQ5CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
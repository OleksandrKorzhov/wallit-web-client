// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_ckpVT1SVby8oWtaZi8Nq9ENG-wpParc",
  authDomain: "wallit-374019.firebaseapp.com",
  projectId: "wallit-374019",
  storageBucket: "wallit-374019.appspot.com",
  messagingSenderId: "395660610846",
  appId: "1:395660610846:web:2b7a11bd45e5df05e68d0f",
  measurementId: "G-9EY0FD31PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const app = initializeApp({apiKey:"AIzaSyCjYzrOvJuV1UN67aljAHQEK5LWCmtvMPw",authDomain:"payapang-isip.firebaseapp.com",projectId:"payapang-isip",storageBucket:"payapang-isip.firebasestorage.app",messagingSenderId:"901078398408",appId:"1:901078398408:web:1f4c5e5794f96801f57cfd"});
const db = getFirestore(app);

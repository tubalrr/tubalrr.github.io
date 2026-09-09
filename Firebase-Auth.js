// Payapang Isip - Google Auth - SECURED - NO SECRET SCAN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

let currentUser = null;

async function saveUser(user){
  try{
    await setDoc(doc(db,"users",user.uid), {
      uid: user.uid,
      displayName: user.displayName || "Explorer",
      email: user.email,
      photoURL: user.photoURL || "",
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp()
    }, {merge:true});
  }catch(e){ console.error("saveUser",e); }
}

export async function loginWithGoogle(){
  const msg = document.getElementById("authMessage");
  try{
    if(msg) msg.textContent = "Opening Google...";
    const result = await signInWithPopup(auth, provider);
    await saveUser(result.user);
    if(msg) msg.textContent = "Welcome, " + result.user.displayName + " 🌲";
    closeAuthModal();
    setTimeout(()=>location.href="./global-chat.html", 800);
  }catch(e){
    console.error(e);
    if(msg) msg.textContent = "Error: " + e.message;
  }
}

export async function logoutUser(){
  await signOut(auth);
  location.reload();
}

onAuthStateChanged(auth, (user)=>{
  currentUser = user;
  const actions = document.getElementById("accountActions");
  if(!actions) return;
  if(user){
    actions.innerHTML = `<div style="display:flex;align-items:center;gap:8px"><img src="${user.photoURL||''}" style="width:28px;height:28px;border-radius:50%"><span style="font-size:12px;font-weight:700">${user.displayName}</span><button onclick="logoutUser()" style="padding:6px 10px;border-radius:999px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:11px">Logout</button></div>`;
  } else {
    actions.innerHTML = `<button class="btn-kain btn-ghost" onclick="location.href='./index.html'">🏠 Home</button>`;
  }
});

window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;
window.closeAuthModal = function(){ document.getElementById("authModal")?.classList.remove("active"); document.getElementById("authModal").style.display="none"; };
window.openAuthModal = function(){ const m=document.getElementById("authModal"); if(m){ m.style.display="grid"; m.classList.add("active"); } };

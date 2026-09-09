
// Payapang Isip - Google Auth - JOIN COMMUNITY
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
 apiKey:"AIzaSyCjYzrOvJuV1UN67aljAHQEK5LWCmtvMPw",
 authDomain:"payapang-isip.firebaseapp.com",
 projectId:"payapang-isip",
 storageBucket:"payapang-isip.firebasestorage.app",
 messagingSenderId:"901078398408",
 appId:"1:901078398408:web:1f4c5e5794f96801f57cfd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

let currentUser = null;

// Save user to Firestore
async function saveUser(user){
  try{
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      lastLogin: serverTimestamp(),
      joinedAt: serverTimestamp()
    }, { merge: true });
  }catch(e){ console.log("save user error", e); }
}

// Google Login Function
window.loginWithGoogle = async () => {
  const btn = document.getElementById('googleLoginBtn');
  const msg = document.getElementById('authMessage');
  try{
    if(btn){ btn.disabled=true; btn.textContent="⏳ Connecting to Google..."; }
    if(msg) msg.textContent="Opening Google login...";
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    await saveUser(currentUser);
    if(msg) msg.textContent=`Welcome, ${currentUser.displayName}! 🌲 Redirecting...`;
    if(btn) btn.textContent="✅ Logged in!";
    // Store for other pages
    localStorage.setItem('payapang_user', JSON.stringify({
      uid: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      photo: currentUser.photoURL
    }));
    setTimeout(()=>{
      closeAuthModal();
      // Redirect to community
      window.location.href = './global-chat.html';
    }, 1200);
  }catch(err){
    console.error(err);
    if(msg) msg.textContent="❌ " + (err.message || "Login failed. Try again.");
    if(btn){ btn.disabled=false; btn.textContent="Continue with Google"; }
    if(err.code === 'auth/popup-blocked'){
      alert("Pop-up blocked! Please allow pop-ups for this site and try again.");
    }
  }
};

window.logoutGoogle = async () => {
  await signOut(auth);
  localStorage.removeItem('payapang_user');
  location.reload();
};

// Auth Modal Functions
window.openAuthModal = () => {
  const modal = document.getElementById('authModal');
  if(modal) modal.classList.add('active');
  document.body.style.overflow='hidden';
};
window.closeAuthModal = () => {
  const modal = document.getElementById('authModal');
  if(modal) modal.classList.remove('active');
  document.body.style.overflow='';
};

onAuthStateChanged(auth, (user)=>{
  currentUser = user;
  const joinBtns = document.querySelectorAll('.nav-cta, [data-join-community]');
  if(user){
    // Update UI - user logged in
    joinBtns.forEach(btn=>{
      if(btn.classList.contains('nav-cta')){
        btn.textContent = `🌲 ${user.displayName?.split(' ')[0] || 'Community'} →`;
        btn.href = './global-chat.html';
        btn.onclick = null;
      }
    });
    const loginNotice = document.getElementById('loginNotice');
    if(loginNotice) loginNotice.style.display='none';
  } else {
    // Not logged in - make join buttons open modal
    joinBtns.forEach(btn=>{
      if(btn.classList.contains('nav-cta')){
        btn.textContent = 'Join Community ↗';
        btn.removeAttribute('href');
        btn.onclick = (e)=>{ e.preventDefault(); openAuthModal(); };
      }
    });
  }
});

// Close modal when clicking outside
document.addEventListener('click', (e)=>{
  const modal = document.getElementById('authModal');
  if(e.target === modal) closeAuthModal();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeAuthModal();
});

// ---- NEWS LOADER FOR INDEX ----
import { getFirestore as getFS2, collection as col2, query as q2, orderBy as ob2, onSnapshot as os2, getDocs as gd2 } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const db2 = getFS2(app);
const FALLBACK = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800";
function cleanImage(u){ if(!u) return FALLBACK; u=String(u).trim(); if(u.startsWith("data:")) return FALLBACK; if(u.includes("bing.net")||u.includes("...")||u.length<15) return FALLBACK; return u; }
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function renderNews(docs){
  const c=document.getElementById('forestNewsList'); if(!c) return;
  const filtered=docs.filter(n=>(n.status||"published").toLowerCase()==="published");
  const cleaned=filtered.filter(n=>{const img=String(n.image||n.media||""); if(img.startsWith("data:")) return false; if(img.includes("tse1.mm.bing.net")) return false; return true;});
  if(cleaned.length===0){c.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9ab29d;background:#FFFEFD;border-radius:14px">Wala pang news. Mag-add sa Admin gamit Unsplash link.</div>`;return;}
  c.innerHTML=cleaned.slice(0,6).map(n=>{const img=cleanImage(n.image||n.media||""); const id=n.id||""; return `<a href="./News.html?id=${id}" style="text-decoration:none"><article style="background:#FFFEFD;border-radius:14px;overflow:hidden;color:#12231a"><img src="${esc(img)}" style="width:100%;height:160px;object-fit:cover" onerror="this.src='${FALLBACK}'"><div style="padding:12px"><small>${esc((n.category||"Forest Whispers").toUpperCase())}</small><h3>${esc(n.title||"Untitled")}</h3><p>${esc((n.content||"").slice(0,80))}...</p></div></article></a>`;}).join('');
}
async function loadNews(){try{const qq=q2(col2(db2,"news"),ob2("createdAt","desc"));os2(qq,snap=>{renderNews(snap.docs.map(d=>({id:d.id,...d.data()})));},async()=>{const s=await gd2(col2(db2,"news"));renderNews(s.docs.map(d=>({id:d.id,...d.data()})));});}catch(e){const s=await gd2(col2(db2,"news"));renderNews(s.docs.map(d=>({id:d.id,...d.data()})));}}
loadNews();

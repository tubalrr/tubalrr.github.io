// firebase-news.js - FIXED data:text bug
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const firebaseConfig = {apiKey:"AIzaSyCjYzrOvJuV1UN67aljAHQEK5LWCmtvMPw",authDomain:"payapang-isip.firebaseapp.com",projectId:"payapang-isip",storageBucket:"payapang-isip.firebasestorage.app",messagingSenderId:"901078398408",appId:"1:901078398408:web:1f4c5e5794f96801f57cfd"};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const FALLBACK = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800";
function cleanImage(u){ if(!u) return FALLBACK; u=String(u).trim(); if(u.startsWith("data:")) return FALLBACK; if(u.includes("bing.net")||u.includes("...")||u.length<15) return FALLBACK; return u; }
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function renderNews(docs){
  const c=document.getElementById('forestNewsList'); if(!c) return;
  const filtered=docs.filter(n=>(n.status||"published").toLowerCase()==="published");
  const cleaned=filtered.filter(n=>{const img=String(n.image||n.media||""); if(img.startsWith("data:")) return false; if(img.includes("tse1.mm.bing.net")) return false; return true;});
  if(cleaned.length===0){c.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9ab29d;background:#FFFEFD;border-radius:14px">Wala pang news. Mag-add sa Admin gamit Unsplash link.</div>`;return;}
  c.innerHTML=cleaned.slice(0,6).map(n=>{const img=cleanImage(n.image||n.media||"");return `<article style="background:#FFFEFD;border-radius:14px;overflow:hidden;color:#12231a"><img src="${esc(img)}" style="width:100%;height:160px;object-fit:cover" onerror="this.src='${FALLBACK}'"><div style="padding:12px"><small>${esc((n.category||"Forest Whispers").toUpperCase())}</small><h3>${esc(n.title||"Untitled")}</h3><p>${esc((n.content||"").slice(0,80))}...</p></div></article>`;}).join('');
}
async function loadNews(){try{const q=query(collection(db,"news"),orderBy("createdAt","desc"));onSnapshot(q,snap=>{renderNews(snap.docs.map(d=>({id:d.id,...d.data()})));},async()=>{const s=await getDocs(collection(db,"news"));renderNews(s.docs.map(d=>({id:d.id,...d.data()})));});}catch(e){const s=await getDocs(collection(db,"news"));renderNews(s.docs.map(d=>({id:d.id,...d.data()})));}}
loadNews();

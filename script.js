// === PAYAPANG ISIP - NEWS FIXED JS - I-ADD MO SA INDEX.HTML MO BAGO </body> ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjYzrOvJuV1UN67aljAHQEK5LWCmtvMPw",
  authDomain: "payapang-isip.firebaseapp.com",
  projectId: "payapang-isip",
  storageBucket: "payapang-isip.firebasestorage.app",
  messagingSenderId:"901078398408",
  appId:"1:901078398408:web:1f4c5e5794f96801f57cfd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FALLBACK_FOREST = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800";

function cleanImage(url) {
  if (!url) return FALLBACK_FOREST;
  url = url.trim();
  if (url.startsWith("data:")) return FALLBACK_FOREST; // tanggalin lahat ng base64 na sira
  if (url.includes("tse1.mm.bing.net") || url.includes("tse2.mm.bing.net")) return FALLBACK_FOREST; // bing thumbnail sira
  if (url.length < 20) return FALLBACK_FOREST; // putol na link
  if (url.includes("...")) return FALLBACK_FOREST; // putol na may ...
  return url;
}

function esc(s){ return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }

function renderNews(newsArray) {
  // Hanapin yung container sa index.html mo - try lahat ng possible id
  const containers = [
    document.getElementById('forestNewsList'),
    document.getElementById('newsList'),
    document.getElementById('latestNews'),
    document.querySelector('[data-news-list]'),
    document.querySelector('.news-grid')
  ].filter(Boolean);
  
  const container = containers[0];
  if (!container) {
    console.warn("News container not found! Lagyan mo ng id='forestNewsList' yung news grid mo sa index.html");
    return;
  }

  // Filter out sira
  const filtered = newsArray.filter(n => {
    const status = (n.status || "published").toLowerCase();
    return status === "published"; // published lang sa index
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:#6B8A7A;background:#FFFBF7;border-radius:16px;border:1.5px dashed #F0DCC8">🌲 Wala pang news. Mag-add ka sa Admin → News gamit Unsplash forest link.</div>`;
    return;
  }

  container.innerHTML = filtered.slice(0,6).map(n => {
    const img = cleanImage(n.image || n.media || "");
    const date = n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : "Just now";
    return `
      <div class="news-card" style="background:#FFFEFD;border:1.5px solid #F3EDE7;border-radius:16px;overflow:hidden;cursor:pointer;transition:.2s" onclick="location.href='news.html#${n.id}'">
        <img src="${esc(img)}" alt="" style="width:100%;height:160px;object-fit:cover;display:block" onerror="this.src='${FALLBACK_FOREST}'">
        <div style="padding:14px">
          <span style="background:#E8F5E9;color:#2D5A3D;padding:4px 8px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.5px">${esc((n.category||'Forest Whispers').toUpperCase())}</span>
          <h4 style="margin:10px 0 6px;font-size:14px;font-weight:800;line-height:1.3;font-family:Fraunces">${esc(n.title||'Untitled')}</h4>
          <p style="margin:0;font-size:12px;color:#8A96A4;line-height:1.5">${esc((n.content||n.description||'').slice(0,90))}...</p>
          <div style="margin-top:10px;font-size:11px;color:#A9B4BE">${esc(date)} • 👁 ${n.views||0}</div>
        </div>
      </div>
    `;
  }).join('');
}

async function loadNews() {
  try {
    // Try real-time
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
      const news = snap.docs.map(d => ({id:d.id, ...d.data()}));
      console.log("News loaded (live):", news.length);
      renderNews(news);
    }, async (err) => {
      // fallback to getDocs if orderBy fails
      console.warn("onSnapshot failed, trying getDocs:", err);
      const snap = await getDocs(collection(db, "news"));
      const news = snap.docs.map(d => ({id:d.id, ...d.data()}));
      renderNews(news);
    });
  } catch (e) {
    console.error("News load error:", e);
    // fallback without orderBy
    const snap = await getDocs(collection(db, "news"));
    const news = snap.docs.map(d => ({id:d.id, ...d.data()}));
    renderNews(news);
  }
}

// Auto-load pag ready na DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNews);
} else {
  loadNews();
}
// === MENU FIX mo ===
function toggleMenu(){
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebarOverlay');
  sb.classList.toggle('show');
  if(ov) ov.classList.toggle('show', sb.classList.contains('show'));
}
function closeMenu(){
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebarOverlay');
  if(sb) sb.classList.remove('show');
  if(ov) ov.classList.remove('show');
}

// === FIREBASE NEWS FIXED - tanggal yung data:text bug ===
const FALLBACK = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800";
function cleanImage(url){
  if(!url) return FALLBACK;
  url=String(url).trim();
  if(url.startsWith("data:")) return FALLBACK; // ito yung mahabang data:text/html;base64... sa baba
  if(url.includes("tse1.mm.bing.net")||url.includes("bing.net")||url.includes("...")) return FALLBACK;
  return url;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjYzrOvJuV1UN67aljAHQEK5LWCmtvMPw",
  authDomain: "payapang-isip.firebaseapp.com",
  projectId: "payapang-isip",
  storageBucket: "payapang-isip.firebasestorage.app",
  messagingSenderId: "901078398408",
  appId: "1:901078398408:web:1f4c5e5794f96801f57cfd"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
let authMode = "login";

window.openAuth=(mode="login")=>{document.getElementById("authBackdrop").classList.add("show");setAuthMode(mode);};
window.closeAuth=()=>document.getElementById("authBackdrop").classList.remove("show");
window.setAuthMode=(mode)=>{authMode=mode;const signup=mode==="signup";document.getElementById("tabLogin").classList.toggle("active",!signup);document.getElementById("tabSignup").classList.toggle("active",signup);document.getElementById("authTitle").textContent=signup?"Create your account":"Welcome back";document.getElementById("authSubtitle").textContent=signup?"Gumawa ng account gamit ang email, Google, o Facebook.":"Mag-sign in para magpatuloy sa Payapang Isip.";document.getElementById("authSubmit").textContent=signup?"Create Account":"Sign In";document.getElementById("authPassword").autocomplete=signup?"new-password":"current-password";authMessage("");};
function authMessage(msg,ok=false){const b=document.getElementById("authMsg");if(!msg){b.style.display="none";return}b.textContent=msg;b.className="auth-msg"+(ok?" success":"");b.style.display="block";}
function friendlyError(e){const m={"auth/email-already-in-use":"May account na gamit ang email na ito.","auth/invalid-email":"Hindi valid ang email address.","auth/weak-password":"Gumamit ng password na may minimum na 6 characters.","auth/invalid-credential":"Maling email o password.","auth/popup-closed-by-user":"Isinara ang sign-in window.","auth/account-exists-with-different-credential":"May existing account na gamit ang email na ito sa ibang sign-in method.","auth/operation-not-allowed":"Hindi pa enabled ang sign-in method na ito sa Firebase Authentication."};return m[e.code]||("Authentication error: "+(e.message||"Subukan ulit."));}
window.submitAuth=async()=>{const email=document.getElementById("authEmail").value.trim(),password=document.getElementById("authPassword").value;if(!email||!password)return authMessage("Ilagay ang email at password.");try{if(authMode==="signup")await createUserWithEmailAndPassword(auth,email,password);else await signInWithEmailAndPassword(auth,email,password);authMessage("Success!",true);closeAuth();}catch(e){authMessage(friendlyError(e));}};
window.signInGoogle=async()=>{try{await signInWithPopup(auth,googleProvider);closeAuth();}catch(e){authMessage(friendlyError(e));}};
window.signInFacebook=async()=>{try{await signInWithPopup(auth,facebookProvider);closeAuth();}catch(e){authMessage(friendlyError(e));}};
onAuthStateChanged(auth,user=>{const box=document.getElementById("accountActions");if(!box)return;if(user){const name=user.displayName||user.email?.split("@")[0]||"Member";box.innerHTML=`<button class="btn btn-light account-btn" onclick="location.href='dashboard.html'"><span class="account-avatar">${name.slice(0,1).toUpperCase()}</span>${name}</button><button class="btn btn-dark" onclick="siteLogout()">Logout</button>`;}else{box.innerHTML=`<button class="btn btn-light" onclick="openAuth('login')">Sign In</button><button class="btn btn-dark" onclick="openAuth('signup')">Create Account</button>`;}});
window.siteLogout=async()=>{await signOut(auth);toast("Logged out");};

const quotes=[
{id:1,title:'Magandang Umaga',views:'4,577 views',text:'Magandang umaga. Hindi mo kailangang maging perpekto ngayon. Maging totoo ka lang, sapat na.'},
{id:2,title:'Masakit palang tanggapin',views:'3.2k views',text:'Masakit palang tanggapin na minsan, kahit anong gawin mo, may mga bagay na hindi para sa’yo. At okay lang yun.'},
{id:3,title:'Hindi mo kailangang ayusin',views:'2.9k views',text:'Hindi mo kailangang ayusin ang buong mundo. Ayusin mo muna ang paghinga mo. Yung mundo, susunod na.'},
{id:4,title:'1st Day of September',views:'5.1k views',text:'1st Day of September — paalala na pwede ka ulit magsimula. Hindi pa huli ang lahat.'},
{id:5,title:'Maybe you are not lost',views:'4.4k views',text:'Maybe you are not lost. Maybe you are just taking the scenic route to becoming yourself.'},
{id:6,title:'Take your time',views:'3.8k views',text:'Take your time. Walang hinahabol. Ang payapa, hindi minamadali — inaalagaan.'}
];
const affirmations=['Karapat-dapat akong maging payapa ngayong araw.','Hindi ko kailangang kontrolin ang lahat para maging okay.','Sapat ako, kahit hindi perpekto.','Pinipili kong huminga bago mag-react.','Maliit na hakbang, pero hakbang pa rin.','Pinapayagan kong maging tao — nasasaktan, natututo, lumalago.'];
const moods=[['😔','Mabigat'],['😕','Medyo'],['😐','Sakto'],['🙂','Magaan'],['😌','Payapa']];
let state={page:'tahanan',mood:+localStorage.getItem('payapang_last_mood')||0,journals:JSON.parse(localStorage.getItem('payapang_journals')||'[]'),favorites:JSON.parse(localStorage.getItem('payapang_favorites')||'[1,3]'),community:JSON.parse(localStorage.getItem('payapang_community')||'[]'),chat:JSON.parse(localStorage.getItem('payapang_chat')||'[]'),cart:JSON.parse(localStorage.getItem('payapang_cart')||'[]'),affirm:0,breathing:false,phase:'ready',seconds:60,cycles:0};
if(!state.journals.length){state.journals=[{id:'1',text:'Ngayong araw, pinili kong huminga ng malalim bago sumagot. Hindi ko na-control lahat, pero na-control ko sarili ko.',mood:4,date:Date.now()-86400000},{id:'2',text:'Ang bigat kanina. Pero sinulat ko lahat dito. Gumaan pakiramdam.',mood:2,date:Date.now()-172800000}];save()}
const navItems=[['tahanan','⌂','Home','Ngayon'],['community','☀','Community','share'],['chat','🌍','Global Chat','live'],['news','▣','News','updates'],['shop','🛍','Shop','items'],['dashboard','👤','My Dashboard','profile']];
function save(){localStorage.setItem('payapang_journals',JSON.stringify(state.journals));localStorage.setItem('payapang_favorites',JSON.stringify(state.favorites));localStorage.setItem('payapang_last_mood',state.mood);localStorage.setItem('payapang_community',JSON.stringify(state.community));localStorage.setItem('payapang_chat',JSON.stringify(state.chat));localStorage.setItem('payapang_cart',JSON.stringify(state.cart))}
function streak(){return Math.min(state.journals.length,12)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function renderNav(){
const make=compact=>navItems.map(([id,ic,label,desc])=>{
 const active=state.page===id?'active':'';
 const action=id==='dashboard'?"location.href='dashboard.html'":`id==='shop'?"location.href='shop.html'":go('${id}')`;
 return `<button class="${active} ${id==='dashboard'?'dashboard-link':''}" onclick="${action}">${compact?ic:`<span class="icon">${ic}</span><span><span class="label">${label}</span><span class="desc">${desc}</span></span>`}</button>`;
}).join('');
document.getElementById('nav').innerHTML=make(false);
document.getElementById('mobileNav').innerHTML=make(true)
}
function go(page){state.page=page;render()}
function header(title,sub){return `<h1 class="page-title serif">${title}</h1><p class="sub">${sub}</p>`}
function home(){const q=quotes[new Date().getDate()%quotes.length];return `<div class="grid two"><section class="grid" style="align-content:start"><div class="card quote"><span class="badge">✦ TODAY'S QUOTE • ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span><h1 class="serif">${q.text}</h1><p>${q.views} • Payapang Isip</p></div><div class="card"><b>Kamusta ang pakiramdam mo?</b><div class="mood-label">Pumili ng pinakamalapit sa nararamdaman mo ngayon.</div><div class="moods" style="margin-top:14px">${moods.map((m,i)=>`<button class="mood ${state.mood===i+1?'active':''}" onclick="setMood(${i+1})" title="${m[1]}">${m[0]}</button>`).join('')}</div>${state.mood?`<div class="mood-label">Napili: <b>${moods[state.mood-1][1]}</b></div>`:''}</div><div class="card"><div style="display:flex;align-items:center;gap:8px"><b>✎ Mabilis na sulat</b></div><textarea class="textarea" id="quickText" placeholder="Ano ang nasa isip mo ngayon? Walang tama o mali dito..."></textarea><div class="row"><span class="small" id="count">0 characters</span><button class="btn btn-dark" onclick="addJournal('quickText')">I-save • Journal</button></div></div></section><aside class="grid" style="align-content:start"><div class="card affirm"><div class="small" style="color:#fbbf24;letter-spacing:.1em;text-transform:uppercase;font-weight:800">✦ Affirmation ngayon</div><p class="serif">“${affirmations[state.affirm]}”</p><button class="btn" style="background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.1)" onclick="nextAffirm()">Bagong affirmation</button></div><div class="card"><b>Mabilis na stats</b><div class="stats" style="margin-top:12px"><div class="stat"><small>Streak</small><b>🔥 ${streak()}</b></div><div class="stat"><small>Journals</small><b>${state.journals.length}</b></div><div class="stat"><small>Paborito</small><b>${state.favorites.length}</b></div></div></div></aside></div><div class="home-feature-links">
<button class="home-feature-link" onclick="go('community')"><span class="icon">👥</span><h3>Community</h3><p>Makipag-ugnayan at magbahagi ng positibong mensahe.</p><div class="go">Buksan →</div></button>
<button class="home-feature-link" onclick="go('news')"><span class="icon">📰</span><h3>News</h3><p>Mga update, kwento, at paalala mula sa Payapang Isip.</p><div class="go">Basahin →</div></button>
<button class="home-feature-link" onclick="openShop()"><span class="icon">🛍️</span><h3>Shop</h3><p>Digital items at resources para sa iyong wellness journey.</p><div class="go">Tingnan →</div></button>
</div>
<div style="margin-top:28px">
  <div class="row" style="margin-bottom:14px"><div><h2 class="serif" style="margin:0">Latest from Shop</h2><p class="small" style="margin:4px 0 0">Mga bagong products na idinagdag ng admin.</p></div><button class="btn btn-light" onclick="openShop()">View Shop →</button></div>
  ${products.length
    ? `<div class="shop-grid">${products.slice(0,3).map(p=>productCard(p,true)).join('')}</div>`
    : `<div class="card small" style="text-align:center;padding:28px">🛍️ Wala pang products sa shop.</div>`}
</div>`}
function journal(){return `${header('Journal','Isulat mo. Walang filter. Para sa’yo lang ito.')}<div class="card"><div class="row" style="margin-top:0"><b>✎ Bagong entry</b><div class="moods">${moods.map((m,i)=>`<button class="mood ${state.mood===i+1?'active':''}" style="width:40px;height:40px;font-size:18px;border-radius:12px" onclick="setMood(${i+1})">${m[0]}</button>`).join('')}</div></div><textarea class="textarea" id="journalText" placeholder="Magsimula ka dito..." style="margin-top:14px"></textarea><div class="row"><span class="small">Mood: ${state.mood?moods[state.mood-1][1]:'Sakto'}</span><button class="btn btn-dark" onclick="addJournal('journalText')">I-save sa Journal</button></div></div><div class="grid" style="margin-top:16px">${state.journals.slice().sort((a,b)=>b.date-a.date).map(j=>`<div class="card entry"><div class="face">${moods[(j.mood||3)-1][0]}</div><div style="flex:1"><b>${new Date(j.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</b><p>${escapeHtml(j.text)}</p><div class="small" style="margin-top:8px">${moods[(j.mood||3)-1][1]}</div></div><button class="delete" onclick="deleteJournal('${j.id}')">Delete</button></div>`).join('')||'<div class="card empty">Wala pa. Magsimula ka ng unang sulat.</div>'}</div>`}
function favorites(){const fav=quotes.filter(q=>state.favorites.includes(q.id));return `${header('Paborito','Mga salitang gusto mong balikan.')}<div class="quote-list">${fav.map(q=>`<div class="quote-item"><button class="heart" onclick="toggleFav(${q.id})">♥</button><span class="small">${q.title}</span><p>${q.text}</p><span class="small">${q.views} • Payapang Isip</span></div>`).join('')||'<div class="card empty">Wala ka pang saved na quote.</div>'}</div><h2 class="serif" style="margin-top:30px">Iba pang quotes</h2><div class="quote-list">${quotes.filter(q=>!state.favorites.includes(q.id)).map(q=>`<div class="quote-item"><button class="heart" onclick="toggleFav(${q.id})" style="background:white;color:#94a3b8;border:1px solid var(--line)">♡</button><span class="small">${q.title}</span><p>${q.text}</p><button class="btn btn-light" onclick="toggleFav(${q.id})">Save</button></div>`).join('')}</div>`}
function breathing(){return `${header('Hinga','4-7-8 breathing. Langhap 4s, pigil 7s, buga 8s. Isang minuto lang.')}<div class="card breath-wrap"><div class="breath ${state.phase}" id="breathCircle"><div><small>${state.breathing?state.phase:'ready'}</small><h2 class="serif">${state.breathing?(state.phase==='inhale'?'Langhap':state.phase==='hold'?'Pigil':'Buga'):'Hinga'}</h2><span>${state.breathing?state.seconds+'s • '+state.cycles+' cycles':'1 minuto'}</span></div></div><div class="row" style="margin-top:40px"><button class="btn ${state.breathing?'btn-light':'btn-dark'}" onclick="toggleBreathing()">${state.breathing?'Stop':'Simulan'}</button><button class="btn btn-light" onclick="resetBreathing()">Reset</button></div></div>`}
function progress(){let days=[];for(let i=6;i>=0;i--){let d=new Date(Date.now()-i*86400000);let found=state.journals.find(j=>new Date(j.date).toDateString()===d.toDateString());days.push({label:d.toLocaleDateString('en-US',{weekday:'short'}).charAt(0),h:found?55+(found.mood||3)*9:5})}let achievements=[['🌱','Unang Hakbang','Nagsulat ka ng unang journal',state.journals.length>=1],['🔥','3 Araw na Payapa','3 araw na tuloy-tuloy',streak()>=3],['✎','Manunulat','5 journals na',state.journals.length>=5],['♥','Mapagmahal sa Sarili','Nag-save ng 3 paborito',state.favorites.length>=3]];return `${header('Progress','Tingnan ang maliliit na hakbang na nagawa mo.')}<div class="grid two"><div class="card"><b>Huling 7 araw</b><div class="progress-bars">${days.map(d=>`<div class="bar"><i style="height:${d.h}%"></i><span>${d.label}</span></div>`).join('')}</div><div class="small">Batay sa journal entries at mood check-ins.</div></div><div class="card"><b>Mga numero mo</b><div class="stats" style="margin-top:15px"><div class="stat"><small>Journals</small><b>${state.journals.length}</b></div><div class="stat"><small>Streak</small><b>${streak()}</b></div><div class="stat"><small>Saved</small><b>${state.favorites.length}</b></div></div></div></div><div class="grid" style="margin-top:16px"><h2 class="serif" style="margin:0">Achievements</h2>${achievements.map(a=>`<div class="achievement ${a[3]?'':'locked'}"><div class="ach-icon">${a[0]}</div><div><b>${a[1]}</b><div class="small">${a[2]}</div></div><span style="margin-left:auto;font-size:11px;font-weight:800">${a[3]?'Unlocked':'Locked'}</span></div>`).join('')}</div>`}

const newsItems=[
{tag:'COMMUNITY',title:'Maligayang pagdating sa Payapang Isip Community',text:'May bago tayong space para magbahagi ng simpleng kwento, quote, at positibong mensahe.'},
{tag:'UPDATE',title:'Global Chat is now open',text:'Mag-iwan ng friendly message at makipag-usap nang may respeto at kabutihan.'},
{tag:'WELLNESS',title:'Isang minuto para sa sarili',text:'Subukan ang Hinga section kapag kailangan mong huminto sandali at mag-reset.'},
{tag:'SHOP',title:'Bagong Payapang Isip digital items',text:'Available ang sample digital products at community support items sa Shop.'}
];
let products=[];

async function loadLiveProducts(){
  try{
    let snap;
    try{
      snap=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")));
    }catch(orderError){
      // Works even if Firestore has no order index or old products have no createdAt.
      snap=await getDocs(collection(db,"products"));
    }

    products=snap.docs.map(d=>({
      id:d.id,
      name:"Untitled Product",
      description:"",
      price:0,
      stock:0,
      category:"General",
      image:"",
      ...d.data()
    }));

    // Refresh the currently visible page automatically.
    if(state && (state.page==="shop" || state.page==="tahanan")) render();
  }catch(error){
    console.error("Unable to load products:",error);
    products=[];
    if(state && (state.page==="shop" || state.page==="tahanan")) render();
  }
}

function escProduct(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function getProductType(p){
  return String(p.type || "image").toLowerCase();
}

function getMediaUrl(p){
  return p.media || p.image || "";
}

function productMedia(p){
  const type = getProductType(p);
  const url = getMediaUrl(p);

  if(type === "audio"){
    return url
      ? `<div class="product-visual" style="display:block;padding:18px;height:auto">🎵<audio controls preload="metadata" src="${escProduct(url)}" style="width:100%;margin-top:10px"></audio></div>`
      : `<div class="product-visual">🎵</div>`;
  }

  if(type === "video"){
    return url
      ? `<video controls preload="metadata" src="${escProduct(url)}" style="width:100%;max-height:230px;object-fit:cover;border-radius:14px;background:#111;margin-bottom:10px"></video>`
      : `<div class="product-visual">🎬</div>`;
  }

  if(type === "file"){
    return `<div class="product-visual">📁</div>`;
  }

  return `<div class="product-visual">${
    url
      ? `<img src="${escProduct(url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.style.display='none'">`
      : "🛍️"
  }</div>`;
}

function productCard(p,home=false){
  const id=String(p.id).replace(/'/g,"\'");
  const type=getProductType(p);
  const url=getMediaUrl(p);

  return `<article class="product">
    ${productMedia(p)}
    <h3 class="serif">${escProduct(p.name)}</h3>
    <div class="small">🏷️ ${escProduct(type.toUpperCase())}${p.category ? " • "+escProduct(p.category) : ""}</div>
    <div class="small" style="margin-top:6px">${escProduct(p.description||"No description")}</div>
    ${type==="file" && url ? `<a href="${escProduct(url)}" target="_blank" rel="noopener" class="small" style="display:inline-block;margin-top:8px">📥 Open file</a>` : ""}
    <div class="row">
      <span class="price">₱${Number(p.price||0).toLocaleString("en-PH")}</span>
      ${home
        ? `<button class="btn btn-dark" onclick="openShop()">View</button>`
        : `<button class="btn btn-dark" ${Number(p.stock||0)<=0?'disabled style="opacity:.55;cursor:not-allowed"':''} onclick="addCart('${id}')">${Number(p.stock||0)<=0?'Out of stock':state.cart.includes(String(p.id))?'Added ✓':'Add'}</button>`}
    </div>
  </article>`;
}
function community(){let posts=state.community.slice().reverse();return `${header('Community','Isang ligtas at positibong lugar para magbahagi.')}<div class="card community-hero"><span class="badge">☀ PAYAPANG ISIP COMMUNITY</span><h2 class="serif" style="font-size:28px;margin:18px 0 8px;position:relative;z-index:1">Magbahagi ng kabutihan.</h2><p style="position:relative;z-index:1;opacity:.75">I-share ang simpleng thought, encouragement, o magandang nangyari sa araw mo.</p></div><div class="card post-composer" style="margin-top:16px"><b>✦ Gumawa ng post</b><textarea id="communityText" placeholder="Ano ang gusto mong ibahagi sa community?" style="margin-top:12px"></textarea><div class="row"><span class="small">Panatilihing mabait at magalang ang community.</span><button class="btn btn-dark" onclick="addPost()">I-post</button></div></div><div>${posts.map(p=>`<article class="post"><div class="post-head"><div class="avatar">PI</div><div><b>${escapeHtml(p.author||'Community Member')}</b><div class="small">${new Date(p.date).toLocaleString()}</div></div></div><p>${escapeHtml(p.text)}</p><div class="post-actions"><button class="mini-btn" onclick="likePost('${p.id}')">♥ ${p.likes||0} Like</button><button class="mini-btn" onclick="toast('Comments feature coming soon')">◌ Comment</button></div></article>`).join('')||'<div class="card empty">Wala pang community post. Ikaw ang unang magbahagi! ☀</div>'}</div>`}
function chat(){let msgs=state.chat;return `${header('Global Chat','Friendly messages para sa Payapang Isip community.')}<div class="chat-shell"><aside class="card room-list"><button class="room active">🌍 Global Room<br><span class="small">Community chat</span></button><button class="room" onclick="toast('Coming soon')">🌿 Positivity</button><button class="room" onclick="toast('Coming soon')">☀ Morning Club</button><div class="small"><span class="online-dot"></span>Online demo room</div></aside><section class="card chat-box"><div class="messages" id="messages">${msgs.map(m=>`<div class="msg ${m.me?'me':''}"><div class="avatar">${m.me?'ME':'PI'}</div><div class="bubble"><b>${m.me?'Ikaw':'Payapang Isip Member'}</b><div>${escapeHtml(m.text)}</div><small>${new Date(m.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join('')||'<div class="empty">Wala pang message. Batiin ang community 👋</div>'}</div><div class="chat-send"><input class="chat-input" id="chatText" placeholder="Type a friendly message..." onkeydown="if(event.key==='Enter')sendChat()"><button class="btn btn-dark" onclick="sendChat()">Send</button></div><div class="small" style="margin-top:10px">Demo mode: messages are stored locally on this browser.</div></section></div>`}
function news(){return `${header('News','Mga update at announcements mula sa Payapang Isip.')}<div class="news-grid">${newsItems.map((n,i)=>`<article class="news-card"><span class="news-tag">${n.tag}</span><h3 class="serif">${n.title}</h3><p class="small" style="font-size:13px;line-height:1.65">${n.text}</p><div class="small" style="margin-top:14px">${i+1} day${i?'s':''} ago • Payapang Isip</div></article>`).join('')}</div>`}
function shop(){
  let total=state.cart.reduce((a,id)=>{
    const p=products.find(p=>String(p.id)===String(id));
    return a+(p?Number(p.price||0):0);
  },0);

  return `${header('Shop','Mga products na idinagdag at pinamamahalaan ng Payapang Isip admin.')}
  ${products.length
    ? `<div class="shop-grid">${products.map(p=>productCard(p,false)).join('')}</div>`
    : `<div class="card" style="text-align:center;padding:40px"><div style="font-size:38px">🛍️</div><h3 class="serif">Wala pang products</h3><p class="small">Mag-add ng product ang admin para lumabas ito rito at sa Home page.</p></div>`}
  <div class="cart-bar"><div><b>🛒 Cart</b><span class="small" style="color:#cbd5e1;margin-left:8px">${state.cart.length} item(s)</span></div><div><b>₱${Number(total).toLocaleString("en-PH")}</b> <button class="btn" style="margin-left:8px;background:#fbbf24;color:#0f172a" onclick="checkout()">Checkout</button></div></div>`
}
function addPost(){let el=document.getElementById('communityText'),text=el?.value.trim();if(!text)return toast('May gusto ka bang ibahagi muna?');state.community.push({id:String(Date.now()),author:'Community Member',text,date:Date.now(),likes:0});save();toast('Posted sa Community ☀');render()}
function likePost(id){let p=state.community.find(x=>x.id===id);if(p){p.likes=(p.likes||0)+1;save();render()}}

const sideChatNames=['Mika','Luna','Jaycee','Alyssa','Ken','Rhea','Carlo','Admin'];
function renderSideChat(){
 const box=document.getElementById('sideChatMessages'); if(!box)return;
 const msgs=state.chat.slice(-18);
 if(!msgs.length){
   const samples=[
    ['Mika','Magandang umaga sa lahat! 🙂'],['Luna','Kaya natin ito. 💪'],['Jaycee','Tara, pahinga muna. ☕'],['Alyssa','Keep safe everyone! 💙'],['Admin','Welcome sa Global Chat! 🎉']
   ];
   box.innerHTML=samples.map((m,i)=>`<div class="side-msg"><div class="side-avatar">${m[0].slice(0,2).toUpperCase()}</div><div class="side-msg-body"><div class="side-msg-top"><span class="side-msg-name">${m[0]}</span><span class="side-msg-time">${12+i}:2${i}</span></div><div class="side-msg-text">${m[1]}</div></div></div>`).join('');
 } else {
   box.innerHTML=msgs.map((m,i)=>{const name=m.me?'Ikaw':sideChatNames[i%sideChatNames.length];return `<div class="side-msg"><div class="side-avatar">${name.slice(0,2).toUpperCase()}</div><div class="side-msg-body"><div class="side-msg-top"><span class="side-msg-name">${name}</span><span class="side-msg-time">${new Date(m.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div><div class="side-msg-text">${escapeHtml(m.text)}</div></div></div>`}).join('');
 }
 box.scrollTop=box.scrollHeight;
}
function sendSideChat(){
 const el=document.getElementById('sideChatText'),text=el?.value.trim(); if(!text)return;
 state.chat.push({id:String(Date.now()),text,date:Date.now(),me:true}); save(); el.value=''; renderSideChat(); toast('Message sent 🌍');
}

function sendChat(){let el=document.getElementById('chatText'),text=el?.value.trim();if(!text)return;state.chat.push({id:String(Date.now()),text,date:Date.now(),me:true});save();render();setTimeout(()=>{let box=document.getElementById('messages');if(box)box.scrollTop=box.scrollHeight},50)}
function addCart(id){
  id=String(id);
  if(!state.cart.map(String).includes(id)){state.cart.push(id);save();toast("Added to cart")}
  else toast("Already in cart");
  render();
}
function checkout(){if(!state.cart.length)return toast('Wala pang item sa cart');toast('Demo checkout • connect payment gateway next')}

function render(){renderNav();let out=state.page==='tahanan'?home():state.page==='community'?community():state.page==='chat'?chat():state.page==='news'?news():shop();document.getElementById('app').innerHTML=out;renderSideChat();const qt=document.getElementById('quickText');if(qt){qt.addEventListener('input',()=>document.getElementById('count').textContent=qt.value.length+' characters')}}
function setMood(m){state.mood=m;save();toast('Mood saved 🌿');render()}
function addJournal(id){let el=document.getElementById(id),text=el?.value.trim();if(!text)return toast('May gusto ka bang isulat muna?');state.journals.unshift({id:String(Date.now()),text,mood:state.mood||3,date:Date.now()});save();toast('Na-save sa Journal 🌿');render()}
function deleteJournal(id){state.journals=state.journals.filter(j=>j.id!==id);save();toast('Deleted');render()}
function toggleFav(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();toast(state.favorites.includes(id)?'Na-save sa Paborito ♥':'Tinanggal sa Paborito');render()}
function nextAffirm(){state.affirm=(state.affirm+1)%affirmations.length;render()}
let breathTimer=null;
function toggleBreathing(){if(state.breathing){clearInterval(breathTimer);state.breathing=false;state.phase='ready';render();return}state.breathing=true;state.phase='inhale';state.seconds=60;let phaseSec=4,elapsed=0;breathTimer=setInterval(()=>{state.seconds--;elapsed++;phaseSec--;if(phaseSec<=0){if(state.phase==='inhale'){state.phase='hold';phaseSec=7}else if(state.phase==='hold'){state.phase='exhale';phaseSec=8}else{state.phase='inhale';phaseSec=4;state.cycles++}}if(state.seconds<=0){clearInterval(breathTimer);state.breathing=false;state.phase='ready';toast('Tapos na. Salamat sa paghinga 🌿')}render()},1000);render()}
function resetBreathing(){clearInterval(breathTimer);state.breathing=false;state.phase='ready';state.seconds=60;state.cycles=0;render()}
function logout(){if(confirm('Mag-logout sa dashboard?')){signOut(auth).finally(()=>{localStorage.removeItem('payapang_user');toast('Logged out');setTimeout(()=>location.href='index.html',500)})}}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
loadLiveProducts();
render();
// parallax
window.addEventListener('scroll',()=>{const v=document.getElementById('natureVideo');if(v){v.style.transform=`translateY(${window.scrollY*0.35}px) scale(1.1)`}});





// --- FIX: expose all handlers to window for onclick ---
window.go = go;
window.setMood = setMood;
window.addJournal = addJournal;
window.deleteJournal = deleteJournal;
window.toggleFav = toggleFav;
window.nextAffirm = nextAffirm;
window.toggleBreathing = toggleBreathing;
window.resetBreathing = resetBreathing;
window.addPost = addPost;
window.likePost = likePost;
window.sendSideChat = sendSideChat;
window.sendChat = sendChat;
window.addCart = addCart;
window.checkout = checkout;
window.escapeHtml = escapeHtml;
window.openShop = openShop;

// Override go for shop -> go to shop.html
const originalGo = go;
window.go = function(page){
  if(page === 'shop'){
    window.location.href = 'shop.html';
    return;
  }
  originalGo(page);
}

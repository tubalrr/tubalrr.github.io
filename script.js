/* PAYAPANG ISIP x NATURA - FIXED JS - with Firebase News filtered + menu fix */
const navbar=document.getElementById("navbar");
window.addEventListener("scroll",()=>navbar && navbar.classList.toggle("scrolled",scrollY>40));

const menuBtn=document.querySelector(".menu-toggle");
const menu=document.querySelector(".nav-menu");
if(menuBtn && menu){
  menuBtn.addEventListener("click",()=>menu.classList.toggle("active"));
  document.querySelectorAll(".nav-menu a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("active")));
}

// === MENU FIX mo from earlier ===
function toggleMenu(){
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebarOverlay');
  if(!sb) return;
  sb.classList.toggle('show');
  if(ov) ov.classList.toggle('show', sb.classList.contains('show'));
}
function closeMenu(){
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebarOverlay');
  if(sb) sb.classList.remove('show');
  if(ov) ov.classList.remove('show');
}
document.addEventListener('click', (e)=>{
  const sidebar=document.querySelector('.sidebar');
  const btn=document.querySelector('.menu-toggle');
  const overlay=document.getElementById('sidebarOverlay');
  if(!sidebar || !btn) return;
  if(e.target === overlay){ closeMenu(); return; }
  if(sidebar.classList.contains('show') && !sidebar.contains(e.target) && !btn.contains(e.target)){
    if(window.innerWidth <= 900){ closeMenu(); }
  }
});

// Reveal animation
const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}})
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Modal
const modal=document.getElementById("storyModal");
const watchBtn=document.getElementById("watchBtn");
const closeModalBtn=document.getElementById("closeModal");
if(watchBtn && modal) watchBtn.addEventListener("click",()=>modal.classList.add("active"));
if(closeModalBtn && modal) closeModalBtn.addEventListener("click",()=>modal.classList.remove("active"));
if(modal) modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("active")});

// Newsletter
const subForm=document.getElementById("subscribeForm");
if(subForm){
  subForm.addEventListener("submit",e=>{
   e.preventDefault();
   const email=document.getElementById("email");
   const msg=document.getElementById("formMessage");
   if(msg) msg.textContent=`Salamat! ${email.value} is now part of Payapang Isip. 🌲`;
   if(email) email.value="";
  });
}

// Cursor glow
const glow=document.querySelector(".cursor-glow");
if(glow){
  window.addEventListener("pointermove",e=>{
   glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";
  });
}

// Active nav highlight
document.addEventListener('DOMContentLoaded',()=>{
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .sidebar a').forEach(a=>{
    if(a.getAttribute('href')===cur) a.classList.add('active');
  });
  document.querySelectorAll('[data-auth-login]').forEach(el=>{
    el.style.pointerEvents='auto';
    el.style.zIndex='10';
  });
});

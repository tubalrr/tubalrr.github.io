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
function pickWinner(){
 const raw=document.getElementById('names').value;
 const names=raw.split(',').map(x=>x.trim()).filter(Boolean);
 const out=document.getElementById('winner');
 if(!names.length){out.textContent='Add at least one name!';return}
 out.textContent='🎲 Picking...';
 setTimeout(()=>{out.textContent='🏆 '+names[Math.floor(Math.random()*names.length)]},700);
}
function demoSubmit(e,msg){e.preventDefault();alert(msg);e.target.reset()}
document.addEventListener('click', (e)=>{
  const sidebar=document.querySelector('.sidebar');
  const btn=document.querySelector('.menu-btn');
  const overlay=document.getElementById('sidebarOverlay');
  if(!sidebar || !btn) return;
  // If clicking overlay, close
  if(e.target === overlay){
    closeMenu();
    return;
  }
  // If sidebar is open on mobile and clicking outside sidebar and not menu btn
  if(sidebar.classList.contains('show') && !sidebar.contains(e.target) && !btn.contains(e.target) && !e.target.closest('.sidebar')){
    // Don't close if clicking inside main but we are on desktop
    if(window.innerWidth <= 800){
      closeMenu();
    }
  }
});
document.addEventListener('DOMContentLoaded',()=>{
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar nav a').forEach(a=>{
    if(a.getAttribute('href')===cur) a.classList.add('active');
  });
  // Ensure login button clickable - add pointer events
  document.querySelectorAll('[data-auth-login], .side-bottom a').forEach(el=>{
    el.style.pointerEvents='auto';
    el.style.zIndex='10';
  });
});

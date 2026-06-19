
(function(){
  const root = document.documentElement;
  const toggle = document.querySelector('.menu-toggle');
  if(toggle){toggle.addEventListener('click',()=>document.body.classList.toggle('mobile-open'));}
  const slides=[...document.querySelectorAll('.hero-slide')];
  const dots=[...document.querySelectorAll('.hero-dots button')];
  let idx=0;
  function showHero(n){ if(!slides.length) return; idx=(n+slides.length)%slides.length; slides.forEach((s,i)=>s.classList.toggle('active',i===idx)); dots.forEach((d,i)=>d.classList.toggle('active',i===idx)); }
  dots.forEach((d,i)=>d.addEventListener('click',()=>showHero(i)));
  if(slides.length){ showHero(0); setInterval(()=>showHero(idx+1),5000); }
  function normalize(s){return (s||'').toString().toLowerCase().trim();}
  const filterInput=document.querySelector('[data-filter-input]');
  const filterType=document.querySelector('[data-filter-type]');
  const filterRegion=document.querySelector('[data-filter-region]');
  const grid=document.querySelector('[data-card-grid]');
  function applyFilter(){
    if(!grid) return;
    const q=normalize(filterInput&&filterInput.value);
    const type=normalize(filterType&&filterType.value);
    const region=normalize(filterRegion&&filterRegion.value);
    let visible=0;
    grid.querySelectorAll('.movie-card').forEach(card=>{
      const text=normalize([card.dataset.title,card.dataset.region,card.dataset.type,card.dataset.year,card.dataset.tags,card.textContent].join(' '));
      const ok=(!q||text.includes(q)) && (!type||normalize(card.dataset.type)===type) && (!region||normalize(card.dataset.region).includes(region));
      card.style.display=ok?'':'none'; if(ok) visible++;
    });
    document.body.classList.toggle('no-results', visible===0);
    const counter=document.querySelector('[data-result-count]'); if(counter) counter.textContent=visible;
  }
  [filterInput,filterType,filterRegion].forEach(el=>{ if(el) el.addEventListener('input',applyFilter); });
  const params=new URLSearchParams(location.search);
  if(filterInput && params.get('q')){ filterInput.value=params.get('q'); }
  applyFilter();
  const player=document.querySelector('[data-player]');
  const start=document.querySelector('[data-player-start]');
  function initPlayer(){
    if(!player) return;
    const src=player.dataset.src;
    if(!src) return;
    if(window.Hls && window.Hls.isSupported()){
      const hls=new window.Hls({maxBufferLength:30});
      hls.loadSource(src); hls.attachMedia(player);
      hls.on(window.Hls.Events.MANIFEST_PARSED,()=>{player.play().catch(()=>{});});
    }else if(player.canPlayType('application/vnd.apple.mpegurl')){
      player.src=src; player.play().catch(()=>{});
    }else{
      player.src=src; player.play().catch(()=>{});
    }
    if(start) start.style.display='none';
  }
  if(start) start.addEventListener('click',initPlayer);
})();

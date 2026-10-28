const getPath=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);

async function getPublishedContent(){
  try{
    const live=await fetch('/api/content',{cache:'no-store'});
    if(live.ok) return await live.json();
  }catch(e){}
  const local=await fetch('content.json',{cache:'no-store'});
  if(!local.ok) throw new Error('No content');
  return await local.json();
}

function applyContent(data){
  document.querySelectorAll('[data-content]').forEach(el=>{
    const v=getPath(data,el.dataset.content);
    if(v!==undefined){
      if(el.dataset.html==='true') el.innerHTML=v;
      else el.textContent=v;
    }
  });
  document.querySelectorAll('[data-content-href]').forEach(el=>{
    const v=getPath(data,el.dataset.contentHref);
    if(v) el.href=v;
  });
  const images=data.images||{};
  document.querySelectorAll('[data-image]').forEach(el=>{
    const v=images[el.dataset.image];
    if(v) el.src=v;
  });
}

(async()=>{
  try{ applyContent(await getPublishedContent()); }
  catch(e){ console.info('Se usan los textos e imágenes integrados en la landing.'); }
})();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

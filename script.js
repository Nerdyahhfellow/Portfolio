(function(){
  // Hero name: letter-by-letter blur-in
  var n=document.getElementById('name'),txt='Smayan G Shetty';
  var k=0;
  txt.split(' ').forEach(function(word){
    var w=document.createElement('span');w.className='w';
    word.split('').forEach(function(ch){
      var s=document.createElement('span');s.className='l';s.textContent=ch;
      s.style.animationDelay=(0.1+k++*0.05)+'s';w.appendChild(s);
    });
    n.appendChild(w);
  });
  // Typewriter
  var words=['stay lowkey.','keep your experiences safe.','make useful products.','work on cybersecurity'],wi=0,ci=0,del=false,t=document.getElementById('type');
  (function tick(){
    var w=words[wi];ci+=del?-1:1;t.textContent=w.slice(0,ci);
    var d=del?35:75;
    if(!del&&ci===w.length){del=true;d=1400}
    else if(del&&ci===0){del=false;wi=(wi+1)%words.length;d=300}
    setTimeout(tick,d);
  })();
  // Cursor glow
  var g=document.getElementById('glow');
  window.addEventListener('pointermove',function(e){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
  // Tilt cards
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='rotateY('+x*5+'deg) rotateX('+-y*5+'deg)';
    });
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
  // Reveal + skill bars
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('show');
      e.target.querySelectorAll('.fill').forEach(function(f){f.style.width=f.dataset.w+'%'});
      io.unobserve(e.target);
    }})},{threshold:.2});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3)*0.1+'s';io.observe(el)});
  // Progress bar + active nav
  var links=[].slice.call(document.querySelectorAll('nav a')),secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
  var rail=document.getElementById('rail'),fill=document.getElementById('railfill'),names=['Home','Projects','About','Skills','Contact'],rd=[];
  function placeRail(){
    var h=document.documentElement.scrollHeight-innerHeight;
    if(!rd.length)secs.forEach(function(sec,i){
      var d=document.createElement('a');d.className='rd';d.href='#'+sec.id;d.setAttribute('aria-label',names[i]);
      d.innerHTML='<b>'+names[i]+'</b>';rail.appendChild(d);rd.push({el:d,f:0});
    });
    secs.forEach(function(sec,i){var f=Math.min(1,Math.max(0,sec.offsetTop/h));rd[i].f=f;rd[i].el.style.top=f*100+'%'});
  }
  addEventListener('resize',placeRail);addEventListener('load',placeRail);placeRail();
  function onScroll(){
    var h=document.documentElement.scrollHeight-innerHeight,p=h>0?Math.min(1,Math.max(0,scrollY/h)):0;
    fill.style.height=p*100+'%';
    rd.forEach(function(m){m.el.classList.toggle('lit',p>=m.f-.005)});
    var cur=0;secs.forEach(function(s,i){if(s.getBoundingClientRect().top<innerHeight*.45)cur=i});
    links.forEach(function(a,i){a.classList.toggle('on',i===cur)});
    rd.forEach(function(m,i){m.el.classList.toggle('on',i===cur)});
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  // Keyboard shortcuts 1-5
  addEventListener('keydown',function(e){
    if(/INPUT|TEXTAREA/.test(document.activeElement.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
    var i=parseInt(e.key,10);
    if(i>=1&&i<=secs.length)secs[i-1].scrollIntoView({behavior:'smooth'});
  });
  // Theme toggle
  var root=document.documentElement;
  document.getElementById('theme').onclick=function(){
    var t=root.getAttribute('data-theme'),dark=t?t==='dark':!matchMedia('(prefers-color-scheme:light)').matches;
    root.setAttribute('data-theme',dark?'light':'dark');
  };
  // Demo form
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();document.getElementById('sent').textContent='Thanks! This demo form does not send anything yet.';
  });
})();

(function(){
  var cv=document.getElementById('bg'),cx=cv.getContext('2d'),W,H,P=[],m={x:-999,y:-999},col=['214,168,92','127,181,168'],f=0,
      rm=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement;
  function rgb(h){h=h.trim().replace('#','');if(h.length!==6)return null;return parseInt(h.slice(0,2),16)+','+parseInt(h.slice(2,4),16)+','+parseInt(h.slice(4,6),16)}
  function colors(){var cs=getComputedStyle(root),a=rgb(cs.getPropertyValue('--a')),b=rgb(cs.getPropertyValue('--b'));if(a&&b)col=[a,b]}
  function size(){
    var d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
    var n=Math.round(Math.min(110,W*H/14000));P=[];
    for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.7,d:Math.random()*.35+.08,c:Math.random()<.7?0:1,ox:0,oy:0});
  }
  function draw(){
    if(f++%60===0)colors();
    cx.clearRect(0,0,W,H);var sy=scrollY,i,j,p,q,dx,dy,dist;
    for(i=0;i<P.length;i++){
      p=P[i];p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x+=W;if(p.x>W)p.x-=W;if(p.y<0)p.y+=H*3;if(p.y>H*3)p.y-=H*3;
      p.sx=p.x+p.ox;p.sy=((p.y-sy*p.d)%H+H)%H+p.oy;
      dx=p.sx-m.x;dy=p.sy-m.y;dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<130&&dist>0){var k=(130-dist)/130;p.ox+=dx/dist*k*2.2;p.oy+=dy/dist*k*2.2}
      p.ox*=.94;p.oy*=.94;p.md=dist;
    }
    for(i=0;i<P.length;i++){
      p=P[i];
      for(j=i+1;j<P.length;j++){
        q=P[j];dx=p.sx-q.sx;dy=p.sy-q.sy;dist=dx*dx+dy*dy;
        if(dist<14400){cx.strokeStyle='rgba('+col[p.c]+','+((1-Math.sqrt(dist)/120)*.22).toFixed(3)+')';cx.lineWidth=.7;cx.beginPath();cx.moveTo(p.sx,p.sy);cx.lineTo(q.sx,q.sy);cx.stroke()}
      }
      if(p.md<180){cx.strokeStyle='rgba('+col[0]+','+((1-p.md/180)*.55).toFixed(3)+')';cx.lineWidth=.9;cx.beginPath();cx.moveTo(p.sx,p.sy);cx.lineTo(m.x,m.y);cx.stroke()}
    }
    for(i=0;i<P.length;i++){
      p=P[i];
      cx.fillStyle='rgba('+col[p.c]+',.1)';cx.beginPath();cx.arc(p.sx,p.sy,p.r*4,0,6.283);cx.fill();
      cx.fillStyle='rgba('+col[p.c]+',.9)';cx.beginPath();cx.arc(p.sx,p.sy,p.r,0,6.283);cx.fill();
    }
    if(!rm)requestAnimationFrame(draw);
  }
  addEventListener('pointermove',function(e){m.x=e.clientX;m.y=e.clientY});
  addEventListener('pointerleave',function(){m.x=m.y=-999});
  addEventListener('resize',size);
  size();colors();draw();
})();

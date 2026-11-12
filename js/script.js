/* Moteur du film. Tu n'as normalement pas besoin de modifier ce fichier :
   tout se règle dans config.js */
(function(){
var $=function(i){return document.getElementById(i)};
var S=CONFIG.scenes;
var DAYS=Math.floor((new Date()-new Date(CONFIG.together[0],CONFIG.together[1],CONFIG.together[2]))/864e5);
var paused=false,skip=false,runId=0,T={stars:0,bloom:0,fw:0},muted=false,useA=true,mtok=0;

function wait(ms){return new Promise(function(r){var t=0,id=setInterval(function(){if(!paused)t+=50;if(t>=ms||skip){clearInterval(id);skip=false;r()}},50)})}
function setBg(g){var on=useA?$("bgB"):$("bgA"),off=useA?$("bgA"):$("bgB");on.style.background=g;on.classList.add("on");off.classList.remove("on");useA=!useA}
function words(t){return t.split(" ").map(function(w,k){return '<span style="animation-delay:'+(k*.15)+'s">'+w+'</span>'}).join(" ")}

/* ---------- Animations selon les mots ----------
   Si une phrase contient le mot de gauche, l'effet de droite se déclenche.
   c = animation du texte, f = effet visuel */
var FX=[
 [/petite fille|ne voulais pas/i,{c:"e-shy"}],
 [/timidit/i,{c:"e-shy",f:"sparkles"}],
 [/ton calme/i,{f:"rings"}],
 [/pris toute la place/i,{f:"hearts"}],
 [/embrasser/i,{f:"hearts"}],
 [/honte/i,{c:"e-shy e-blush",f:"blush"}],
 [/adorable/i,{f:"sparkles"}],
 [/jours ensemble|devenus nous/i,{f:"hearts"}],
 [/intelligente/i,{f:"sparkles"}],
 [/drôle/i,{c:"e-pop e-wig"}],
 [/attentionn/i,{f:"hearts"}],
 [/itou gaillard/i,{c:"e-wig"}],
 [/gifle/i,{f:"slap"}],
 [/compatis/i,{f:"rings"}],
 [/merci/i,{c:"e-pop",f:"sparkles"}],
 [/19 ans/i,{c:"e-pop",f:"boom"}],
 [/ma vie|mon bb|mon amour/i,{f:"hearts"}],
 [/je t.aime/i,{c:"e-pop",f:"heartrain"}]
];
var P2=[],pinks=["#ff8fb1","#ffb3c7","#ff6f9c","#ffd9e4","#f3a5bd"];
function runFx(f){
  var W=innerWidth,H=innerHeight,i;
  if(f==="hearts")for(i=0;i<16;i++)P2.push({t:"h",x:Math.random()*W,y:H+20,vy:-(1.2+Math.random()*1.8),s:12+Math.random()*16,l:1,ph:Math.random()*6,c:pinks[i%5],d:i*4});
  if(f==="heartrain")for(i=0;i<40;i++)P2.push({t:"h",x:Math.random()*W,y:-30,vy:1+Math.random()*1.6,s:12+Math.random()*16,l:1,ph:Math.random()*6,c:pinks[i%5],d:i*5});
  if(f==="sparkles")for(i=0;i<26;i++)P2.push({t:"s",x:W*(.15+Math.random()*.7),y:H*(.15+Math.random()*.6),s:6+Math.random()*12,l:1,c:i%3?"#fff":"#ffe9a8",d:i*3});
  if(f==="rings")for(i=0;i<3;i++)P2.push({t:"r",x:W/2,y:H*.45,s:10,l:1,c:i%2?"#bcd9ff":"#ffd9e4",d:i*22});
  if(f==="blush"){var b=$("blush");b.classList.remove("go");void b.offsetWidth;b.classList.add("go")}
  if(f==="slap"){
    setTimeout(function(){document.body.classList.add("shake");fl();var p=document.createElement("div");p.className="paf";p.textContent="PAF !";document.body.appendChild(p);
      setTimeout(function(){p.remove();document.body.classList.remove("shake")},1400)},900);
  }
  if(f==="boom"){fl();for(i=0;i<3;i++)setTimeout(function(){launchFW(innerWidth*(.2+Math.random()*.6),innerHeight*(.15+Math.random()*.3))},i*350)}
}
function fl(){var e=$("flash");e.classList.remove("go");void e.offsetWidth;e.classList.add("go")}
function applyFx(text,l,d){
  FX.forEach(function(f){if(f[0].test(text)){if(f[1].c)d.className+=" "+f[1].c;if(f[1].f)runFx(f[1].f)}});
  if(l[1]==="name")runFx("hearts");
}

/* ---------- Photos et vidéos ---------- */
function showMedia(m,sepia){
  var ph=$("ph"),tok=++mtok;ph.classList.remove("on");
  if(!m){vol(.8);setTimeout(function(){if(tok===mtok)ph.innerHTML=""},700);return}
  setTimeout(function(){
    if(tok!==mtok)return;
    ph.innerHTML="";ph.classList.toggle("sepia",!!sepia);
    var el,go=function(){if(tok===mtok)ph.classList.add("on")};
    if(m.type==="video"){el=document.createElement("video");el.preload="auto";el.muted=!m.sound;el.loop=true;el.autoplay=true;el.setAttribute("playsinline","");el.setAttribute("webkit-playsinline","");el.onloadeddata=go;el.src=m.src}
    else{el=document.createElement("img");el.alt="";el.onload=function(){(el.decode?el.decode():Promise.resolve()).then(go,go)};el.src=m.src}
    el.onerror=function(){ph.classList.remove("on")};
    ph.appendChild(el);
    if(m.type==="video"){var p=el.play();if(p&&p.catch)p.catch(function(){})}
    vol(m.sound?.12:.8);
  },420);
}

/* ---------- Scènes ---------- */
async function scene(s,id){
  setBg(s.bg);T.stars=s.stars||0;T.bloom=s.bloom||0;T.fw=s.fw||0;
  var hasM=s.media&&s.media.length;
  if(hasM)s.media.forEach(function(m){if(m.type!=="video"){var im=new Image();im.src=m.src}});
  if(s.chap){$("chap").innerHTML="<small>"+s.chap[0]+"</small><b>"+s.chap[1]+"</b>";$("chap").className="show";await wait(3400);$("chap").className="";await wait(1200)}
  if(hasM||s.low)$("stage").classList.add("withm");
  var prevText="";
  for(var k=0;k<s.lines.length;k++){
    if(id!==runId)return;
    var l=s.lines[k],txt=$("txt");
    if(txt.children.length&&!/,$/.test(prevText)){
      [].forEach.call(txt.children,function(c){c.classList.add("out")});await wait(450);txt.innerHTML="";
    }
    var d=document.createElement("div");d.className="ln "+(l[1]||"");
    if(hasM)showMedia(s.media[k%s.media.length],s.sepia);
    if(l[0]==="@days"){d.innerHTML='<span><b id="dd">0</b> jours ensemble</span>';txt.appendChild(d);count()}
    else{d.innerHTML=words(l[0]);txt.appendChild(d)}
    applyFx(l[0],l,d);prevText=l[0];
    await wait(1700+l[0].split(" ").length*250+(hasM?500:0));
  }
  await wait(s.hold||1400);
  $("txt").classList.add("out");showMedia(null);await wait(1100);
  $("txt").innerHTML="";$("txt").classList.remove("out");$("stage").classList.remove("withm");
}
function count(){var e=$("dd"),st=Date.now();(function f(){var p=Math.min((Date.now()-st)/2400,1);if(e)e.textContent=Math.round(DAYS*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})()}

async function credits(id){
  var c=$("credits");T.stars=.6;T.bloom=0;T.fw=1;setBg("#000");
  c.innerHTML=CONFIG.credits.map(function(r){return "<p><small>"+r[0]+"</small><b>"+r[1]+"</b></p>"}).join("");
  c.classList.remove("run");void c.offsetWidth;c.classList.add("run");
  await wait(28500);c.classList.remove("run");c.innerHTML="";
}
async function film(){
  var id=++runId;$("endc").classList.add("hide");document.body.classList.add("film");$("txt").innerHTML="";
  var onlyFinale=location.search.indexOf("cake")>-1;
  for(var i=onlyFinale?S.length:0;i<S.length;i++){
    if(id!==runId)return;
    $("prog").firstElementChild.style.width=(i/(S.length+2)*100)+"%";
    await scene(S[i],id);
  }
  if(CONFIG.finale!==false){
    if(id!==runId)return;await constellation(id);
    if(id!==runId)return;await cake(id);
  }
  if(id!==runId)return;await credits(id);
  if(id!==runId)return;if(CONFIG.bonus)await scene(CONFIG.bonus,id);
  if(id!==runId)return;
  $("prog").firstElementChild.style.width="100%";T.fw=1;T.stars=.9;setBg("radial-gradient(90% 70% at 50% 40%,#3a2a8a,#06081f 75%)");$("endc").classList.remove("hide");
}

/* ---------- Canvas : étoiles, fleurs, feux d'artifice, effets ---------- */
var cv=$("cv"),x=cv.getContext("2d"),W,H,dpr=Math.min(devicePixelRatio||1,1.5),stars=[],fl2=[],fw=[],sa=0,lastB=0,lastF=0;
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);stars=[];for(var i=0;i<(W<600?90:180);i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.3,p:Math.random()*6,v:.2+Math.random()*.6})}
size();addEventListener("resize",size);
var pc=["#6fa1f0","#8db8f5","#4a86e8","#f3a5bd","#bcd9ff","#a6c4ff"],fc=["#bcd9ff","#ffd9e4","#ffe9a8","#8db8f5","#ffffff","#f3a5bd"];
function flower(f,a){x.save();x.translate(f.x,f.y);x.rotate(f.r+f.g*.6);x.globalAlpha=a;x.fillStyle=f.c;var s=f.s*f.g;for(var i=0;i<5;i++){x.rotate(1.2566);x.beginPath();x.ellipse(0,-s*.55,s*.32,s*.55,0,0,6.283);x.fill()}x.fillStyle="#ffe9a8";x.beginPath();x.arc(0,0,s*.2,0,6.283);x.fill();x.restore()}
function heart(a,b,s){x.beginPath();x.moveTo(a,b+s*.3);x.bezierCurveTo(a,b,a-s*.5,b,a-s*.5,b+s*.3);x.bezierCurveTo(a-s*.5,b+s*.6,a,b+s*.8,a,b+s);x.bezierCurveTo(a,b+s*.8,a+s*.5,b+s*.6,a+s*.5,b+s*.3);x.bezierCurveTo(a+s*.5,b,a,b,a,b+s*.3);x.fill()}
function star(a,b,r){x.beginPath();for(var i=0;i<8;i++){var an=i*Math.PI/4,rr=i%2?r*.25:r;x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fill()}
function launchFW(bx,by){var col=fc[Math.floor(Math.random()*fc.length)],n=W<600?40:70;for(var i=0;i<n;i++){var a=Math.random()*6.283,sp=1.5+Math.random()*4.2;fw.push({x:bx,y:by,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1,c:Math.random()<.7?col:"#fff"})}}
function frame(t){
  if(T.fw||fw.length){x.globalCompositeOperation="destination-out";x.fillStyle="rgba(0,0,0,.22)";x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over"}else x.clearRect(0,0,W,H);
  sa+=(T.stars-sa)*.02;
  if(sa>.01)stars.forEach(function(s){s.y-=s.v*.08;if(s.y<0)s.y=H;x.globalAlpha=sa*(.4+.6*Math.abs(Math.sin(t/900+s.p)));x.fillStyle="#fff";x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill()});
  if(CN.on)drawCons(t);
  if(T.bloom&&t-lastB>(W<600?800:500)&&fl2.length<26){lastB=t;fl2.push({x:Math.random()*W,y:H*(.35+Math.random()*.6),s:34+Math.random()*(W<600?36:60),g:0,r:Math.random()*6,c:pc[Math.floor(Math.random()*pc.length)]})}
  fl2=fl2.filter(function(f){if(T.bloom&&f.g<1)f.g+=.012;if(!T.bloom)f.g-=.008;if(f.g<=0)return false;flower(f,Math.min(f.g,1)*.75);return true});
  if(T.fw&&t-lastF>600){lastF=t;launchFW(W*(.15+Math.random()*.7),H*(.12+Math.random()*.38))}
  x.globalCompositeOperation="lighter";
  fw=fw.filter(function(p){p.vy+=.045;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.l-=.012;if(p.l<=0)return false;x.globalAlpha=p.l;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,2,0,6.283);x.fill();return true});
  x.globalCompositeOperation="source-over";
  P2=P2.filter(function(p){
    if(p.d>0){p.d--;return true}
    if(p.t==="h"){p.y+=p.vy;p.ph+=.05;p.x+=Math.sin(p.ph)*.7;p.l-=.0035;if(p.l<=0||p.y<-40||p.y>H+40)return false;x.globalAlpha=Math.min(p.l*1.5,.9);x.fillStyle=p.c;heart(p.x,p.y,p.s)}
    else if(p.t==="s"){p.l-=.014;if(p.l<=0)return false;x.globalAlpha=1;x.fillStyle=p.c;star(p.x,p.y,p.s*Math.sin(p.l*Math.PI))}
    else{p.s+=3.4;p.l-=.011;if(p.l<=0)return false;x.globalAlpha=p.l*.6;x.strokeStyle=p.c;x.lineWidth=2;x.beginPath();x.arc(p.x,p.y,p.s,0,6.283);x.stroke()}
    return true});
  x.globalAlpha=1;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);


/* ---------- Constellation du prénom ---------- */
var CN={on:false,out:false,fade:1,t0:null,pts:[],pr:[]};
function buildCons(){
  var oc=document.createElement("canvas");oc.width=W;oc.height=H;var o=oc.getContext("2d");
  var fs=Math.min(W*.3,H*.26,240),NAME="Allegra";
  o.font="italic 600 "+fs+"px Fraunces,Georgia,serif";
  while(o.measureText(NAME).width>W*.88&&fs>30){fs-=6;o.font="italic 600 "+fs+"px Fraunces,Georgia,serif"}
  o.textAlign="center";o.textBaseline="middle";o.fillStyle="#fff";o.fillText(NAME,W/2,H*.36);
  var d=o.getImageData(0,0,W,H).data,step=W<600?7:9,pts,y,xx;
  do{pts=[];for(y=0;y<H;y+=step)for(xx=0;xx<W;xx+=step)if(d[(y*W+xx)*4+3]>128)pts.push({tx:xx,ty:y,sx:Math.random()*W,sy:Math.random()*H,dl:Math.random()*1500,r:2+Math.random()*2.2,ph:Math.random()*6,x:0,y:0,a:0});step+=2}while(pts.length>300);
  var lim=(step-2)*1.45,pr=[],i,j;
  for(i=0;i<pts.length&&pr.length<900;i++)for(j=i+1;j<pts.length;j++){var dx=pts[i].tx-pts[j].tx,dy=pts[i].ty-pts[j].ty;if(dx*dx+dy*dy<lim*lim)pr.push([i,j])}
  CN.pts=pts;CN.pr=pr;
}
function drawCons(t){
  if(CN.t0===null)CN.t0=t;var tt=t-CN.t0,P=CN.pts,i,p;
  if(CN.out)CN.fade=Math.max(0,CN.fade-.012);
  for(i=0;i<P.length;i++){p=P[i];var a=Math.min(Math.max((tt-p.dl)/2600,0),1),e=1-Math.pow(1-a,3);p.x=p.sx+(p.tx-p.sx)*e;p.y=p.sy+(p.ty-p.sy)*e;p.a=a}
  var lf=Math.min(Math.max((tt-4200)/1500,0),1)*CN.fade;
  if(lf>0){x.strokeStyle="#bcd9ff";x.lineWidth=1;x.globalAlpha=lf*.45;x.beginPath();CN.pr.forEach(function(q){x.moveTo(P[q[0]].x,P[q[0]].y);x.lineTo(P[q[1]].x,P[q[1]].y)});x.stroke()}
  for(i=0;i<P.length;i++){p=P[i];x.globalAlpha=CN.fade*(.55+.45*Math.sin(t/260+p.ph))*Math.min(p.a*2,1);x.fillStyle=i%7?"#fff":"#ffe9a8";star(p.x,p.y,p.r)}
  x.globalAlpha=1;
}
async function constellation(id){
  var bg="radial-gradient(90% 70% at 50% 30%,#0a1640,#02040d 80%)";
  T.fw=0;T.bloom=0;T.stars=.8;setBg(bg);
  buildCons();CN.on=true;CN.out=false;CN.fade=1;CN.t0=null;
  await wait(4600);
  if(id!==runId){CN.on=false;return}
  await scene({bg:bg,stars:.8,low:1,lines:[["Parmi toutes les étoiles du ciel…"],["…c’est toi que j’ai choisie.","big"]],hold:2000},id);
  CN.out=true;await wait(1500);CN.on=false;
}

/* ---------- Gâteau aux 19 bougies ---------- */
function cakeSVG(){
  var s='<svg viewBox="0 0 400 270" aria-hidden="true"><ellipse cx="200" cy="254" rx="192" ry="12" fill="#0b1535"/>'
   +'<rect x="20" y="170" width="360" height="82" rx="14" fill="#ffd9e4"/><rect x="20" y="170" width="360" height="16" rx="8" fill="#fff"/>'
   +'<rect x="50" y="108" width="300" height="64" rx="12" fill="#bcd9ff"/><rect x="50" y="108" width="300" height="14" rx="7" fill="#fff"/>'
   +'<text x="200" y="226" text-anchor="middle" font-size="44" font-style="italic" font-family="Fraunces,Georgia,serif" fill="#4a86e8">19 ans</text>';
  for(var i=0;i<19;i++){var cx=58+i*15.78;
    s+='<rect x="'+(cx-3)+'" y="82" width="6" height="28" rx="2" fill="'+(i%2?"#ff8fb1":"#6fa1f0")+'"/>'
     +'<ellipse class="fm" id="fm'+i+'" cx="'+cx+'" cy="74" rx="4" ry="8"/><circle class="sm" id="sm'+i+'" cx="'+cx+'" cy="64" r="5"/>'}
  return s+'</svg>';
}
function chs(t){var e=$("ch");if(e)e.textContent=t}
function stopMic(m){if(m.t)clearInterval(m.t);if(m.s)m.s.getTracks().forEach(function(k){k.stop()});if(m.a&&m.a.close)m.a.close()}
function listen(m,out){
  if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){chs("Touche le bouton pour souffler.");return}
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false}}).then(function(s){
    m.s=s;var AC3=window.AudioContext||window.webkitAudioContext;m.a=new AC3();
    var src=m.a.createMediaStreamSource(s),an=m.a.createAnalyser();an.fftSize=512;src.connect(an);
    var buf=new Uint8Array(an.fftSize),base=0,n=0,hot=0;chs("Souffle fort vers ton téléphone… ou touche le bouton");
    m.t=setInterval(function(){
      an.getByteTimeDomainData(buf);var sum=0;for(var i=0;i<buf.length;i++){var v=(buf[i]-128)/128;sum+=v*v}
      var r=Math.sqrt(sum/buf.length);
      if(n<12){base=Math.max(base,r);n++;return}
      if(r>Math.max(base*2.5,.1))hot++;else hot=0;
      if(hot>=3)out();
    },100);
  }).catch(function(){chs("Touche le bouton pour souffler.")});
}
async function cake(id){
  var c=$("cake"),mic={};
  T.fw=0;T.bloom=0;T.stars=.7;setBg("radial-gradient(90% 70% at 50% 60%,#2a1a5a,#06081f 75%)");vol(.2);
  c.innerHTML=cakeSVG()+'<p id="cp">Fais un vœu, puis souffle sur les bougies 🎂</p><div id="ch">Autorise le micro pour souffler vraiment, ou touche le bouton</div><button class="go" id="blow">Souffler les bougies</button>';
  c.classList.add("show");
  await new Promise(function(res){
    var done=false;
    function out(){if(done)return;done=true;stopMic(mic);res()}
    $("blow").onclick=out;
    listen(mic,out);
  });
  for(var k=0;k<19;k++)(function(k){setTimeout(function(){var f=$("fm"+k),s=$("sm"+k);if(f)f.classList.add("off");if(s)s.classList.add("on")},k*110)})(k);
  $("blow").style.display="none";chs("");
  await wait(2600);
  $("cp").textContent="Que tous tes vœux se réalisent, Allegra. 💙";
  T.fw=1;runFx("boom");runFx("hearts");runFx("sparkles");
  await wait(6500);
  c.classList.remove("show");vol(.8);await wait(1300);c.innerHTML="";T.fw=0;
}

/* ---------- Musique ---------- */
var AC,master,aud,st=0;
function vol(v){if(muted)return;if(aud)aud.volume=v;else if(master&&AC)master.gain.setTargetAtTime(v,AC.currentTime,.5)}
function fr(m){return 440*Math.pow(2,(m-69)/12)}
function note(m,t,g,type,a,r){var o=AC.createOscillator(),e=AC.createGain();o.type=type;o.frequency.value=fr(m);e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+a);e.gain.exponentialRampToValueAtTime(.0001,t+a+r);o.connect(e);e.connect(master);o.start(t);o.stop(t+a+r+.1)}
function music(){
  if(CONFIG.music){aud=new Audio(CONFIG.music);aud.loop=true;aud.volume=.8;var p=aud.play();if(p&&p.catch)p.catch(function(){});return}
  try{
    AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=0;
    var cv2=AC.createConvolver(),len=AC.sampleRate*3,b=AC.createBuffer(2,len,AC.sampleRate);
    for(var c=0;c<2;c++){var d=b.getChannelData(c);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5)}
    cv2.buffer=b;var wet=AC.createGain();wet.gain.value=.55;
    master.connect(AC.destination);master.connect(cv2);cv2.connect(wet);wet.connect(AC.destination);
    master.gain.linearRampToValueAtTime(.8,AC.currentTime+5);
    var ch=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],pat=[0,1,2,1,2,1,0,2];
    setInterval(function(){
      if(paused||muted)return;var t=AC.currentTime+.05,c=ch[(st>>3)&3];
      if(st%8===0)c.forEach(function(m){note(m-12,t,.05,"triangle",1.3,3.8)});
      note(c[pat[st%8]]+12,t,.11,"sine",.02,1.9);
      if(T.fw&&st%2===0)note(c[pat[(st+1)%8]]+24,t,.05,"sine",.02,1.2);
      st++;
    },430);
  }catch(e){}
}

/* ---------- Contrôles ---------- */
$("go").addEventListener("click",function(){$("poster").classList.add("hide");music();film()});
$("again").addEventListener("click",function(){T.fw=0;fw=[];film()});
$("stage").addEventListener("click",function(){skip=true});
$("bP").addEventListener("click",function(e){e.stopPropagation();paused=!paused;document.body.classList.toggle("paused",paused);this.textContent=paused?"▶":"⏸";
  document.querySelectorAll("#ph video").forEach(function(v){paused?v.pause():v.play()});
  if(aud)paused?aud.pause():aud.play();if(AC)paused?AC.suspend():AC.resume()});
$("bS").addEventListener("click",function(e){e.stopPropagation();muted=!muted;this.textContent=muted?"🔇":"🔊";
  if(aud)aud.muted=muted;if(master)master.gain.setTargetAtTime(muted?0:.8,AC.currentTime,.3)});

/* ---------- Verrouillage jusqu'au jour J ----------
   Par défaut le film s'ouvre le 13 novembre 2026 à minuit (heure de l'appareil).
   Pour changer : ajoute dans config.js  unlock:[2026,10,13,0,0]  (mois : 0 = janvier)
   Pour désactiver : unlock:null   |   Pour tester : ajoute ?test à la fin de l'adresse */
var U=("unlock" in CONFIG)?CONFIG.unlock:[2026,10,13,0,0];
var L=$("lock"),target=U?new Date(U[0],U[1],U[2],U[3]||0,U[4]||0).getTime():0;
if(!U||location.search.indexOf("test")>-1||Date.now()>=target){
  L.style.transition="none";L.classList.add("hide");
}else{
  var tick=function(){
    var d=target-Date.now();
    if(d<=0){clearInterval(tt);L.classList.add("hide");setTimeout(function(){runFx("sparkles");runFx("hearts")},900);return}
    var j=Math.floor(d/864e5),h=Math.floor(d%864e5/36e5),m=Math.floor(d%36e5/6e4),s=Math.floor(d%6e4/1e3);
    $("lc").innerHTML=(j?'<div><b>'+j+'</b><span>jour'+(j>1?'s':'')+'</span></div>':'')+'<div><b>'+h+'</b><span>heures</span></div><div><b>'+m+'</b><span>min</span></div><div><b>'+s+'</b><span>sec</span></div>';
  };
  var tt=setInterval(tick,1000);tick();
}
})();

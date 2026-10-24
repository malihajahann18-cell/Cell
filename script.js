const INFO={
 all:{t:"The Cell",s:"OVERVIEW",d:"A cell is the smallest unit of life. Inside its membrane, every organelle has its own job. Drag to rotate, pinch to zoom, and tap a button below to fly to an organelle.",f:"A human body has roughly 30 trillion cells."},
 nuc:{t:"Nucleus",s:"NUCLEUS",d:"The control centre of the cell. It holds the DNA, and the nucleolus inside builds the parts of ribosomes.",f:"The DNA in one cell, stretched out, is about 2 metres long.",
  does:["Stores the cell’s DNA","Controls which genes are switched on or off","Builds ribosome parts in the nucleolus","Copies DNA before the cell divides"],
  not:["Doesn’t make ATP: that’s the mitochondria","Doesn’t assemble most proteins: ribosomes do","Doesn’t digest waste"]},
 mit:{t:"Mitochondria",s:"MITOCHONDRION · FULL STRUCTURE",d:"The powerhouse of the cell. Two membranes wrap it: the inner one folds into cristae, where most ATP is made. The fluid inside is the matrix, which holds its own small ring of DNA. Drag to rotate it and read the labels.",f:"Mitochondrial DNA is inherited almost entirely from the mother.",
  does:["Makes most of the cell’s ATP (energy) by oxidative phosphorylation","Runs the Krebs cycle and burns fatty acids for fuel","Stores calcium and helps control calcium signals","Triggers controlled cell death (apoptosis) in damaged cells","Releases heat, for example in brown fat","Makes a few of its own proteins (13 in humans) from its own DNA"],
  not:["Doesn’t create energy from nothing: it converts energy from food","Doesn’t do photosynthesis: that’s chloroplasts in plants","Doesn’t do glycolysis: that happens in the cytoplasm","Doesn’t hold most of the cell’s DNA: the nucleus does","Doesn’t sort or ship proteins: that’s the Golgi","Doesn’t digest waste: that’s lysosomes"]},
 gol:{t:"Golgi Apparatus",s:"GOLGI BODY",d:"The cell’s post office. It receives proteins and lipids, modifies them, sorts them and ships them out in vesicles.",f:"Camillo Golgi first described it in 1898.",
  does:["Adds sugars and other tags to proteins","Sorts molecules by destination","Packs them into vesicles for delivery","Packages enzymes into lysosomes"],
  not:["Doesn’t make proteins from scratch","Doesn’t produce ATP","Doesn’t store DNA"]},
 er:{t:"ER & Ribosomes",s:"ENDOPLASMIC RETICULUM",d:"The ER is the cell’s factory corridor. The small yellow dots on it are ribosomes, which build proteins.",f:"ER membrane can make up over half of all the membrane in a cell.",
  does:["Ribosomes read mRNA and build proteins","Rough ER folds new proteins","Smooth ER makes lipids","Stores calcium"],
  not:["Doesn’t contain the cell’s DNA","Doesn’t make ATP","Doesn’t ship proteins out: the Golgi does"]}
};
INFO.chl={t:"Chloroplast",s:"PLANT CELLS ONLY",d:"Where plants capture sunlight. Stacks of discs called grana hold chlorophyll, which turns light, water and CO₂ into sugar and oxygen.",f:"Chloroplasts have their own DNA, just like mitochondria.",does:["Photosynthesis: makes sugar from light","Releases oxygen","Stores starch temporarily"],not:["Doesn’t replace mitochondria: plants need both","Doesn’t exist in animal cells","Doesn’t hold the cell’s main DNA"]};
INFO.vac={t:"Central Vacuole",s:"PLANT CELLS ONLY",d:"A huge water-filled sac that can fill most of a plant cell. Its pressure keeps the cell firm.",f:"A wilting plant has lost water from its vacuoles.",does:["Stores water, sugars and ions","Keeps the cell firm (turgor pressure)","Stores waste and pigments"],not:["Doesn’t make ATP","Doesn’t make proteins","Doesn’t hold DNA"]};
const NAV=[["all","Overview"],["nuc","Nucleus"],["mit","Mitochondria"],["gol","Golgi"],["er","ER & Ribosomes"],["chl","Chloroplast",1],["vac","Vacuole",1]];

const cv=document.getElementById("c");
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x02101a);
scene.fog=new THREE.FogExp2(0x03182a,0.016);
const cam=new THREE.PerspectiveCamera(60,1,0.1,400);
scene.add(new THREE.AmbientLight(0x7fd8e8,0.55));
const L1=new THREE.PointLight(0x5eead4,1.4,120);L1.position.set(20,25,20);scene.add(L1);
const L2=new THREE.PointLight(0xff7ac8,1.1,120);L2.position.set(-25,-10,-20);scene.add(L2);

const rnd=(a,b)=>a+Math.random()*(b-a);
const mat=(c,o={})=>new THREE.MeshPhongMaterial(Object.assign({color:c,shininess:80,transparent:true},o));
const pick=[];

// membrane
const mem=new THREE.Mesh(new THREE.SphereGeometry(44,48,48),mat(0x2cc4e8,{opacity:.13,side:THREE.BackSide,wireframe:false}));
scene.add(mem);
const memGrid=new THREE.Mesh(new THREE.IcosahedronGeometry(44.2,3),new THREE.MeshBasicMaterial({color:0x5eead4,wireframe:true,transparent:true,opacity:.07}));
scene.add(memGrid);

// nucleus
const nuc=new THREE.Group();nuc.userData.id="nuc";
const ng=new THREE.IcosahedronGeometry(6.5,4);
const np=ng.attributes.position;
for(let i=0;i<np.count;i++){const v=new THREE.Vector3().fromBufferAttribute(np,i);const k=1+0.05*Math.sin(v.x*1.3)*Math.cos(v.y*1.1+v.z);v.multiplyScalar(k);np.setXYZ(i,v.x,v.y,v.z);}
ng.computeVertexNormals();
const nShell=new THREE.Mesh(ng,mat(0x5b7cff,{opacity:.4,emissive:0x1a2a88}));
const nuclo=new THREE.Mesh(new THREE.SphereGeometry(2.2,24,24),mat(0xff6b9a,{emissive:0x661133}));
const chrom=new THREE.Mesh(new THREE.TorusKnotGeometry(3.2,.35,120,10,2,3),mat(0xa5f3fc,{emissive:0x155e75,opacity:.85}));
nuc.add(nShell,nuclo,chrom);scene.add(nuc);
nuc.traverse(o=>{if(o.isMesh)o.userData.id="nuc"});

// mitochondria
const mitG=new THREE.Group();mitG.position.set(18,-4,-10);
const mits=[],lab=[];
function makeMito(sc,x,y,z,ry){
 const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(sc);g.rotation.y=ry;
 const om=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),mat(0xff8a3d,{opacity:.3,emissive:0x5a2000,depthWrite:false}));om.scale.set(6,2.6,2.6);
 const im=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),mat(0xffc07a,{opacity:.22,emissive:0x7a3b00,depthWrite:false}));im.scale.set(5.5,2.2,2.2);
 g.add(om,im);
 for(let i=-4;i<=4;i++){const w=Math.sqrt(1-(i/5)**2);
  const c=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.12,24),mat(0xff5a36,{emissive:0x7a1a00,opacity:.92}));
  c.rotation.z=Math.PI/2;c.position.set(i*1.1,(i%2?.5:-.5)*w,0);c.scale.set(1.5*w,1,1.5*w);g.add(c);}
 const gp=[];for(let k=0;k<90;k++){const a=rnd(0,6.28),b=Math.acos(rnd(-1,1)),r=Math.cbrt(Math.random())*.9;gp.push(5.2*r*Math.sin(b)*Math.cos(a),2*r*Math.cos(b),2*r*Math.sin(b)*Math.sin(a));}
 const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.Float32BufferAttribute(gp,3));
 g.add(new THREE.Points(gg,new THREE.PointsMaterial({color:0xfff0c8,size:.16})));
 const dn=new THREE.Mesh(new THREE.TorusGeometry(.45,.07,8,24),mat(0x7dd3fc,{emissive:0x155e75}));dn.position.set(-1.8,-.3,.3);dn.rotation.x=1;g.add(dn);
 mitG.add(g);mits.push(g);return g;
}
const hero=makeMito(1,0,0,0,.3);makeMito(.4,-11,-6,7,1.2);makeMito(.35,9,7,-6,2.4);
[["Outer membrane",2.6,2.36,0],["Inner membrane",-2.4,1.95,0],["Cristae",0,-1.3,.2],["Matrix",1.6,.3,.6],["mtDNA",-1.8,-.3,.3]].forEach(([n,x,y,z])=>{
 const o=new THREE.Object3D();o.position.set(x,y,z);hero.add(o);
 const el=document.createElement("div");el.className="lb";el.textContent=n;el.style.opacity=0;document.body.appendChild(el);lab.push({o,el});
});
const lv=new THREE.Vector3();
function updLabels(){const on=cur==="mit";lab.forEach(l=>{l.o.getWorldPosition(lv);lv.project(cam);
 l.el.style.opacity=(on&&lv.z<1)?1:0;l.el.style.transform="translate("+((lv.x+1)/2*innerWidth)+"px,"+((1-lv.y)/2*innerHeight)+"px) translate(-50%,-50%)";});}
scene.add(mitG);
mitG.traverse(o=>{if(o.isMesh)o.userData.id="mit"});

// golgi
const gol=new THREE.Group();gol.position.set(-19,-3,10);gol.rotation.set(.5,.6,.2);
for(let i=0;i<6;i++){
 const d=new THREE.Mesh(new THREE.SphereGeometry(1,28,16),mat(new THREE.Color().setHSL(.85-i*.02,.7,.6),{opacity:.8,emissive:0x441144}));
 d.scale.set(5-Math.abs(i-2.5)*.5,.35,3.6);d.position.y=i*1.3-3.2;gol.add(d);
 for(let k=0;k<4;k++){const v=new THREE.Mesh(new THREE.SphereGeometry(.28,10,10),mat(0xffb3f0,{emissive:0x662266}));
  const a=rnd(0,6.28);v.position.set(Math.cos(a)*6.3,i*1.3-3.2+rnd(-.4,.4),Math.sin(a)*4.3);gol.add(v);}
}
scene.add(gol);
gol.traverse(o=>{if(o.isMesh)o.userData.id="gol"});

// ER + ribosomes
const er=new THREE.Group();er.position.set(0,0,0);
const rp=[];
for(let s=0;s<7;s++){
 const pts=[];const ph=s*.9;
 for(let i=0;i<=90;i++){const a=i/90*Math.PI*4;const lat=Math.sin(a*1.5+ph)*.75;const r=10.5+Math.sin(a*4+ph)*.9+s*.35;
  pts.push(new THREE.Vector3(r*Math.cos(lat)*Math.cos(a),r*Math.sin(lat)*1.1,r*Math.cos(lat)*Math.sin(a)));}
 const cur=new THREE.CatmullRomCurve3(pts);
 const t=new THREE.Mesh(new THREE.TubeGeometry(cur,160,.55,8,false),mat(0x4ade80,{opacity:.55,emissive:0x0a3d1a}));
 er.add(t);
 for(let i=0;i<70;i++){const p=cur.getPoint(Math.random());rp.push(p.x+rnd(-.9,.9),p.y+rnd(-.9,.9),p.z+rnd(-.9,.9));}
}
const rg=new THREE.BufferGeometry();rg.setAttribute("position",new THREE.Float32BufferAttribute(rp,3));
er.add(new THREE.Points(rg,new THREE.PointsMaterial({color:0xffe14d,size:.42,sizeAttenuation:true})));
scene.add(er);
er.traverse(o=>{if(o.isMesh)o.userData.id="er"});

// floating particles (cytoplasm)
const pp=[];for(let i=0;i<500;i++){const v=new THREE.Vector3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(8,42));pp.push(v.x,v.y,v.z);}
const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(pp,3));
const parts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9ef0ff,size:.22,transparent:true,opacity:.65}));
scene.add(parts);

// vesicles
const ves=[];for(let i=0;i<22;i++){
 const m=new THREE.Mesh(new THREE.SphereGeometry(rnd(.3,.8),14,14),mat(0xc4b5fd,{opacity:.6,emissive:0x2a1a66}));
 m.userData.b=new THREE.Vector3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(14,38));m.userData.ph=rnd(0,6.28);scene.add(m);ves.push(m);
}

// plant extras
const plant=new THREE.Group();plant.visible=false;
const wall=new THREE.Mesh(new THREE.BoxGeometry(100,100,100),new THREE.MeshBasicMaterial({color:0x86efac,transparent:true,opacity:.07,side:THREE.BackSide}));
wall.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(100,100,100)),new THREE.LineBasicMaterial({color:0x86efac,transparent:true,opacity:.6})));
plant.add(wall);
const vac=new THREE.Mesh(new THREE.SphereGeometry(8,32,24),mat(0x60a5fa,{opacity:.32,emissive:0x0b2a66,depthWrite:false}));vac.position.set(-14,8,-18);plant.add(vac);
const chl=[];
[[-6,14,20,.2],[-14,16,14,1.1],[2,18,14,2.2]].forEach(([x,y,z,r])=>{
 const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(r,r*1.3,0);
 const o=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),mat(0x22c55e,{opacity:.35,emissive:0x064e1f,depthWrite:false}));o.scale.set(3.4,1.7,1.7);g.add(o);
 for(let a=-1;a<=1;a++)for(let b=0;b<4;b++){const dk=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.14,16),mat(0x15803d,{emissive:0x0a3d1a}));dk.position.set(a*1.3,b*.28-.4,0);g.add(dk);}
 plant.add(g);chl.push(g);
});
scene.add(plant);

// camera rig
const FOCUS={
 all:{t:new THREE.Vector3(0,0,0),r:40},
 nuc:{t:new THREE.Vector3(0,0,0),r:17},
 mit:{t:new THREE.Vector3(18,-4,-10),r:22},
 gol:{t:new THREE.Vector3(-19,-3,10),r:17},
 er:{t:new THREE.Vector3(8,5,6),r:13},chl:{t:new THREE.Vector3(-6,14,20),r:15},vac:{t:new THREE.Vector3(-14,8,-18),r:22}
};
let cur="all",tgt=new THREE.Vector3(),goalT=FOCUS.all.t.clone(),rad=130,goalR=40,th=.9,ph=1.25,pulse=0;
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
addEventListener("resize",size);size();

const chipsEl=document.getElementById("chips"),card=document.getElementById("card");
NAV.forEach(([k,l,pl])=>{const b=document.createElement("button");b.textContent=l;b.dataset.k=k;if(pl){b.hidden=true;b.dataset.pl=1;}
 b.className="chip px-4 py-2 rounded-full";b.onclick=()=>go(k);chipsEl.appendChild(b);});
function go(k,first){
 cur=k;tone(520+k.length*40,.18);mission=false;pm.visible=trail.visible=false;goalT=FOCUS[k].t.clone();goalR=FOCUS[k].r*(k==="mit"&&cam.aspect<1?1.35:1);pulse=1;
 [...chipsEl.children].forEach(c=>c.classList.toggle("on",c.dataset.k===k));
 const on=[...chipsEl.children].find(c=>c.dataset.k===k);on&&on.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
 const swap=()=>{const i=INFO[k];t.textContent=i.t;s.textContent=i.s;d.textContent=i.d;f.textContent="💡 "+i.f;x.innerHTML=i.does?'<div class="mt-3 grid gap-3"><div><p class="text-[11px] tracking-widest mb-1" style="color:#6ee7b7">WHAT IT DOES</p><ul class="text-xs space-y-1 opacity-90">'+i.does.map(v=>"<li>✓ "+v+"</li>").join("")+'</ul></div><div><p class="text-[11px] tracking-widest mb-1" style="color:#fda4af">WHAT IT DOES NOT DO</p><ul class="text-xs space-y-1 opacity-90">'+i.not.map(v=>"<li>✗ "+v+"</li>").join("")+"</ul></div></div>":"";card.scrollTop=0;card.classList.remove("swap");};
 if(first)swap();else{card.classList.add("swap");setTimeout(swap,380);}
}
const x=document.getElementById("x"),t=document.getElementById("t"),s=document.getElementById("s"),d=document.getElementById("d"),f=document.getElementById("f");
setTimeout(()=>go("all",true),50);

// input: drag orbit, pinch zoom, tap pick
const ptrs=new Map();let moved=0,pd=0,down=null;
cv.addEventListener("pointerdown",e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=0;down=[e.clientX,e.clientY];if(ptrs.size==2){const a=[...ptrs.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);}});
cv.addEventListener("pointermove",e=>{
 if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);
 if(ptrs.size==1){const dx=e.clientX-p[0],dy=e.clientY-p[1];moved+=Math.abs(dx)+Math.abs(dy);th-=dx*.006;ph=Math.min(2.8,Math.max(.35,ph-dy*.006));}
 ptrs.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptrs.size==2){const a=[...ptrs.values()];const n=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);goalR=Math.min(60,Math.max(7,goalR*pd/n));pd=n;moved+=9;}
});
const up=e=>{
 if(ptrs.size==1&&moved<8&&down){
  const rc=new THREE.Raycaster(),m=new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);
  rc.setFromCamera(m,cam);const h=rc.intersectObjects([nShell,nuclo,chrom,...mitG.children.flatMap(g=>g.children),...gol.children,...er.children.filter(c=>c.isMesh)],false)[0];
  if(h&&h.object.userData.id&&h.object.userData.id!==cur&&qz.classList.contains("hidden"))go(h.object.userData.id);
 }
 ptrs.delete(e.pointerId);
};
cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",e=>ptrs.delete(e.pointerId));
cv.addEventListener("wheel",e=>{e.preventDefault();goalR=Math.min(60,Math.max(7,goalR*(1+e.deltaY*.001)));},{passive:false});

// mission
let mission=false,mu=0,mstep=-1,lastT=0;
const mcur=new THREE.CatmullRomCurve3([[6.6,0,0],[11,3,4],[9,8,10],[-4,5,12],[-14,0,11],[-19,-3,10],[-32,-6,16],[-42,-8,22]].map(a=>new THREE.Vector3(a[0],a[1],a[2])));
const pm=new THREE.Mesh(new THREE.SphereGeometry(.7,20,20),new THREE.MeshBasicMaterial({color:0xfff7a8}));pm.visible=false;
pm.add(new THREE.Mesh(new THREE.SphereGeometry(1.4,16,16),new THREE.MeshBasicMaterial({color:0xfde047,transparent:true,opacity:.25})));scene.add(pm);
const tr=new Float32Array(300),trg=new THREE.BufferGeometry();trg.setAttribute("position",new THREE.BufferAttribute(tr,3));
const trail=new THREE.Points(trg,new THREE.PointsMaterial({color:0xfde047,size:.4,transparent:true,opacity:.7}));trail.frustumCulled=false;trail.visible=false;scene.add(trail);
const MS=["1 · Nucleus: a gene is copied into mRNA, which leaves through a nuclear pore.","2 · ER: a ribosome reads the mRNA and builds the protein chain.","3 · Golgi: the protein is modified, tagged and packed into a vesicle.","4 · Exit: the vesicle fuses with the membrane and releases the protein outside the cell."];
function startMission(){endQuiz(true);mission=true;mu=0;mstep=-1;pm.visible=trail.visible=true;cur="mission";
 const p0=mcur.getPoint(0),a0=[p0.x,p0.y,p0.z];for(let i=0;i<tr.length;i++)tr[i]=a0[i%3];
 [...chipsEl.children].forEach(c=>c.classList.remove("on"));
 t.textContent="Mission: Protein Delivery";s.textContent="FOLLOW THE PROTEIN";x.innerHTML="";f.textContent="💡 Every protein your body uses follows a route like this.";goalR=9;}
function stepMission(dt){mu+=dt/28;const p=mcur.getPoint(Math.min(mu,1));pm.position.copy(p);tgt.lerp(p,.1);goalT.copy(p);
 const k=mu<.22?0:mu<.5?1:mu<.8?2:3;if(k!==mstep){mstep=k;d.textContent=MS[k];tone(330+k*110,.4,"triangle");}
 for(let i=tr.length-1;i>2;i--)tr[i]=tr[i-3];tr[0]=p.x;tr[1]=p.y;tr[2]=p.z;trg.attributes.position.needsUpdate=true;
 if(mu>=1){go("all");}}

// quiz
const QZ=[
 {q:"Which organelle are we looking at?",k:"nuc",o:["Golgi","Nucleus","Mitochondria","ER"],a:1},
 {q:"Which organelle makes most of the cell’s ATP?",o:["Nucleus","Golgi","Mitochondria","Ribosome"],a:2},
 {q:"Which organelle are we looking at?",k:"gol",o:["Golgi apparatus","Mitochondria","Nucleus","ER"],a:0},
 {q:"What do ribosomes build?",o:["Lipids","Proteins","ATP","DNA"],a:1},
 {q:"Which is NOT a job of the mitochondria?",o:["Making ATP","Storing calcium","Photosynthesis","Triggering apoptosis"],a:2},
 {q:"Which organelle are we looking at?",k:"mit",o:["Nucleus","ER","Golgi","Mitochondria"],a:3},
 {q:"Where is most of the cell’s DNA stored?",o:["Nucleus","Mitochondria","Golgi","Ribosome"],a:0},
 {q:"Which organelle are we looking at?",k:"er",o:["Mitochondria","ER & ribosomes","Nucleus","Golgi"],a:1}
];
const qz=document.getElementById("qz"),navEl=document.querySelector("nav");
let qi=0,qs=0,qt=null,qlock=false,qleft=15;
function startQuiz(){mission=false;pm.visible=trail.visible=false;qi=0;qs=0;card.style.display="none";navEl.style.display="none";qz.classList.remove("hidden");showQ();}
function endQuiz(silent){clearInterval(qt);qz.classList.add("hidden");card.style.display="";navEl.style.display="";if(!silent)go("all");}
function showQ(){
 clearInterval(qt);
 if(qi>=QZ.length){qz.innerHTML='<p class="text-lg font-bold">Score: '+qs+' / '+QZ.length+'</p><p class="text-sm opacity-80 mt-1">'+(qs>=7?"Cell master! 🧬":qs>=4?"Nice work, keep exploring.":"Explore the cell and try again.")+'</p><div class="flex gap-2 mt-3"><button class="glass rounded-xl px-4 py-2 text-sm" onclick="startQuiz()">Play again</button><button class="glass rounded-xl px-4 py-2 text-sm" onclick="endQuiz()">Exit</button></div>';return;}
 const q=QZ[qi];qlock=false;qleft=15;go(q.k||"all");
 qz.innerHTML='<div class="flex justify-between text-[11px] tracking-widest opacity-70"><span>Q '+(qi+1)+' / '+QZ.length+' · SCORE '+qs+'</span><button onclick="endQuiz()">✕ Exit</button></div><div class="h-1 rounded mt-2" style="background:rgba(255,255,255,.1)"><div id="tb" class="h-1 rounded" style="background:var(--accent);width:100%;transition:width 1s linear"></div></div><p class="font-semibold mt-3">'+q.q+'</p><div class="grid grid-cols-2 gap-2 mt-3">'+q.o.map((o,i)=>'<button class="opt glass rounded-xl px-3 py-2 text-sm" data-i="'+i+'" onclick="ans('+i+')">'+o+'</button>').join("")+'</div>';
 qt=setInterval(()=>{qleft--;const b=document.getElementById("tb");if(b)b.style.width=(qleft/15*100)+"%";if(qleft<=0)ans(-1);},1000);
}
function ans(i){
 if(qlock)return;qlock=true;clearInterval(qt);const q=QZ[qi];
 document.querySelectorAll(".opt").forEach(b=>{const j=+b.dataset.i;if(j===q.a)b.classList.add("ok");else if(j===i)b.classList.add("bad");});
 if(i===q.a){qs++;tone(660,.25);setTimeout(()=>tone(880,.25),120);}else tone(180,.35,"sawtooth",.05);
 setTimeout(()=>{qi++;showQ();},1200);
}

// sound
let AC=null,snd=false,dr=null;
function tone(fr,du,ty,v){if(!snd||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=ty||"sine";o.frequency.value=fr;g.gain.value=v||.08;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+du);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+du);}
document.getElementById("bs").onclick=function(){
 snd=!snd;this.textContent=snd?"🔊 Sound on":"🔇 Sound";
 if(snd&&!AC){AC=new(window.AudioContext||window.webkitAudioContext)();}
 if(snd&&AC){AC.resume();if(!dr){const g=AC.createGain();g.gain.value=.035;const lp=AC.createBiquadFilter();lp.type="lowpass";lp.frequency.value=260;lp.connect(g);g.connect(AC.destination);
  [55,55.6,82.4].forEach(fq=>{const o=AC.createOscillator();o.type="sawtooth";o.frequency.value=fq;o.connect(lp);o.start();});dr=g;}dr.gain.value=.035;tone(440,.2);}
 else if(dr)dr.gain.value=0;
};

// header buttons
let isPlant=false;
document.getElementById("bm").onclick=startMission;
document.getElementById("bq").onclick=startQuiz;
const bp=document.getElementById("bp");
bp.onclick=()=>{isPlant=!isPlant;plant.visible=isPlant;bp.textContent=isPlant?"🐾 Animal cell":"🌱 Plant cell";
 [...chipsEl.children].forEach(c=>{if(c.dataset.pl)c.hidden=!isPlant;});
 if(!isPlant&&(cur==="chl"||cur==="vac"))go("all");};

// loop
const clock=new THREE.Clock();
function loop(){
 const tm=clock.getElapsedTime();const dt=Math.min(.05,tm-lastT);lastT=tm;
 if(!ptrs.size)th+=.0012;
 if(mission)stepMission(dt);else tgt.lerp(goalT,.045);rad+=(goalR-rad)*.04;
 cam.position.set(tgt.x+rad*Math.sin(ph)*Math.cos(th),tgt.y+rad*Math.cos(ph),tgt.z+rad*Math.sin(ph)*Math.sin(th));
 cam.lookAt(tgt);
 pulse*=.96;
 nuc.rotation.y=tm*.08;chrom.rotation.x=tm*.15;nuclo.scale.setScalar(1+Math.sin(tm*1.6)*.04+(cur==="nuc"?pulse*.15:0));
 nShell.scale.setScalar(1+Math.sin(tm*.9)*.015);
 mits.forEach((g,i)=>{g.rotation.y+=.0025*(i?1.6:1);g.position.y+=Math.sin(tm*.8+i)*.003;});
 mitG.scale.setScalar(1+(cur==="mit"?Math.sin(tm*3)*.025:0));
 gol.rotation.y+=.0012;gol.children.forEach((c,i)=>{if(i%5==0)c.position.x=Math.sin(tm*.7+i)*.2;});
 er.rotation.y=tm*.025;
 parts.rotation.y=tm*.012;parts.rotation.x=tm*.006;
 ves.forEach(v=>{const b=v.userData.b,p=v.userData.ph;v.position.set(b.x+Math.sin(tm*.4+p)*2.2,b.y+Math.cos(tm*.5+p)*2.2,b.z+Math.sin(tm*.3+p*2)*2.2);});
 memGrid.rotation.y=tm*.01;chl.forEach(g=>{g.rotation.y+=.004;});
 L1.position.set(Math.cos(tm*.3)*30,20,Math.sin(tm*.3)*30);
 updLabels();R.render(scene,cam);requestAnimationFrame(loop);
}
loop();

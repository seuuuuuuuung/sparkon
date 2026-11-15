/* v44 — restored original composition, clean person outline and measured tabs. */
(() => {
  'use strict';
  const D=window.SPARKON_DATA,V=window.SPARKON_V41;
  if(!D||!V){console.error('SPARKON v41 data missing');return;}
  const GAP=1350,FADE=450;
  const DEFAULT_RECORD_URL='https://seuuuuuuuung.github.io/sparkon/record.html';
  let trackStart=0,gapStart=0,inGap=false,resultGraph=null,resultGraphId='',playlistOverrides={};
  try{playlistOverrides=JSON.parse(LS.sparkPlaylistV41||'{}')||{};}catch{}
  const songUrl=(data)=>({youtube:playlistOverrides[data.id]?.youtube||data.youtube,spotify:playlistOverrides[data.id]?.spotify||data.spotify});
  // Reuse one direct audio element; routing local file:// MP3 through
  // createMediaElementSource can silence output on opaque origins.
  const playback=new Audio();playback.preload='auto';playback.muted=false;
  let audioUnlocked=false,audioUnlocking=false,playbackStatus='재생 대기',desiredVolume=Math.max(.1,Math.min(1,Number(LS.sparkVolumeV42||1)));
  playback.addEventListener('error',()=>{playbackStatus='파일 재생 오류';playWarning='음원 파일을 확인해주세요';});
  function unlockPlayback(){
    if(audioUnlocked||audioUnlocking)return;
    audioUnlocking=true;
    playback.src='./'+D[0].audio;playback.volume=0;playback.muted=false;
    const attempt=playback.play();
    if(attempt?.then)attempt.then(()=>{audioUnlocked=true;audioUnlocking=false;playbackStatus='오디오 재생 허용됨';if(state!=='live'){playback.pause();playback.currentTime=0;}playback.volume=desiredVolume;}).catch(err=>{audioUnlocking=false;playbackStatus='재생 수락 필요: '+err.name;});
  }
  const basePressV42=press;
  press=function(){if(state==='idle'||state==='how')unlockPlayback();basePressV42();};
  const isKorean=s=>/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(String(s));
  const face=s=>isKorean(s)?"'Paperlogy', 'SparkUI', 'DejaVu Sans', 'Malgun Gothic',sans-serif":"'PP Neue Machina Inktrap', 'PP Palma', 'DejaVu Sans', 'Helvetica Neue',sans-serif";

  // Re-type every canvas-drawn screen; Latin body copy uses PP Palma.
  T=function(s,x,y,z,c,al='left',w='800',it=''){
    const family=isKorean(s)?face(s):((+w<700)?"'PP Palma', 'DejaVu Sans', 'Arial',sans-serif":face(s));
    g.save();g.font=`${it} ${w} ${z}px ${family}`;g.fillStyle=c;g.textAlign=al;g.fillText(s,x,y);g.restore();
  };
  SR.text=(c,s,x,y,size=20,color='#111',weight=700,max)=>{c.save();c.fillStyle=color;c.font=`${weight} ${size}px ${face(s)}`;if(max)c.fillText(String(s),x,y,max);else c.fillText(String(s),x,y);c.restore();};
  fitText=function(s,x,y,size,color,max,weight='700'){g.save();g.fillStyle=color;g.font=`${weight} ${size}px ${face(s)}`;g.fillText(String(s),x,y,max);g.restore();};

  idleMotion35.pause();
  idleMotion35.src='./assets/SPARKON_MOTION_v28_4K.mp4';
  idleMotion35.load();
  idleMotion35.style.objectFit='cover';
  idle=function(now){const progress=(now-screenSince34)%6400/6400,opacity=.09+.91*(.5-.5*Math.cos(progress*Math.PI*2));pill34('버튼을 눌러, 나의 첫 페스티벌을 시작하세요','PRESS TO SPARK',opacity);};

  // The v39 original illustrated HOW TO JOIN and its icon reveals remain intact.
  cv.addEventListener('click',unlockPlayback,{capture:true});

  // Local-only person segmentation. Unlike thermal luminance mapping, this
  // removes the background and never draws identifiable facial pixels.
  const segCache={},segData=window.SPARKON_SEGMENTATION_ASSETS||{};
  function segmentAsset(file){
    if(segCache[file])return segCache[file];
    const info=segData[file];if(!info)return './assets/segmentation/'+file;
    const raw=atob(info[1]),bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    return segCache[file]=URL.createObjectURL(new Blob([bytes],{type:info[0]}));
  }
  const personMask=document.createElement('canvas');personMask.width=320;personMask.height=240;
  const personCtx=personMask.getContext('2d',{willReadFrequently:true});
  let segmenter=null,segmentBusy=false,segmentLast=0,segmentedAt=0,segmentationStatus='초기화 대기',segmentationFailures=0;
  function showPersonSilhouette(maskImage){
    const mw=320,mh=240;
    personCtx.save();personCtx.clearRect(0,0,mw,mh);
    personCtx.translate(mw,0);personCtx.scale(-1,1);personCtx.drawImage(maskImage,0,0,mw,mh);personCtx.restore();
    const pixels=personCtx.getImageData(0,0,mw,mh).data;
    let minA=255,maxA=0;for(let j=3;j<pixels.length;j+=4){const a=pixels[j];minA=Math.min(minA,a);maxA=Math.max(maxA,a);}
    const useAlpha=maxA-minA>24,matte=new Uint8Array(mw*mh);
    for(let i=0;i<matte.length;i++)matte[i]=(useAlpha?pixels[i*4+3]:pixels[i*4])>=112?1:0;
    // Three-by-three majority closes small segmentation holes without softening
    // the body's outer contour.
    const smooth=matte.slice();
    for(let y=1;y<mh-1;y++)for(let x=1;x<mw-1;x++){
      let count=0;for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)count+=matte[(y+yy)*mw+x+xx];
      smooth[y*mw+x]=count>=5?1:0;
    }
    const frame=tt.createImageData(320,240),out=frame.data;
    for(let y=0;y<240;y++)for(let x=0;x<320;x++){
      const sx=x,sy=y,p=sy*mw+sx,inside=smooth[p]===1;
      let edge=false;for(let d=-2;d<=2&&!edge;d+=4){
        const nx=Math.max(0,Math.min(mw-1,sx+d)),ny=Math.max(0,Math.min(mh-1,sy+d));
        edge=smooth[sy*mw+nx]!==smooth[p]||smooth[ny*mw+sx]!==smooth[p];
      }
      const i=(y*320+x)*4;
      // One matte, two contour colors. No grain, heat-map bands, or facial details.
      if(inside&&edge){out[i]=237;out[i+1]=57;out[i+2]=146;}
      else if(!inside&&edge){out[i]=192;out[i+1]=251;out[i+2]=49;}
      else if(inside){out[i]=248;out[i+1]=145;out[i+2]=192;}
      else{out[i]=255;out[i+1]=240;out[i+2]=247;}
      out[i+3]=255;
    }
    tt.putImageData(frame,0,0);segmentedAt=performance.now();segmentationStatus='사람 외곽선 인식 중';
  }
  function initPersonSegmenter(){
    if(segmenter||segmentationFailures>2)return;
    if(typeof window.SelfieSegmentation!=='function'){segmentationStatus='모델 파일을 확인해주세요';segmentationFailures=3;return;}
    try{
      segmenter=new SelfieSegmentation({locateFile:segmentAsset});
      segmenter.setOptions({modelSelection:0});
      segmenter.onResults(res=>{if(res.segmentationMask){try{showPersonSilhouette(res.segmentationMask);}catch(e){console.warn('Silhouette canvas:',e);}}});
      segmentationStatus='인물 분리 모델 로딩 중';
    }catch(err){console.warn('Segmentation initialization:',err);segmenter=null;segmentationFailures++;}
  }
  // Keep the fallback neutral. A brightness-based heatmap incorrectly mapped
  // the room and furniture as extra people, obscuring the visitor's contour.
  thermalFrame=function(now){
    if(stream&&vid.readyState>=2){
      initPersonSegmenter();
      if(segmenter&&!segmentBusy&&now-segmentLast>145){
        segmentBusy=true;segmentLast=now;
        Promise.resolve(segmenter.send({image:vid})).catch(err=>{segmentationFailures++;segmentationStatus='인물 분리 모델 오류';console.warn('Segmentation:',err);if(segmentationFailures>3)segmenter=null;}).finally(()=>{segmentBusy=false;});
      }
    }
    if(segmentedAt&&now-segmentedAt<1350)return;
    // Never expose the old noisy heat-map when person separation is loading or
    // unavailable; it was the source of the dense, unrecognizable filter.
    if(now-thermalLast>200){thermalLast=now;tt.fillStyle='#fff0f7';tt.fillRect(0,0,320,240);}
  };
  const previousDrawStage=drawStage;
  function centeredInk(text,x,y,w,h,background,foreground,size){
    g.save();g.fillStyle=background;g.fillRect(x,y,w,h);
    g.font=`900 ${size}px 'PP Neue Machina Inktrap','Pretendard','DejaVu Sans',sans-serif`;
    const metrics=g.measureText(text);
    const left=metrics.actualBoundingBoxLeft||0,right=metrics.actualBoundingBoxRight||metrics.width;
    const ascent=metrics.actualBoundingBoxAscent||size*.75,descent=metrics.actualBoundingBoxDescent||0;
    g.textAlign='left';g.fillStyle=foreground;
    g.fillText(text,x+w/2+(left-right)/2,y+h/2+(ascent-descent)/2);
    g.restore();
  }
  drawStage=function(now){previousDrawStage(now);
    // Visual-ink centering (not just text advance-width centering).
    centeredInk('SPARK STAGE',27,59,162,36,V.lime,V.ink,18);
    const current=sessionAlbums[albumIndex],ratio=current?Math.max(0,Math.min(1,(now-trackStart)/(current.duration*1000))):0;
    // A clearly visible hot-pink playback rule below, OUTSIDE the stage clip.
    const bx=32,by=662,bw=934,progress=inGap?1:ratio;
    g.save();g.fillStyle='rgba(237,57,146,.23)';g.fillRect(bx,by,bw,7);
    g.fillStyle=V.pink;g.fillRect(bx,by,bw*progress,7);
    if(progress>0.01){g.fillStyle=V.pink;g.beginPath();g.arc(bx+bw*progress,by+3.5,6.5,0,Math.PI*2);g.fill();}
    g.restore();
    // Leave the artwork unobstructed; quiet single-line current-track label.
    const song=sessionAlbums[albumIndex];if(song&&state==='live'){
      T('NOW PLAYING',43,690,13,V.pink,'left','800');
      fitText(inGap?'잠시 후 다음 무대가 시작됩니다':song.artist+'  —  '+song.title,171,690,15,V.ink,650,'700');
    }
  };
  const previousDrawYou=drawYou;
  drawYou=function(t){previousDrawYou(t);
    centeredInk('YOUR SPARK',936,157,164,33,V.pink,'#fff',18);
  };

  function playTrack(i,now){
    if(aud){aud.pause();aud.volume=desiredVolume;}
    albumIndex=i;inGap=false;trackStart=now;
    const song=sessionAlbums[i];aud=playback;aud.muted=false;
    aud.src='./'+song.audioPath;aud.load();aud.volume=.02;
    const promise=aud.play();if(promise?.then)promise.then(()=>{audioUnlocked=true;playbackStatus='재생 중: '+song.artist;playWarning='';}).catch(err=>{
      console.error('Track play blocked',err);playbackStatus='재생 실패: '+err.name;
      playWarning='음원 재생이 차단됐습니다. 관리자에서 소리 테스트를 해주세요.';
    });
  }
  playAlbum=function(i){playTrack(i,performance.now());};
  startLive=function(now){
    const picked=[...D];for(let i=picked.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[picked[i],picked[j]]=[picked[j],picked[i]];}
    sessionAlbums=picked.slice(0,3).map(s=>({...s,artist:s.name,title:s.song,artistId:s.id,duration:s.seconds,audioPath:s.audio}));
    albumStats=sessionAlbums.map(s=>({artist:s.artist,title:s.title,artistId:s.id,duration:s.duration,start:0,curve:Array(12).fill(0),sum:0,valid:0,moving:0,peak:0,peakT:0,samples:0}));
    previewMode=false;totalSeconds=sessionAlbums.reduce((a,s)=>a+s.duration,0)+(sessionAlbums.length-1)*GAP/1000;
    state='live';t0=now;TR={};E_=0;mic=[];playWarning='';resultGraph=null;cameraTracks={};lastHandPos=null;
    R={active:0,both:0,e:[],str:0,pk:[],max:0,pe:0,pt:0};
    playTrack(0,now);
  };
  onRes=function(r){
    const now=performance.now(),dt=Math.min(.2,Math.max(.016,(now-lastRes)/1000));lastRes=now;H_=[];
    (r.multiHandLandmarks||[]).forEach((lm,i)=>{
      const v=fistV54(lm),label=r.multiHandedness?.[i]?.label||'h'+i,pos={x:1-v.center.x,y:v.center.y};
      const old=cameraTracks[label],speed=old&&now-old.time<400?Math.hypot(pos.x-old.x,pos.y-old.y)/dt:0;
      cameraTracks[label]={...pos,time:now};fistScore=v.score;
      H_.push({lab:label,...pos,s:Math.max(.04,vdist(lm[0],lm[9])),fist:v.fist||v.score>=.54,score:v.score,lm,speed});
    });if(state==='live')track(now,dt);
  };
  track=function(now,dt){
    if(inGap||state!=='live')return;
    const a=albumStats[albumIndex];if(!a)return;
    const local=(now-trackStart)/1000;if(local<0||local>a.duration)return;
    let energy=0;let hands=0;
    H_.forEach(h=>{if(!h.fist)return;hands++;const vel=Math.min(8,Math.max(0,h.speed-.02)*5);energy=Math.max(energy,vel);
      const k=TR[h.lab]||(TR[h.lab]={v:0,up:false,ls:0});if(vel>k.v)k.up=true;else if(k.up&&k.v>.72&&now-k.ls>210){R.str++;k.ls=now;k.up=false;}k.v=vel;
    });
    E_=E_*.64+energy*.36;if(hands)R.active+=dt;if(hands>1)R.both+=dt;
    const bin=Math.min(11,Math.floor(local/a.duration*12));
    a.curve[bin]=Math.max(a.curve[bin],energy);a.samples++;a.sum+=energy*dt;if(energy>.22)a.moving+=dt;
    if(energy>a.peak){a.peak=energy;a.peakT=local;}R.max=Math.max(R.max,energy);
  };
  live=function(now){
    if(!sessionAlbums.length){toIdle();return;}
    const a=sessionAlbums[albumIndex],elapsed=now-trackStart;
    if(!inGap&&elapsed>=a.duration*1000){aud?.pause();aud&&(aud.volume=desiredVolume);if(albumIndex===sessionAlbums.length-1){endLive();return;}inGap=true;gapStart=now;}
    if(inGap&&now-gapStart>=GAP)playTrack(albumIndex+1,now);
    if(!inGap&&aud){const ms=now-trackStart,remaining=sessionAlbums[albumIndex].duration*1000-ms;aud.volume=desiredVolume*Math.max(.02,Math.min(1,ms/FADE,remaining/FADE));}
    if(now-lastRes>300){E_*=.87;H_=[];}
    drawStage(now);drawYou((now-t0)/1000);
  };
  endLive=function(){
    state='proc';aud?.pause();const rows=albumStats.map(a=>({...a,avg:V.round(a.sum/Math.max(.1,a.duration),2),ratio:V.round(a.moving/Math.max(.1,a.duration),2),peak:V.round(a.peak,2),peakT:V.round(a.peakT,1),curve:a.curve.map(n=>V.round(n,2))}));
    const winner=V.best(rows),type=V.classification(rows),metadata=V.types[type];
    rec={v:3,preview:false,artists:rows,winner,sparkType:type,type:metadata.label,typeDesc:metadata.message,activeSec:V.round(R.active,1),strokes:R.str,duration:totalSeconds};
    postRec();v30qr=null;
  };
  hostUrl=function(r){
    const base=(LS.qrBase||((location.protocol==='https:')?new URL('record.html',location.href).href:DEFAULT_RECORD_URL)).split('#')[0].trim();
    return base+'#'+V.encode(r);
  };
  postRec=function(){
    const num=Number(LS.sparkSerialV41||0)+1;LS.sparkSerialV41=String(num);
    rec.id=String(num).padStart(4,'0');rec.date=V.today();
    const winner=rec.artists[rec.winner];if(winner){const data=D[winner.artistId],over=songUrl(data);rec.spotify=over.spotify;rec.youtube=over.youtube;}
    try{const log=JSON.parse(LS.sparkRecs||'[]');log.push({...rec,at:Date.now()});LS.sparkRecs=JSON.stringify(log);}catch(e){console.warn('Record log is full',e);}
    const base=(LS.qrBase||((location.protocol==='https:')?new URL('record.html',location.href).href:DEFAULT_RECORD_URL)).trim();
    qrUrl=/^https:\/\/[^\s]+/i.test(base)?hostUrl(rec):'';
    state='result';resT=performance.now();
  };
  const oldToIdle=toIdle;toIdle=function(){oldToIdle();inGap=false;resultGraph=null;};

  function qrDraw(x,y,size){
    if(!qrUrl){g.fillStyle='#f7f7f8';g.fillRect(x,y,size,size);T('MOBILE QR',x+size/2,y+size/2,26,'#aaa','center');T('관리자에서 QR 주소 설정',x+size/2,y+size/2+26,13,'#888','center');return;}
    if(qrUrl!==v30qrText||!v30qr){try{v30qr=qrcode(0,'M');v30qr.addData(qrUrl);v30qr.make();v30qrText=qrUrl;}catch(e){console.error('QR error',e);v30qr=null;}}
    if(!v30qr){T('QR 생성 오류',x+size/2,y+size/2,17,V.pink,'center');return;}
    g.fillStyle='#fff';g.fillRect(x,y,size,size);
    const n=v30qr.getModuleCount(),cell=size/(n+8);
    g.fillStyle=V.ink;for(let row=0;row<n;row++)for(let col=0;col<n;col++)if(v30qr.isDark(row,col))g.fillRect(x+(col+4)*cell,y+(row+4)*cell,Math.ceil(cell+.10),Math.ceil(cell+.10));
  }
  // The exhibition screen uses the visitor's original, unmodified artwork
  // as its layout plate. Only variable data areas are replaced on the canvas.
  const recordArt=new Image();recordArt.src='./assets/record_web_reference.png';
  function cleanArea(x,y,w,h){g.fillStyle='#fff';g.fillRect(x,y,w,h);}
  result=function(now){
    const remaining=Math.max(0,60-(now-resT)/1000);if(!remaining){toIdle();return;}
    if(recordArt.complete&&recordArt.naturalWidth)g.drawImage(recordArt,0,0,W,H);
    else{g.fillStyle='#fff';g.fillRect(0,0,W,H);V.perspective(g,W,H,.3);}
    const meta=V.types[rec.sparkType],name=meta.label.split(' ');
    // Replace all of the example type, but restore the exact source-artwork
    // star afterwards; otherwise its left tip gets cut by the white mask.
    cleanArea(50,178,338,153);
    // The perspective-grid rays converge behind the type at the original
    // source artwork's vanishing point. Reconnect them inside the erased area.
    g.save();g.beginPath();g.rect(50,178,338,153);g.clip();
    g.strokeStyle='rgba(70,70,80,.038)';g.lineWidth=.65;
    for(let end=-1400;end<=1900;end+=340){g.beginPath();g.moveTo(640,208);g.lineTo(end,720);g.stroke();}
    for(let end=-1400;end<=1900;end+=360){g.beginPath();g.moveTo(640,208);g.lineTo(end,-420);g.stroke();}
    g.restore();
    // drawImage's source crop uses 2048px reference pixels, whereas the
    // exhibition canvas is 1280px. The previous v43 code mixed these spaces
    // and pasted leftover 'BURST' letters instead of the original star.
    g.save();g.beginPath();g.moveTo(417,112);
    g.bezierCurveTo(427,163,440,191,462,191);
    g.bezierCurveTo(480,191,508,180,538,173);
    g.bezierCurveTo(496,204,464,220,465,246);
    g.bezierCurveTo(467,267,471,292,479,318);
    g.bezierCurveTo(454,281,430,241,411,234);
    g.bezierCurveTo(396,227,381,230,364,232);
    g.bezierCurveTo(392,213,408,176,417,112);
    g.closePath();g.clip();
    g.drawImage(recordArt,574,178,302,350,359,111,188,219);g.restore();
    T(name[0],52,244,75,V.pink,'left',900);
    T('SPARK',52,305,75,V.pink,'left',900);
    cleanArea(51,331,408,34);
    fitText(meta.message,57,354,18,V.ink,398,800);
    // Preserve the designer's original '나의 스파크 순간' typography at its
    // original position (around x535,y366); remove only example chart content.
    cleanArea(48,386,698,215);
    if(resultGraphId!==rec.id||!resultGraph){resultGraph=document.createElement('canvas');resultGraph.width=1050;resultGraph.height=317;V.graph(resultGraph.getContext('2d'),rec.artists,1050,317,{labels:true,labelSize:25,lineWidth:4,markerSize:15});resultGraphId=rec.id;}
    g.drawImage(resultGraph,45,384,694,214);
    const selected=rec.artists[rec.winner],artist=selected&&D[selected.artistId];
    cleanArea(178,610,504,58);
    const sentence='오늘, 내 마음을 움직인 아티스트';
    T(sentence,190,650,18,V.ink,'left',800);
    g.save();g.font=`800 18px ${face(sentence)}`;
    const nameStart=Math.max(442,190+g.measureText(sentence).width+23);
    g.restore();
    fitText(artist?artist.name:'다음 스파크를 찾아보세요',nameStart,651,33,V.pink,Math.max(74,678-nameStart),900);
    qrDraw(899,291,216);
    cleanArea(949,516,154,22);
    T('MY SPARK ID  #'+rec.id,1022,529,11,'#888','center',700);
    g.fillStyle='#f4f3f5';g.beginPath();g.roundRect(898,574,219,93,45);g.fill();
    T('['+Math.ceil(remaining)+']초 후',1008,626,29,'#aaa5f6','center',900);
    T('처음 화면으로 돌아갑니다.',1008,647,13,'#aaa5f6','center',600);
  };

  // Retain the existing permission, debug, fullscreen and record-export controls.
  renderAdmin=async function(){
    await baseAdmin();const panel=document.createElement('section');
    panel.innerHTML='<h3>8팀 하이라이트 · 매회 랜덤 3팀</h3><p>8곡은 모두 기본 탑재되어 있으며 한 번의 체험에서 3곡만 재생합니다. 각 곡 14.8~28.4초, 곡 사이 1.35초 공백.</p>';
    const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    D.forEach((a,i)=>{const links=songUrl(a),section=document.createElement('div');section.style.cssText='border:1px solid #ece8eb;padding:12px;margin:8px 0;';
      section.innerHTML=`<b>${String(i+1).padStart(2,'0')} · ${esc(a.name)} — ${esc(a.song)} (${a.seconds.toFixed(1)}s)</b><br><small>추천 YouTube 영상 ID</small> <input data-field="youtube" value="${esc(links.youtube)}" maxlength="11"><br><small>Spotify 플레이리스트 ID</small> <input data-field="spotify" value="${esc(links.spotify)}" maxlength="22"><br><button type="button">연결 저장</button> <small class="message"></small>`;
      section.querySelector('button').onclick=()=>{const youtube=section.querySelector('[data-field=youtube]').value.trim(),spotify=section.querySelector('[data-field=spotify]').value.trim();if(!/^[A-Za-z0-9_-]{11}$/.test(youtube)||!/^[A-Za-z0-9]{22}$/.test(spotify)){section.querySelector('.message').textContent='YouTube(11자) / Spotify(22자) ID를 확인하세요.';return;}playlistOverrides[a.id]={youtube,spotify};LS.sparkPlaylistV41=JSON.stringify(playlistOverrides);section.querySelector('.message').textContent='저장됨 · 다음 체험 결과부터 반영';};panel.appendChild(section);
    });
    const button=document.createElement('button');button.textContent='3곡 랜덤 재생 테스트';button.onclick=()=>{toggleAdmin();startLive(performance.now());};panel.appendChild(button);
    $('adm').appendChild(panel);
    const music=$('s2');if(music)music.textContent='8곡 내장 · '+playbackStatus+' (스피커 권한 별도 요청 없음)';
    const test=$('b2');if(test){test.textContent='스피커 소리 테스트';test.onclick=async()=>{
      try{playback.pause();playback.src='./'+D[0].audio;playback.load();playback.muted=false;playback.volume=desiredVolume;await playback.play();audioUnlocked=true;
        $('s2').textContent='테스트 재생 중 · Mac 출력 장치와 음량을 확인하세요';
        setTimeout(()=>{if(state!=='live'){playback.pause();playback.currentTime=0;}},1800);
      }catch(err){$('s2').textContent='재생 실패 '+err.name+' · 주소/오디오 장치 확인';console.error(err);}
    };}
    const volumeRow=document.createElement('div');volumeRow.className='row';
    volumeRow.innerHTML=`<b>출력 음량</b><span><input id="spkVolume" type="range" min="10" max="100" value="${Math.round(desiredVolume*100)}"> <b id="spkPercent">${Math.round(desiredVolume*100)}%</b></span>`;
    panel.insertBefore(volumeRow,panel.firstChild);
    volumeRow.querySelector('input').oninput=e=>{desiredVolume=Number(e.target.value)/100;LS.sparkVolumeV42=String(desiredVolume);volumeRow.querySelector('#spkPercent').textContent=e.target.value+'%';if(!playback.paused)playback.volume=desiredVolume;};
    const qr=$('qb');if(qr&&!qr.value)qr.value=(location.protocol==='https:'?new URL('record.html',location.href).href:DEFAULT_RECORD_URL);
  };
})();

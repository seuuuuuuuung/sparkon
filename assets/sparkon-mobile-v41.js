/* SPARKON v50 mobile record: exact original SPARKON spark, refined header. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),V=window.SPARKON_V41,D=window.SPARKON_DATA;
  const portraits=['lngshot.jpg','kickflip.jpg','izna.jpg','allday.jpg','nexz.webp','meovv_vogue.jpg','cravity.jpg','kisoflife.jpg'];
  const portraitPath=id=>Number.isInteger(id)&&portraits[id]?'./assets/artists/'+portraits[id]:'';
  let record=null,exportUrl=null;
  const params=new URLSearchParams(location.search),isDemo=params.has('demo');
  try{record=V.decode(location.hash.slice(1));}catch(err){console.warn('Invalid SPARKON QR payload',err);}
  if(!record&&isDemo){
    const id=1,rows=[{artistId:id,artist:D[id].name,title:D[id].song,duration:D[id].seconds,avg:.88,ratio:.78,peak:2.4,peakT:4,curve:Array.from({length:12},(_,j)=>j===7?2.4:.5+.3*Math.sin(j*.8))}];
    record={id:'0001',date:V.today(),winner:0,sparkType:'BURST',artists:rows};
    const badge=document.createElement('div');badge.id='demo';badge.textContent='DESIGN PREVIEW';document.body.appendChild(badge);
  }
  if(!record||!record.artists?.length){$('invalid').hidden=false;return;}
  $('content').hidden=false;
  const type=V.types[record.sparkType]||V.types.PULSE;
  const selected=record.artists[record.winner],known=selected?D[selected.artistId]:null;
  const artist=known||{name:selected?.artist||'YOUR NEXT SPARK',song:selected?.title||'FIRST SPARK',hook:'새로운 음악과 만나는 순간.',description:'오늘의 첫 스파크를 기억해보세요.',videoLabel:'다음 무대 찾아보기',youtube:'',spotify:''};
  const videoId=/^[A-Za-z0-9_-]{11}$/.test(record.youtubeId||'')?record.youtubeId:artist.youtube;
  const spotifyId=/^[A-Za-z0-9]{22}$/.test(record.spotifyId||'')?record.spotifyId:artist.spotify;
  const label=type.label.split(' ');
  $('typeName').innerHTML='<span>'+label[0]+'</span><span>SPARK</span>';
  // Use the exact original four-point spark directly from the supplied web
  // record artwork. The SVG is only a crop viewport around the source image:
  // no traced path, remade gradient, or extra WAVE squiggle lines are drawn.
  // Its image node is fixed in record.html so it does not depend on JS timing.
  $('typeMessage').textContent=type.message;
  $('topDate').textContent=record.date;
  $('artistName').textContent=artist.name;
  // Long official team names must not fill or break the entire mobile artboard.
  if(artist.name.length>=12)$('artistName').style.fontSize='clamp(31px,7.0vw,49px)';
  else if(artist.name.length>=9)$('artistName').style.fontSize='clamp(36px,8.4vw,57px)';
  $('songName').textContent=artist.song;
  $('artistHook').textContent=artist.hook;
  $('artistDescription').textContent=artist.description;
  $('videoTitle').textContent=artist.videoLabel||'추천 라이브 영상 보러가기';
  $('spotifyTitle').textContent=artist.name+' 노래 더 듣기';
  $('spotifyHint').textContent=artist.song+'가 마음에 들었다면';
  $('bottomDate').textContent=record.date;
  $('recordNumber').textContent='No.'+record.id;
  $('youtubeLink').href=videoId?'https://www.youtube.com/watch?v='+videoId:'https://www.youtube.com/results?search_query='+encodeURIComponent(artist.name+' '+artist.song+' live');
  $('spotifyLink').href=spotifyId?'https://open.spotify.com/playlist/'+spotifyId:'https://open.spotify.com/search/'+encodeURIComponent(artist.name);
  const thumb=$('artistVisual');
  const portrait=portraitPath(artist.id);
  thumb.src=portrait||'./assets/logo.png';thumb.alt=artist.name+' 멤버 단체 이미지';
  thumb.onerror=()=>{thumb.hidden=true;};
  if(!selected){$('artistHook').textContent='오늘의 세 무대를 다시 만나며 나만의 스파크를 찾아보세요.';}

  function sizeCanvas(c,w,h){const dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return x;}
  function redraw(){
    const chart=$('graph'),width=chart.getBoundingClientRect().width,height=parseFloat(getComputedStyle(chart).height)||215;
    if(width>0)V.graph(sizeCanvas(chart,width,height),record.artists,width,height,{labels:true,labelSize:Math.max(11,Math.min(15,width/29)),markerSize:9,lineWidth:2.8,padX:8,top:12});
    // One lightly printed perspective grid. Lines converge at a single point,
    // following the source poster's construction rather than forming a fan of
    // unrelated line clusters behind the record typography.
    const grid=$('perspective'),gw=grid.parentElement.getBoundingClientRect().width,context=sizeCanvas(grid,gw,590);
    const vx=gw*.5,vy=Math.min(205,gw*.31);
    context.strokeStyle='rgba(45,45,52,.055)';context.lineWidth=.65;
    for(let ex=-gw*1.5;ex<=gw*2.5;ex+=gw/4.5){context.beginPath();context.moveTo(vx,vy);context.lineTo(ex,-110);context.stroke();}
    context.strokeStyle='rgba(45,45,52,.038)';
    for(let ex=-gw*1.5;ex<=gw*2.5;ex+=gw/4.5){context.beginPath();context.moveTo(vx,vy);context.lineTo(ex,475);context.stroke();}
    for(const yy of [48,128,216,310]){context.beginPath();context.moveTo(0,yy);context.lineTo(gw,yy);context.stroke();}
    const fade=context.createLinearGradient(0,180,0,490);fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(1,'#ffffff');context.fillStyle=fade;context.fillRect(0,180,gw,410);
  }
  window.addEventListener('resize',redraw,{passive:true});redraw();
  if(window.ResizeObserver)new ResizeObserver(redraw).observe($('graph').parentElement);

  function typography(c,content,x,y,size,color='#101014',weight=900,family='display',maxWidth){
    c.save();const fontFamily=family==='ko'?"'Paperlogy', 'Pretendard', sans-serif":family==='body'?"'PP Palma', 'Pretendard', Arial,sans-serif":"'PP Neue Machina Inktrap','Pretendard','Helvetica Neue',Arial,sans-serif";
    c.font=`${weight} ${size}px ${fontFamily}`;
    // Canvas fillText(..., maxWidth) can stretch mixed Korean/Latin lettering
    // into illegible shapes in some canvas renderers. Fit by font size instead.
    if(maxWidth){const actual=c.measureText(content).width;if(actual>maxWidth&&actual>0){size*=maxWidth/actual;c.font=`${weight} ${size}px ${fontFamily}`;}}
    c.fillStyle=color;c.fillText(content,x,y);c.restore();
  }
  function fillPortraitFrame(c,im,x,y,w,h){
    c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
    // Cover, not contain: preserve the photo's aspect ratio, fill every edge,
    // and crop a little more from below to keep the members' faces visible.
    const ratio=Math.max(w/im.naturalWidth,h/im.naturalHeight);
    const iw=im.naturalWidth*ratio,ih=im.naturalHeight*ratio;
    c.drawImage(im,x+(w-iw)/2,y+(h-ih)*.34,iw,ih);c.restore();
  }
  async function exportImage(){
    // Canvas text does not guarantee that CSS webfonts have been requested.
    // Explicitly load every family/weight used by the generated PNG first.
    await Promise.all([
      "900 132px 'PP Neue Machina Inktrap'",
      "700 38px 'Paperlogy'",
      "800 40px 'Paperlogy'",
      "700 28px 'PP Palma'"
    ].map(font=>document.fonts.load(font,'SPARKON 가나다 0123')));
    await document.fonts.ready;
    const c=document.createElement('canvas');c.width=1080;c.height=1701;const x=c.getContext('2d');
    // Keep the original designer's artboard, logo, star and grid intact.
    const plate=new Image();plate.src='./assets/record_saved_reference.png';
    try{await plate.decode();x.drawImage(plate,0,0,1080,1701);}catch{ x.fillStyle='#fff';x.fillRect(0,0,1080,1701);V.perspective(x,1080,540,.21);}
    const clear=(a,b,w,h)=>{x.fillStyle='#fff';x.fillRect(a,b,w,h);};
    const name=artist.name;let fs=132;
    clear(90,366,735,161);
    while(fs>53){x.font=`900 ${fs}px 'PP Neue Machina Inktrap','Pretendard',Arial,sans-serif`;if(x.measureText(name).width<738)break;fs-=3;}
    typography(x,name,94,496,fs,V.pink,900,'display',739);
    // Source art extends far into the upper right, but v43's 720..1080 crop
    // also pasted the original reference name ('KickFlip') back over the
    // selected artist. Restore only regions ABOVE that example-name baseline.
    if(plate.naturalWidth){
      x.drawImage(plate,700,0,120,340,700,0,120,340);
      x.drawImage(plate,820,0,260,440,820,0,260,440);
    }
    // The original SPARKON spark is sufficient for the WAVE result here;
    // the previous version added two distracting parallel pink squiggles.
    if(record.sparkType!=='WAVE')V.sparkAccents(x,record.sparkType,825,227,.52);
    // The original lime skewed song tab is left untouched.
    clear(94,570,522,60);
    typography(x,'나를 움직이게 만든 '+artist.name+'의 노래',99,606,27,V.ink,700,'ko',518);
    // The right edge stays locked inside the artwork margin (x=980), while
    // the lime shape expands LEFT with the title's real font-measured width.
    const songTitle=artist.song.toUpperCase(),songRight=980,maximumTagWidth=360;
    let songSize=43,songWidth;
    x.save();
    do{x.font=`900 ${songSize}px 'PP Neue Machina Inktrap','Pretendard',sans-serif`;
      songWidth=x.measureText(songTitle).width;
      if(songWidth+86<=maximumTagWidth||songSize<=27)break;
      songSize-=1;
    }while(true);
    x.restore();
    const songTagWidth=Math.min(maximumTagWidth,Math.max(206,songWidth+86));
    const songLeft=songRight-songTagWidth;
    // Erase the fixed-size lime sample tab baked into the reference image.
    // Without this mask, shorter titles reveal its old rectangle at the left.
    clear(614,550,372,82);
    x.fillStyle=V.lime;x.beginPath();
    x.moveTo(songLeft+34,557);x.lineTo(songRight,557);
    x.lineTo(songRight-35,625);x.lineTo(songLeft,625);x.closePath();x.fill();
    x.textAlign='center';
    typography(x,songTitle,(songLeft+songRight)/2,605,songSize,V.ink,900,'display',songTagWidth-74);
    x.textAlign='left';
    // The source plate contains a sample KickFlip photo. Erase its complete
    // rectangle, including the 1–3px fringes left by the old inset bounds.
    clear(96,654,889,536);
    const bx=103,by=661,bw=875,bh=522;
    let hasImage=false;
    if(portrait){const im=new Image();im.src=portrait;try{await im.decode();fillPortraitFrame(x,im,bx,by,bw,bh);hasImage=true;}catch{}}
    if(!hasImage){
      const gr=x.createLinearGradient(bx,by,bx+bw,by+bh);gr.addColorStop(0,'#ffe5f0');gr.addColorStop(.52,'#fa94c6');gr.addColorStop(1,'#dfff82');x.fillStyle=gr;x.fillRect(bx,by,bw,bh);
      x.save();x.beginPath();x.rect(bx,by,bw,bh);x.clip();V.star(x,774,830,350,V.pink,.22);V.star(x,284,980,174,V.lime,-.4);x.globalAlpha=.9;typography(x,name,126,931,Math.max(58,fs-15),'#fff',900,'display',780);x.restore();
    }
    // Clear the source-artwork's fixed peak star all the way from the photo's
    // lower edge; v43 left a disconnected pink triangle at this boundary.
    clear(97,1182,894,161);
    const wave=document.createElement('canvas');wave.width=873;wave.height=112;
    V.graph(wave.getContext('2d'),record.artists,873,112,{labels:false,padX:0,top:5,markerSize:15,lineWidth:4});
    x.drawImage(wave,102,1232);
    // Type caption is kept at the same location as the supplied artwork,
    // above the pink waveform rather than underneath it.
    x.fillStyle='#fff';x.fillRect(123,1197,295,50);
    x.save();
    x.fillStyle=V.pink;
    let typeSize=36;
    do{x.font=`italic 800 ${typeSize}px 'PP Neue Machina Inktrap','Pretendard',Arial,sans-serif`;if(x.measureText(type.label).width<=221||typeSize<=23)break;typeSize-=1;}while(true);
    x.fillText(type.label,129,1234);
    x.strokeStyle=V.pink;x.lineWidth=2;x.beginPath();x.moveTo(357,1241);x.lineTo(393,1204);x.stroke();
    x.restore();
    x.strokeStyle='#ece9ee';x.lineWidth=1;x.beginPath();x.moveTo(101,1352);x.lineTo(979,1352);x.stroke();
    // The original giant YYYY.MM.DD starts above 1463px; cover its complete
    // glyph height before drawing the actual experience date.
    clear(101,1444,884,145);
    x.textAlign='center';typography(x,record.date,540,1551,115,V.ink,900,'display',850);x.textAlign='left';
    typography(x,'No.'+record.id,110,1658,21,'#777',700,'body');
    return await new Promise((resolve,reject)=>c.toBlob(blob=>blob?resolve(blob):reject(new Error('Cannot render PNG')),'image/png'));
  }
  $('download').addEventListener('click',async()=>{
    const button=$('download');button.disabled=true;button.firstChild.textContent='이미지 만드는 중… ';
    try{const blob=await exportImage();if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=exportUrl;a.download='SPARKON_FIRST_SPARK_'+record.id+'.png';document.body.appendChild(a);a.click();a.remove();
      $('savedImage').src=exportUrl;$('preview').style.display='block';
    }catch(err){console.error(err);alert('이미지 생성 중 문제가 발생했습니다. 다시 눌러주세요.');}
    finally{button.disabled=false;button.firstChild.textContent='기록 이미지 다운로드 하기 ';}
  });
})();

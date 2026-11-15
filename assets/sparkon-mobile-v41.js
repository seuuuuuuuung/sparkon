/* SPARKON mobile record + independently designed collectible PNG. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),V=window.SPARKON_V41,D=window.SPARKON_DATA;
  let record=null,exportUrl=null;
  const params=new URLSearchParams(location.search),isDemo=params.has('demo');
  try{record=V.decode(location.hash.slice(1));}catch(err){console.warn('Invalid SPARKON QR payload',err);}
  if(!record&&isDemo){
    const ids=[0,2,1],rows=ids.map((id,i)=>({artistId:id,artist:D[id].name,title:D[id].song,duration:D[id].seconds,avg:[.21,.33,.88][i],ratio:[.36,.47,.78][i],peak:[.4,.51,2.4][i],peakT:4,curve:Array.from({length:12},(_,j)=>i===2?(j===7?2.4:.5+.3*Math.sin(j*.8)):Math.max(.12,.2+.14*Math.sin(j*1.8+i)))}));
    record={id:'0001',date:V.today(),winner:2,sparkType:'BURST',artists:rows};
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
  $('typeMessage').textContent=type.message;
  $('topDate').textContent=record.date;
  $('artistName').textContent=artist.name;
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
  if(artist.id===1){thumb.src='./assets/kickflip_reference_photo.png';}
  else if(videoId){thumb.src='https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg';thumb.onerror=()=>{thumb.hidden=true;};}else thumb.hidden=true;
  if(!selected){$('artistHook').textContent='오늘의 세 무대를 다시 만나며 나만의 스파크를 찾아보세요.';}

  function sizeCanvas(c,w,h){const dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return x;}
  function redraw(){
    const chart=$('graph'),width=chart.getBoundingClientRect().width,height=parseFloat(getComputedStyle(chart).height)||215;
    if(width>0)V.graph(sizeCanvas(chart,width,height),record.artists,width,height,{labels:true,labelSize:Math.max(9,Math.min(15,width/30)),markerSize:11,lineWidth:3});
    const grid=$('perspective'),gw=grid.parentElement.getBoundingClientRect().width;const context=sizeCanvas(grid,gw,590);V.perspective(context,gw,590,.29);
    const fade=context.createLinearGradient(0,0,0,590);fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(1,'#ffffff');context.fillStyle=fade;context.fillRect(0,0,gw,590);
  }
  window.addEventListener('resize',redraw,{passive:true});redraw();
  if(window.ResizeObserver)new ResizeObserver(redraw).observe($('graph').parentElement);

  function typography(c,content,x,y,size,color='#101014',weight=900,family='display',maxWidth){
    c.save();c.font=`${weight} ${size}px ${family==='ko'?"'Paperlogy', 'Pretendard', 'DejaVu Sans', sans-serif":family==='body'?"'PP Palma', 'DejaVu Sans', Arial,sans-serif":"'PP Neue Machina Inktrap','DejaVu Sans','Helvetica Neue',Arial,sans-serif"}`;
    c.fillStyle=color;if(maxWidth)c.fillText(content,x,y,maxWidth);else c.fillText(content,x,y);c.restore();
  }
  function cropped(c,im,x,y,w,h){const r=Math.max(w/im.naturalWidth,h/im.naturalHeight),sw=w/r,sh=h/r;c.drawImage(im,(im.naturalWidth-sw)/2,(im.naturalHeight-sh)/2,sw,sh,x,y,w,h);}
  async function exportImage(){
    await document.fonts.ready;
    const c=document.createElement('canvas');c.width=1080;c.height=1701;const x=c.getContext('2d');
    // Keep the original designer's artboard, logo, star and grid intact.
    const plate=new Image();plate.src='./assets/record_saved_reference.png';
    try{await plate.decode();x.drawImage(plate,0,0,1080,1701);}catch{ x.fillStyle='#fff';x.fillRect(0,0,1080,1701);V.perspective(x,1080,540,.21);}
    const clear=(a,b,w,h)=>{x.fillStyle='#fff';x.fillRect(a,b,w,h);};
    const name=artist.name;let fs=145;
    clear(90,366,735,161);
    while(fs>53){x.font=`900 ${fs}px 'PP Neue Machina Inktrap','DejaVu Sans',Arial,sans-serif`;if(x.measureText(name).width<738)break;fs-=3;}
    typography(x,name,94,496,fs,V.pink,900,'display',739);
    // The original lime skewed song tab is left untouched.
    clear(94,570,522,60);
    typography(x,'나를 움직이게 만든 '+artist.name+'의 노래',99,606,27,V.ink,850,'ko',518);
    x.fillStyle=V.lime;x.beginPath();x.moveTo(683,557);x.lineTo(981,557);x.lineTo(945,625);x.lineTo(680,625);x.closePath();x.fill();
    x.textAlign='center';typography(x,artist.song.toUpperCase(),833,605,43,V.ink,900,'display',250);x.textAlign='left';
    const bx=103,by=663,bw=875,bh=519;
    let hasImage=false;
    if(artist.id===1){const im=new Image();im.src='./assets/kickflip_reference_photo.png';try{await im.decode();cropped(x,im,bx,by,bw,bh);hasImage=true;}catch{}}
    if(!hasImage&&videoId){const im=new Image();im.crossOrigin='anonymous';im.src='https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg';
      try{await Promise.race([im.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('thumbnail timeout')),3000))]);const test=document.createElement('canvas');test.width=2;test.height=2;const t=test.getContext('2d');t.drawImage(im,0,0,2,2);t.getImageData(0,0,1,1);cropped(x,im,bx,by,bw,bh);hasImage=true;}catch{}
    }
    if(!hasImage){
      const gr=x.createLinearGradient(bx,by,bx+bw,by+bh);gr.addColorStop(0,'#ffe5f0');gr.addColorStop(.52,'#fa94c6');gr.addColorStop(1,'#dfff82');x.fillStyle=gr;x.fillRect(bx,by,bw,bh);
      x.save();x.beginPath();x.rect(bx,by,bw,bh);x.clip();V.star(x,774,830,350,V.pink,.22);V.star(x,284,980,174,V.lime,-.4);x.globalAlpha=.9;typography(x,name,126,931,Math.max(58,fs-15),'#fff',900,'display',780);x.restore();
    }
    clear(97,1192,894,165);
    typography(x,type.label,128,1238,36,V.pink,900,'display');
    const wave=document.createElement('canvas');wave.width=873;wave.height=135;
    V.graph(wave.getContext('2d'),record.artists,873,135,{labels:false,padX:0,top:4,markerSize:15,lineWidth:4});
    x.drawImage(wave,102,1215);
    clear(108,1463,875,123);
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

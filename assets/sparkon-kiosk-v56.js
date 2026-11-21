/* SPARKON v55: one-artist record, scan-safe QR and exhibition idle recovery. */
(() => {
  'use strict';
  const K=window.SPARKON_V41,artists=window.SPARKON_DATA;
  if(!K||!artists)return;
  const TIMEOUT=20_000;
  let lastInteraction=performance.now(),lastState=state,qrCacheKey='',qrCanvas=null;
  function activity(){lastInteraction=performance.now();}
  ['pointerdown','keydown','wheel','touchstart','touchmove'].forEach(eventName=>{
    window.addEventListener(eventName,activity,{capture:true,passive:true});
  });
  let lastPointer=0;
  window.addEventListener('pointermove',()=>{
    const now=performance.now();
    if(now-lastPointer>150){lastPointer=now;activity();}
  },{passive:true});
  const originalFrame=frame;
  frame=function(now){
    if(state!==lastState){lastState=state;lastInteraction=now;}
    const setupOpen=!document.getElementById('adm').hidden||!document.getElementById('perm').hidden;
    if(!setupOpen&&!['idle','live','proc'].includes(state)&&now-lastInteraction>=TIMEOUT){
      // A playing highlight is allowed to reach its actual ending; static
      // screens, including the QR result, return home after 20s unattended.
      toIdle();lastState='idle';lastInteraction=now;
    }
    originalFrame(now);
  };
  // The guide is a supplied flattened artwork. Keep its layout, icons,
  // brand colors and sequential reveal; replace only the outdated step 3.
  const previousFrame=frame;
  frame=function(now){
    previousFrame(now);
    if(state!=='how')return;
    const canvas=document.getElementById('guideExact');
    if(!canvas||canvas.style.display==='none')return;
    const ctx=canvas.getContext('2d');
    const elapsed=now-screenSince34;
    const visibility=Math.min(1,Math.max(0,(elapsed-840)/550));
    ctx.save();
    // Only cover the old lettering. The light-stick handle starts at x≈1400,
    // so the previous 817px-wide white patch mistakenly erased its lower half.
    ctx.fillStyle='#fff';ctx.fillRect(626,726,715,91);
    ctx.globalAlpha=visibility;
    ctx.textAlign='left';ctx.fillStyle='#111';
    ctx.font="700 29px 'Paperlogy','Pretendard',Arial,sans-serif";
    ctx.fillText('랜덤으로 만난 아티스트의 한 곡을 즐겨주세요.',647,769);
    ctx.font="500 18px 'PP Palma','Pretendard',Arial,sans-serif";
    ctx.fillStyle='#555';
    ctx.fillText('Meet one artist and enjoy one special highlight.',648,798);
    ctx.restore();
  };
  function drawQR(x,y,size,url){
    if(!/^https:\/\//i.test(url||'')){
      g.fillStyle='#f4f3f5';g.fillRect(x,y,size,size);
      T('QR 연결 주소 확인',x+size/2,y+size/2,18,K.pink,'center',800);
      return;
    }
    if(url!==qrCacheKey||!qrCanvas){
      try{
        const qr=qrcode(0,'M');qr.addData(url);qr.make();
        const n=qr.getModuleCount(),temp=document.createElement('canvas');
        temp.width=n+8;temp.height=n+8;
        const ctx=temp.getContext('2d',{alpha:false});
        ctx.fillStyle='#fff';ctx.fillRect(0,0,temp.width,temp.height);
        ctx.fillStyle='#111114';
        for(let row=0;row<n;row++)for(let col=0;col<n;col++)if(qr.isDark(row,col))ctx.fillRect(col+4,row+4,1,1);
        qrCanvas=temp;qrCacheKey=url;
      }catch(error){console.error('SPARKON QR generation failed',error);qrCanvas=null;qrCacheKey=url;}
    }
    if(!qrCanvas){T('QR 생성 실패',x+size/2,y+size/2,19,K.pink,'center',800);return;}
    g.save();g.fillStyle='#fff';g.fillRect(x,y,size,size);
    g.imageSmoothingEnabled=false;
    g.drawImage(qrCanvas,x,y,size,size);
    g.restore();
  }
  const graphCanvas=document.createElement('canvas');
  graphCanvas.width=950;graphCanvas.height=175;
  let graphId='';
  result=function(now){
    if(!rec?.artists?.length){toIdle();return;}
    // Keep the original SPARKON palette, generous grid and spark motif.
    K.perspective(g,W,H,.34);
    g.fillStyle='rgba(255,255,255,.55)';g.fillRect(0,0,W,H);
    K.star(g,774,179,70,K.pink,.15);
    K.star(g,787,302,23,K.lime,-.2);
    const row=rec.artists[0],artist=artists[row.artistId]||artists[0];
    const name=artist.name,seconds=Math.max(0,Math.ceil((TIMEOUT-(now-lastInteraction))/1000));
    T('SPARKON MUSIC FESTIVAL',49,48,17,K.pink,'left',900);
    T('YOUR SPARK, FINALLY LIVE.',1230,48,14,K.ink,'right',700);
    g.fillStyle=K.ink;g.fillRect(49,66,1182,1);
    T('MY FIRST SPARK RECORD',53,131,47,K.ink,'left',900);
    T('오늘, 당신의 스파크가 닿은 아티스트',55,186,24,K.ink,'left',800);
    fitText(name,50,284,75,K.pink,805,'900');
    g.fillStyle=K.lime;g.beginPath();
    g.moveTo(55,310);g.lineTo(726,310);g.lineTo(706,360);g.lineTo(35,360);g.closePath();g.fill();
    fitText('FIRST STAGE   /   '+artist.song.toUpperCase(),69,344,25,K.ink,615,'900');
    T('우연히 마주친 무대가 새로운 관심의 시작이 될지도 몰라요.',55,404,18,K.ink,'left',650);
    if(graphId!==rec.id){
      graphId=rec.id;
      const c=graphCanvas.getContext('2d');c.clearRect(0,0,950,175);
      K.graph(c,rec.artists,950,175,{labels:false,top:12,padX:10,lineWidth:3,markerSize:11});
    }
    g.drawImage(graphCanvas,52,427,776,145);
    T('MY SPARK MOMENT  /  '+K.types[rec.sparkType||'PULSE'].label,57,594,15,K.pink,'left',800);
    T((rec.date||K.today())+'     /     RECORD #'+rec.id,55,662,17,K.ink,'left',700);
    g.fillStyle=K.ink;g.fillRect(853,74,1,608);
    g.fillStyle='#fff';g.fillRect(883,91,331,591);
    T('내게 도착한 인사',1048,141,25,K.ink,'center',800);
    T('A MESSAGE FOR YOU',1048,164,15,K.pink,'center',700);
    drawQR(908,188,280,qrUrl);
    T('QR을 스캔해 오늘 만난 아티스트를',1048,508,15,K.ink,'center',650);
    T('조금 더 가까이 만나보세요.',1048,533,15,K.ink,'center',650);
    T('무대 · 멤버 인사 · 추천곡 · 비하인드',1048,567,13,K.pink,'center',750);
    g.fillStyle='#f4f3f5';g.beginPath();g.roundRect(926,597,243,64,32);g.fill();
    T(seconds+'초 후 처음 화면으로 돌아갑니다.',1048,634,16,'#9d93d8','center',750);
  };
  const previousAdmin=renderAdmin;
  renderAdmin=async function(){
    await previousAdmin();
    const panel=document.createElement('section');
    panel.style.cssText='border:1px solid #ed3992;padding:14px 16px;margin:18px 0;background:#fff7fb';
    const raw=(LS.qrBase||(
      location.protocol==='https:'?new URL('record.html',location.href).href:
      'https://seuuuuuuuung.github.io/sparkon/record.html'
    )).trim();
    const title=document.createElement('b');title.textContent='모바일 QR 실기기 확인 · 20초 무반응 초기화';
    const paragraph=document.createElement('p');
    paragraph.textContent='새 record.html과 assets 파일을 아래 HTTPS 주소에 배포한 다음, 휴대폰으로 접속되는지 확인하세요. 로컬 ZIP만 교체하면 공개 웹페이지는 자동 갱신되지 않습니다.';
    panel.append(title,paragraph);
    try{
      const url=new URL(raw);
      if(url.protocol!=='https:')throw Error('HTTPS only');
      url.hash='';url.searchParams.set('demo','1');
      const link=document.createElement('a');
      link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';
      link.style.cssText='display:inline-block;padding:10px 13px;background:#ed3992;color:#fff;text-decoration:none;font-weight:800';
      link.textContent='모바일 기록지 배포 테스트 열기 ↗';
      panel.appendChild(link);
    }catch{
      const warning=document.createElement('p');
      warning.textContent='관리자 QR 기본 주소를 실제 https://.../record.html 로 입력해 주세요.';
      panel.appendChild(warning);
    }
    document.getElementById('adm').appendChild(panel);
  };
  // Expose a read-only diagnostic for the exhibition staff.
  window.SPARKON_V55_STATUS=()=>({state,artist:rec?.artists?.[0]?.artist||null,qrUrl,qrReady:!!qrCanvas,timeoutSeconds:20});
})();

/* Shared record model used by kiosk, mobile and the downloadable image. */
(function(root){
  const pink='#ed3992',lime='#c0fb31',ink='#111114';
  const types={
    BURST:{label:'BURST SPARK',message:'결정적인 순간, 당신의 스파크가 터졌어요.'},
    WAVE:{label:'WAVE SPARK',message:'당신의 스파크가 파도처럼 넘실거렸어요.'},
    PULSE:{label:'PULSE SPARK',message:'음악을 따라 당신만의 리듬을 이어갔어요.'},
    RISE:{label:'RISE SPARK',message:'음악이 흐를수록 당신의 스파크가 커졌어요.'}
  };
  const clamp=(x,min=0,max=1)=>Math.min(max,Math.max(min,x));
  const round=(n,d=2)=>Math.round((Number(n)||0)*Math.pow(10,d))/Math.pow(10,d);
  const pad=n=>String(n).padStart(2,'0');
  function today(){const d=new Date();return d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate());}
  function classification(rows){
    const v=rows.flatMap(r=>r.curve||[]).map(x=>Number(x)||0),avg=v.reduce((s,x)=>s+x,0)/Math.max(1,v.length);
    const peak=Math.max(0,...v);if(peak>=1&&peak>avg*2.7)return'BURST';
    if(v.length>=8){const q=Math.floor(v.length/2);const early=v.slice(0,q).reduce((s,x)=>s+x,0)/q;const late=v.slice(q).reduce((s,x)=>s+x,0)/(v.length-q);if(late>Math.max(.18,early*1.45))return'RISE';}
    let up=0,down=0;for(let i=1;i<v.length;i++){if(v[i]-v[i-1]>.28)up++;if(v[i]-v[i-1]<-.28)down++;}
    if(up>=3&&down>=3)return'WAVE';return'PULSE';
  }
  function strength(r){return (Number(r.avg)||0)*.66+(Number(r.ratio)||0)*1.05+(Number(r.peak)||0)*.085;}
  function best(rows){let w=-1,b=.018;rows.forEach((r,i)=>{const n=strength(r);if(n>b){b=n;w=i;}});return w;}
  function encode(data){
    const rows=data.artists.map(r=>[r.artistId,Math.round(r.duration*10),Math.round(r.avg*100),Math.round(r.ratio*100),Math.round(r.peak*100),Math.round(r.peakT*10),(r.curve||[]).map(x=>Math.round(clamp(x,0,8)*4).toString(36)).join('')]);
    const raw=['S3',data.id,data.date,data.winner,data.sparkType,rows,data.spotify||'',data.youtube||''];
    return btoa(JSON.stringify(raw)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode(fragment){
    if(!fragment)return null;
    const val=JSON.parse(atob(fragment.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(fragment.length/4)*4,'=')));
    if(val[0]==='S3'){
      const rows=(val[5]||[]).map(r=>{const def=root.SPARKON_DATA?.[r[0]]||{};return {...def,artistId:r[0],artist:def.name||'ARTIST',title:def.song||'TRACK',duration:r[1]/10,avg:r[2]/100,ratio:r[3]/100,peak:r[4]/100,peakT:r[5]/10,curve:String(r[6]||'').split('').map(x=>parseInt(x,36)/4)};});
      return{id:String(val[1]),date:String(val[2]),winner:Number(val[3]),sparkType:types[val[4]]?val[4]:classification(rows),artists:rows,spotifyId:String(val[6]||''),youtubeId:String(val[7]||'')};
    }
    if(val[0]==='S2'){
      const rows=(val[4]||[]).map(a=>{const def=(root.SPARKON_DATA||[]).find(d=>d.name.toLowerCase()===String(a[0]).toLowerCase())||{};return{...def,artistId:def.id??-1,artist:String(a[0]),title:String(a[1]),duration:Number(a[2])||6,avg:Number(a[3])||0,ratio:Number(a[4])||0,peak:Number(a[5])||0,peakT:Number(a[6])||0,curve:(a[9]||[]).map(n=>n/10)};});
      const legacy={BURST:'BURST',FLOW:'WAVE',RISING:'RISE',WIDE:'PULSE',FIRST:'PULSE'};
      return{id:String(val[1]),date:today(),winner:Number(val[2]),sparkType:legacy[val[6]]||classification(rows),artists:rows,spotifyId:'',youtubeId:''};
    }
    return null;
  }
  function star(c,x,y,r,color=pink,rotation=0){
    c.save();c.translate(x,y);c.rotate(rotation);c.beginPath();c.moveTo(0,-r);c.bezierCurveTo(r*.18,-r*.19,r*.21,-r*.18,r,0);c.bezierCurveTo(r*.20,r*.16,r*.18,r*.19,0,r);c.bezierCurveTo(-r*.18,r*.20,-r*.18,r*.18,-r,0);c.bezierCurveTo(-r*.19,-r*.18,-r*.18,-r*.20,0,-r);const grad=c.createRadialGradient(-r*.12,-r*.12,0,0,0,r);grad.addColorStop(0,color==pink?'#ff94c5':'#ebffaf');grad.addColorStop(.55,color==pink?'#ff5fa9':'#d7ff72');grad.addColorStop(1,color);c.fillStyle=grad;c.fill();c.restore();
  }
  function perspective(c,w,h,vanishY=.1){
    c.save();c.strokeStyle='rgba(22,22,30,.073)';c.lineWidth=1;const cx=w*.56,cy=h*vanishY;
    for(let x=-w;x<w*2;x+=w/9){c.beginPath();c.moveTo(cx,cy);c.lineTo(x,h);c.stroke();}
    for(let y=0;y<h;y+=h/13){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
    c.restore();
  }
  function graph(c,rows,w,h,opts={}){
    c.save();c.clearRect(0,0,w,h);
    const padX=opts.padX??24,top=opts.top??16,baseline=h-(opts.labels===false?18:64),innerW=w-padX*2;
    const total=rows.reduce((s,a)=>s+(a.duration||1),0)||1;
    const vals=[];let pos=0;const sections=[];
    rows.forEach((r,i)=>{const duration=Number(r.duration)||1;const curve=r.curve?.length?r.curve:[0,0];sections.push({start:pos/total,end:(pos+duration)/total,row:r});curve.forEach((v,j)=>vals.push([padX+innerW*((pos+duration*j/Math.max(1,curve.length-1))/total),Number(v)||0]));pos+=duration;});
    const peak=Math.max(.5,...vals.map(p=>p[1]));const points=vals.map(([x,y])=>[x,baseline-((y/peak)*Math.max(15,baseline-top-19))]);
    if(points.length){const area=c.createLinearGradient(0,top,0,baseline);area.addColorStop(0,'rgba(237,57,146,.32)');area.addColorStop(1,'rgba(237,57,146,0)');c.beginPath();c.moveTo(points[0][0],baseline);points.forEach((p,i)=>i===0?c.lineTo(p[0],p[1]):c.lineTo(p[0],p[1]));c.lineTo(points[points.length-1][0],baseline);c.closePath();c.fillStyle=area;c.fill();c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=pink;c.lineWidth=opts.lineWidth||4;c.lineCap='round';c.lineJoin='round';c.stroke();}
    const highIndex=vals.findIndex(p=>p[1]===Math.max(...vals.map(v=>v[1])));if(highIndex>=0&&vals[highIndex][1]>.15){const p=points[highIndex];star(c,p[0],p[1],opts.markerSize||14);if(opts.peakLabel){c.fillStyle=pink;c.font=`700 ${opts.labelSize||17}px 'Paperlogy',sans-serif`;c.fillText('✦ 나의 스파크 순간',Math.min(w-205,p[0]+17),Math.max(23,p[1]-18));}}
    sections.forEach((s,i)=>{const x=padX+innerW*s.end;if(i<sections.length-1){c.strokeStyle='#dcdce2';c.lineWidth=1;c.beginPath();c.moveTo(x,top+7);c.lineTo(x,h-(opts.labels===false?8:7));c.stroke();}if(opts.labels!==false){const mid=padX+innerW*(s.start+s.end)/2;c.textAlign='center';const artist=s.row.artist||s.row.name||'';const song=s.row.title||s.row.song||'';const labelSize=opts.labelSize||17;c.fillStyle=ink;c.font=`800 ${labelSize}px 'PP Neue Machina Inktrap', 'DejaVu Sans',sans-serif`;c.fillText(artist,mid,h-32,innerW*(s.end-s.start)-9);c.fillStyle=pink;c.font=`700 ${Math.max(11,labelSize-2)}px 'Paperlogy', 'DejaVu Sans',sans-serif`;c.fillText(song,mid,h-10,innerW*(s.end-s.start)-9);}});c.restore();
  }
  root.SPARKON_V41={pink,lime,ink,types,today,classification,strength,best,encode,decode,star,perspective,graph,round};
})(window);

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
  function sparkAccents(c,key,cx,cy,scale=1){
    // Small, intentional variations of the supplied four-point SPARKON spark.
    // The principal artboard star is never replaced by unrelated geometry.
    c.save();
    if(key==='BURST'){
      star(c,cx-78*scale,cy-45*scale,13*scale,lime,.2);
      star(c,cx+82*scale,cy+58*scale,9*scale,pink,-.3);
    }else if(key==='WAVE'){
      c.strokeStyle=pink;c.lineWidth=Math.max(1,2.5*scale);c.lineCap='round';
      for(let j=0;j<2;j++){
        const y=cy+(65+j*15)*scale;
        c.beginPath();c.moveTo(cx-90*scale,y);c.bezierCurveTo(cx-25*scale,y-27*scale,cx+12*scale,y+22*scale,cx+90*scale,y-8*scale);c.stroke();
      }
    }else if(key==='PULSE'){
      [-1,1].forEach(side=>{star(c,cx+side*92*scale,cy+side*12*scale,11*scale,side<0?lime:pink,side*.3);});
    }else if(key==='RISE'){
      star(c,cx-78*scale,cy+67*scale,13*scale,pink,.15);
      star(c,cx-22*scale,cy+44*scale,9*scale,lime,-.3);
      star(c,cx+80*scale,cy-64*scale,12*scale,pink,.3);
    }
    c.restore();
  }
  function perspective(c,w,h,vanishY=.1){
    c.save();c.strokeStyle='rgba(22,22,30,.073)';c.lineWidth=1;const cx=w*.56,cy=h*vanishY;
    for(let x=-w;x<w*2;x+=w/9){c.beginPath();c.moveTo(cx,cy);c.lineTo(x,h);c.stroke();}
    for(let y=0;y<h;y+=h/13){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
    c.restore();
  }
  function graph(c,rows,w,h,opts={}){
    c.save();c.clearRect(0,0,w,h);
    const n=rows.length,padX=opts.padX??18,top=opts.top??16;
    const hasLabels=opts.labels!==false,baseline=h-(hasLabels?59:13),innerW=w-padX*2;
    if(!n||innerW<=0||baseline<=top){c.restore();return{peak:null};}
    const perTrack=30,raw=[];
    function interpolate(a,t){
      const index=t*(a.length-1),j=Math.min(a.length-2,Math.floor(index)),u=index-j;
      const p0=a[Math.max(0,j-1)],p1=a[j],p2=a[j+1],p3=a[Math.min(a.length-1,j+2)];
      return Math.max(0,.5*(2*p1+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u));
    }
    rows.forEach((r,i)=>{
      const a=(r.curve?.length?r.curve:[0,0]).map(v=>Math.max(0,Math.min(6,Number(v)||0)));
      for(let j=0;j<perTrack;j++){
        const t=j/perTrack;
        raw.push({x:padX+innerW*(i+t)/n,v:interpolate(a,t)});
      }
    });
    raw.push({x:padX+innerW,v:Math.max(0,Number(rows[n-1].curve?.at(-1))||0)});
    // Smooth across track boundaries as one continuous reaction timeline.
    // This avoids the zero-width double point and vertical spikes in v44.
    const kernel=[1,2,3,4,5,4,3,2,1];
    const smoothed=raw.map((p,i)=>{
      let weighted=0,sum=0;
      for(let k=-4;k<=4;k++){const j=Math.max(0,Math.min(raw.length-1,i+k)),weight=kernel[k+4];weighted+=raw[j].v*weight;sum+=weight;}
      return{x:p.x,v:weighted/sum};
    });
    const maximum=Math.max(.42,...smoothed.map(p=>p.v));
    const room=Math.max(8,baseline-top-22);
    const pts=smoothed.map(p=>[p.x,baseline-(p.v/maximum)*room]);
    function trace(join=false){
      if(join)c.lineTo(pts[0][0],pts[0][1]);else c.moveTo(pts[0][0],pts[0][1]);
      for(let i=0;i<pts.length-1;i++){
        const prev=pts[Math.max(0,i-1)],a=pts[i],b=pts[i+1],next=pts[Math.min(pts.length-1,i+2)];
        const dx=b[0]-a[0],s0=(b[1]-prev[1])/(b[0]-prev[0]||1),s1=(next[1]-a[1])/(next[0]-a[0]||1);
        const lo=Math.min(a[1],b[1]),hi=Math.max(a[1],b[1]),limit=y=>Math.min(hi,Math.max(lo,y));
        c.bezierCurveTo(a[0]+dx/3,limit(a[1]+s0*dx/3),b[0]-dx/3,limit(b[1]-s1*dx/3),b[0],b[1]);
      }
    }
    const fill=c.createLinearGradient(0,top,0,baseline);
    fill.addColorStop(0,'rgba(237,57,146,.26)');fill.addColorStop(1,'rgba(237,57,146,0)');
    c.beginPath();c.moveTo(pts[0][0],baseline);trace(true);c.lineTo(pts[pts.length-1][0],baseline);c.closePath();c.fillStyle=fill;c.fill();
    c.beginPath();trace();c.lineWidth=opts.lineWidth||3;c.lineJoin='round';c.lineCap='round';c.strokeStyle=pink;c.stroke();
    const high=smoothed.reduce((best,p,i)=>p.v>smoothed[best].v?i:best,0);
    if(smoothed[high].v>.15&&opts.markerSize!==0){const p=pts[high];star(c,p[0],p[1],opts.markerSize??10,pink,.12);}
    if(hasLabels){
      c.textAlign='center';
      const slot=innerW/n;
      rows.forEach((r,i)=>{
        const mid=padX+slot*(i+.5),maxWidth=slot-12,artist=r.artist||r.name||'',song=r.title||r.song||'';
        function label(text,y,initial,min,color,weight,family){
          let size=initial;c.fillStyle=color;
          do{c.font=`${weight} ${size}px ${family}`;if(c.measureText(text).width<=maxWidth||size<=min)break;size-=.5;}while(true);
          c.fillText(text,mid,y);
        }
        label(artist,h-31,opts.labelSize||16,10,ink,800,"'PP Neue Machina Inktrap','Pretendard',Arial,sans-serif");
        label(song,h-10,Math.max(11,(opts.labelSize||16)-1),9,pink,600,"'PP Palma','Pretendard',Arial,sans-serif");
      });
    }
    for(let i=1;i<n;i++){
      const x=padX+innerW*i/n;c.strokeStyle='rgba(80,80,86,.15)';c.lineWidth=.75;
      c.beginPath();c.moveTo(x,top+5);c.lineTo(x,h-(hasLabels?4:5));c.stroke();
    }
    c.restore();return{peak:{x:pts[high][0],y:pts[high][1]}};
  }
  root.SPARKON_V41={pink,lime,ink,types,today,classification,strength,best,encode,decode,star,sparkAccents,perspective,graph,round};
})(window);

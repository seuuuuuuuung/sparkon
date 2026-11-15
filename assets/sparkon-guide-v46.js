/* Native canvas re-drawing of the supplied HOW TO JOIN layout at screen scale.
   No bitmap screen is used for text, icons, grid, or the animated CTA. */
(function(root){
  const pink='#ed3992',lime='#c0fb31',ink='#080808',lavender='#aaa5f6';
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=t=>1-Math.pow(1-clamp(t),3);
  const ko="'Paperlogy','Pretendard','Malgun Gothic',Arial,sans-serif";
  const display="'PP Neue Machina Inktrap','Pretendard',Arial,sans-serif";
  const latin="'PP Palma','Pretendard',Arial,sans-serif";
  function text(c,str,x,y,size,weight,color,align='left',family=ko,maxWidth=0){
    c.save();c.fillStyle=color;c.textAlign=align;c.textBaseline='alphabetic';
    let fontSize=size;c.font=`${weight} ${fontSize}px ${family}`;
    if(maxWidth){while(fontSize>8&&c.measureText(str).width>maxWidth){fontSize-=.5;c.font=`${weight} ${fontSize}px ${family}`;}}
    c.fillText(str,x,y);c.restore();
  }
  function grid(c){
    c.save();c.strokeStyle='rgba(84,85,92,.055)';c.lineWidth=.7;
    const vx=640,vy=209;
    for(let x=-930;x<=2200;x+=143){c.beginPath();c.moveTo(vx,vy);c.lineTo(x,-90);c.stroke();}
    c.strokeStyle='rgba(84,85,92,.024)';
    for(let x=-950;x<=2400;x+=166){c.beginPath();c.moveTo(vx,vy);c.lineTo(x,720);c.stroke();}
    for(const y of [105,134,280,418]){c.beginPath();c.moveTo(0,y);c.lineTo(1280,y);c.stroke();}
    const fade=c.createLinearGradient(0,180,0,510);fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(1,'rgba(255,255,255,.96)');
    c.fillStyle=fade;c.fillRect(0,180,1280,330);c.restore();
  }
  function circle(c,y,i){
    c.save();c.fillStyle=pink;c.beginPath();c.arc(366,y,20.5,0,Math.PI*2);c.fill();
    text(c,String(i+1),366,y+10,30,900,'#fff','center',display);c.restore();
  }
  function headphone(c){
    c.save();c.translate(813,261);c.strokeStyle=ink;c.fillStyle=ink;
    c.lineCap='round';c.lineJoin='round';c.lineWidth=7;
    c.beginPath();c.arc(-2,5,37,1.12*Math.PI,1.93*Math.PI);c.stroke();
    c.save();c.translate(-31,22);c.rotate(-.27);c.beginPath();c.roundRect(-10,-9,12,35,5);c.fill();c.beginPath();c.roundRect(4,-11,9,38,4);c.fill();c.restore();
    c.save();c.translate(28,17);c.rotate(-.065);c.beginPath();c.roundRect(-5,-8,13,37,4);c.fill();c.beginPath();c.roundRect(11,-4,8,30,4);c.fill();c.restore();
    c.strokeStyle=lime;c.lineWidth=4;
    [[-62,13,-57,27],[-51,8,-46,23],[48,-14,56,-2],[60,-14,67,-3]].forEach(a=>{c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(a[0]+(a[2]-a[0])*1.2,a[1]-10,a[2],a[3]);c.stroke();});
    c.restore();
  }
  function fourPoint(c,x,y,r){
    c.beginPath();c.moveTo(x,y-r);
    c.bezierCurveTo(x+r*.20,y-r*.18,x+r*.18,y-r*.2,x+r,y);
    c.bezierCurveTo(x+r*.18,y+r*.18,x+r*.18,y+r*.2,x,y+r);
    c.bezierCurveTo(x-r*.19,y+r*.2,x-r*.2,y+r*.18,x-r,y);
    c.bezierCurveTo(x-r*.18,y-r*.18,x-r*.18,y-r*.2,x,y-r);c.closePath();
  }
  function stick(c){
    c.save();c.translate(931,432);c.rotate(.53);c.lineCap='round';c.lineJoin='round';
    c.strokeStyle=ink;c.lineWidth=6;c.beginPath();c.arc(0,0,29,0,Math.PI*2);c.stroke();
    c.beginPath();c.moveTo(-9,29);c.lineTo(-9,84);c.quadraticCurveTo(0,95,9,84);c.lineTo(9,29);c.stroke();
    c.lineWidth=4;c.beginPath();c.moveTo(-12,28);c.lineTo(12,28);c.stroke();
    c.fillStyle=ink;fourPoint(c,0,0,13);c.fill();c.restore();
    c.save();c.strokeStyle=lime;c.lineWidth=4;c.lineCap='round';
    [[895,376,901,392],[882,399,898,405],[969,441,982,448],[960,451,969,465]].forEach(a=>{c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[2],a[3]);c.stroke();});
    c.restore();
  }
  function draw(c,elapsed){
    c.save();c.fillStyle='#fff';c.fillRect(0,0,1280,720);grid(c);
    const a=(start,duration)=>ease((elapsed-start)/duration);
    c.globalAlpha=a(0,480);
    text(c,'인터랙션 체험 안내',640,110,35,900,ink,'center',ko);
    text(c,'HOW TO JOIN',640,141,21,900,ink,'center',display);
    c.globalAlpha=1;
    const line=a(270,1130);c.strokeStyle=pink;c.lineWidth=2.7;
    c.beginPath();c.moveTo(366,259);c.lineTo(366,259+223*line);c.stroke();
    const steps=[
      ['헤드셋을 착용하고 응원봉을 들어주세요.','Put on the headphones and pick up the light stick.'],
      ['체험이 시작되면 손과 응원봉이 카메라 화면에 보이도록 해주세요.','Keep your hands and light stick in view of the camera.'],
      ['여러 아티스트의 짧은 하이라이트를 즐겨주세요.','Enjoy short highlights from different artists.']
    ];
    steps.forEach(([kr,en],i)=>{
      const alpha=a(180+i*320,550),y=[259,363,482][i];
      c.save();c.globalAlpha=alpha;c.translate(0,(1-alpha)*8);
      circle(c,y,i);text(c,kr,404,y+1,18,800,ink,'left',ko,482);
      text(c,en,404,y+16,10.5,500,'#555','left',latin,486);c.restore();
    });
    c.save();c.globalAlpha=a(270,650);headphone(c);c.restore();
    c.save();c.globalAlpha=a(680,650);stick(c);c.restore();
    c.save();c.globalAlpha=a(1180,480);
    text(c,'* 체험 중 필터가 적용된 카메라 화면이 표시되며, 손 움직임이 기록됩니다. 영상 및 사진은 저장되지 않습니다.',640,575,8.7,500,'#111','center',ko,845);
    text(c,'* During the experience, a filtered camera view is displayed and hand movements are recorded. No video or photos are saved.',640,588,8.7,500,'#111','center',latin,850);
    c.restore();
    const enter=a(1300,500),breathe=.87+.13*(.5+.5*Math.cos(elapsed*Math.PI/1400));
    c.save();c.globalAlpha=enter*breathe;c.fillStyle='#f1f1f2';c.beginPath();c.roundRect(388,610,504,68,34);c.fill();
    text(c,'준비되면 버튼을 눌러 시작해 주세요',640,645,18,800,lavender,'center',ko);
    text(c,'PRESS TO START',640,663,11,600,lavender,'center',display);c.restore();
    c.restore();
  }
  root.SPARKON_GUIDE_V46={draw};
})(window);

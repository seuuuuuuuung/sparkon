/* SPARKON v56 — short artist-first mobile keepsake with direct official channels. */
(() => {
  'use strict';
  const data=window.SPARKON_DATA,core=window.SPARKON_V41;
  if(!data||!core)return;
  const params=new URLSearchParams(location.search);
  let rec=null;
  try{rec=core.decode(location.hash.slice(1));}catch(error){console.warn('Record QR decode failed',error);}
  if(!rec&&params.has('demo'))rec={
    id:'0001',date:core.today(),winner:0,sparkType:'PULSE',
    artists:[{artistId:1,artist:'KickFlip',title:'FREEZE',duration:25.68,curve:[.3,.8,.4,.7,.3,.9]}]
  };
  if(!rec?.artists?.length)return;
  const active=rec.artists[Math.max(0,rec.winner)]||rec.artists[0];
  const artist=data[active.artistId]||data.find(a=>a.name===active.artist)||data[1];
  const safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const photos=['lngshot.jpg','kickflip.jpg','izna.jpg','allday.jpg','nexz.webp','meovv_vogue.jpg','cravity.jpg','kisoflife.jpg'];
  // Names and content are configurable editorial material, not quotes
  // supplied by the artists. The postcard is a fictional festival experience.
  const directory=[
    {members:['오율','률','우진','루이'],
      tmi:['네 멤버가 직접 곡 작업에 참여하며 자신들만의 색을 만들어가고 있어요.','‘LNGSHOT’은 쉽지 않은 도전도 해보겠다는 태도를 담은 이름이에요.'],
      songs:[['Moonwalkin’','이 그루브가 좋았다면, 조금 다른 리듬의 롱샷도 만나봐요.'],['Backseat','한층 더 편안한 분위기의 매력을 발견할 차례.']]},
    {members:['계훈','동화','주왕','민제','케이주','동현'],
      tmi:['‘킥플립’은 스케이트보드 기술에서 가져온 이름. 팀의 장난기 있는 에너지와 잘 어울리죠.','민제의 공식 프로필 특기 중 하나는 ‘예쁜 손글씨’예요.','멤버별 캐릭터 ‘킥둥쓰’도 있어요. 이름과 얼굴을 연결해 보면 더 재밌어요.'],
      songs:[['Mama Said','자유로운 에너지가 좋았다면 이 노래부터.'],['See You On Tomorrow','이번에는 조금 더 벅찬 청춘의 감정을 들어봐요.']]},
    {members:['마이','방지민','코코','류사랑','최정은','정세비'],
      tmi:['‘I-LAND 2 : N/α’를 통해 만들어진 팀이라는 사실, 알고 있었나요?','팀 이름은 ‘언제든 어디서든 무엇이든, 나’라는 당찬 의미를 품고 있어요.'],
      songs:[['SIGN','무대의 강렬함 뒤에 있는 또 다른 감정을 만나봐요.'],['IZNA','팀 이름을 건 곡에서 이즈나의 첫인상을 느껴보세요.']]},
    {members:['애니','타잔','베일리','우찬','영서'],
      tmi:['서로 다른 스타일을 가진 다섯 멤버가 함께하는 혼성 그룹이에요.','‘FAMOUS’와 ‘WICKED’, 두 곡만 비교해도 같은 팀의 다른 표정을 발견할 수 있어요.'],
      songs:[['WICKED','더 날카롭고 강한 팀의 분위기를 듣고 싶다면.'],['ONE MORE TIME','무대의 에너지를 다른 결로 이어가 봐요.']]},
    {members:['토모야','유우','하루','소건','세이타','휴이','유키'],
      tmi:['‘Nizi Project Season 2’에서 시작된 일곱 멤버의 이야기를 찾아보세요.','퍼포먼스 영상과 연습실 영상을 나란히 보면 디테일이 더욱 잘 보여요.'],
      songs:[['NALLINA','넥스지 특유의 역동적인 움직임이 궁금하다면.'],['Beat-Boxer','다른 리듬 속에서도 살아나는 팀의 합을 느껴보세요.']]},
    {members:['수인','가원','안나','나린','엘라'],
      tmi:['다섯 멤버의 서로 다른 분위기가 무대에서 하나로 모이는 팀이에요.','무대 영상 다음에는 퍼포먼스 영상으로 멤버별 표현을 살펴보세요.'],
      songs:[['HANDS UP','분위기를 한 번 더 끌어올리고 싶을 때.'],['TOXIC','강렬한 무대와는 다른 섬세한 매력도 궁금하다면.']]},
    {members:['세림','앨런','정모','우빈','원진','민희','형준','태영','성민'],
      tmi:['‘CRAVITY’는 창의성과 중력이 만난 이름. 멤버들이 만들어내는 끌림을 떠올려 보세요.','라이브 무대와 안무 연습을 번갈아 보면 팀의 에너지가 다르게 느껴져요.'],
      songs:[['CHEESE','유쾌하고 청량한 크래비티를 한 번 더.'],['Love or Die','조금 더 진한 감정의 퍼포먼스를 보고 싶다면.']]},
    {members:['쥴리','나띠','벨','하늘'],
      tmi:['네 멤버의 서로 다른 음색과 솔로 무대를 찾아보는 재미가 있어요.','팀의 라이브 무대 다음엔 멤버별 직캠을 하나씩 보는 걸 추천해요.'],
      songs:[['Nobody Knows','네 사람의 보컬이 남기는 다른 여운을 느껴보세요.'],['Midas Touch','눈을 사로잡는 퍼포먼스와 중독적인 후렴을 다시 만나봐요.']]}
  ];
  const info=directory[artist.id]||directory[1];
  // Verified artist channels, not search-result URLs. Indexed to SPARKON_DATA.
  const officialChannels=[
    {instagram:'https://www.instagram.com/lngshot4sho/',youtube:'https://www.youtube.com/@LNGSHOT4SHO',x:'https://x.com/LNGSHOT4sho'},
    {instagram:'https://www.instagram.com/kickflip_jype/',youtube:'https://www.youtube.com/@kickflip_jype',x:'https://x.com/kickflip_jype'},
    {instagram:'https://www.instagram.com/izna_offcl/',youtube:'https://www.youtube.com/@izna_offcl',x:'https://x.com/izna_offcl'},
    {instagram:'https://www.instagram.com/allday_project/',youtube:'https://www.youtube.com/@ALLDAY_PROJECT',x:'https://x.com/ALLDAY_PROJECT'},
    {instagram:'https://www.instagram.com/real_nexz/',youtube:'https://www.youtube.com/@NEXZ_official',x:'https://x.com/NEXZ_official'},
    {instagram:'https://www.instagram.com/meovv/',youtube:'https://www.youtube.com/@MEOVV_OFFICIAL',x:'https://x.com/OFFICIAL_MEOVV'},
    {instagram:'https://www.instagram.com/cravity_official/',youtube:'https://www.youtube.com/@CRAVITYofficial',x:'https://x.com/CRAVITYstarship'},
    {instagram:'https://www.instagram.com/kissoflife_s2/',youtube:'https://www.youtube.com/@KISSOFLIFE_official',x:'https://x.com/KISSOFLIFE_S2'}
  ];
  const channels=officialChannels[artist.id]||officialChannels[1];
  const socialSvg={
    instagram:'<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><rect x="3.4" y="3.4" width="21.2" height="21.2" rx="6.4" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="14" r="4.9" stroke="currentColor" stroke-width="2.5"/><circle cx="20.65" cy="7.6" r="1.4" fill="currentColor"/></svg>',
    youtube:'<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><rect x="2" y="5.6" width="24" height="16.8" rx="5.2" fill="currentColor"/><path d="M11.4 9.65L19 14L11.4 18.35V9.65Z" fill="white"/></svg>',
    x:'<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 4.2H10L23.5 23.8H18.5L5 4.2Z" stroke="currentColor" stroke-width="2.35" stroke-linejoin="round"/><path d="M22.3 4.2L5.7 23.8" stroke="currentColor" stroke-width="2.25"/></svg>'
  };
  // The record serial is stable, so refreshing the QR keeps the same note.
  const serial=Number.parseInt(String(rec.id).replace(/\D/g,''),10)||Math.max(1,artist.id+1);
  const member=info.members[(serial*7+artist.id*3)%info.members.length];
  const notes=[
    '반가워요!\n오늘 우리 무대 어땠어요?\n처음 만난 오늘이 오래 기억됐으면 좋겠어요.\n다음 무대에서도 꼭 만나요! ♡',
    '오늘 처음 만난 우리, 어땠어요?\n마음에 남은 장면이 하나라도 있다면 정말 좋겠어요.\n집에 가는 길에도 우리 노래 한 번 더 들어줘요. ♡',
    '이렇게 만나서 반가워요!\n오늘 가장 신났던 순간은 언제였어요?\n다음에 만날 땐 같이 따라 부를 수 있으면 좋겠어요. ✦',
    '오늘 우리의 무대에 와줘서 고마워요.\n우연이었어도 특별한 첫 만남이었으면!\n다음 무대에서 또 발견해 주세요. ♡'
  ];
  const greeting=notes[(serial+artist.id*2)%notes.length];
  const youtubeId=/^[A-Za-z0-9_-]{11}$/.test(rec.youtubeId||'')?rec.youtubeId:artist.youtube;
  const spotifyId=/^[A-Za-z0-9]{22}$/.test(rec.spotifyId||'')?rec.spotifyId:artist.spotify;
  const stageUrl=youtubeId?'https://www.youtube.com/watch?v='+youtubeId:'https://www.youtube.com/results?search_query='+encodeURIComponent(artist.name+' '+artist.song+' live');
  const behindUrl='https://www.youtube.com/results?search_query='+encodeURIComponent(artist.name+' 공식 비하인드 자컨');
  const playlistUrl=spotifyId?'https://open.spotify.com/playlist/'+spotifyId:'https://open.spotify.com/search/'+encodeURIComponent(artist.name);
  const searchSong=s=>'https://open.spotify.com/search/'+encodeURIComponent(artist.name+' '+s);
  const date=safe(rec.date||core.today());
  const image='./assets/artists/'+photos[artist.id];
  const hero=document.createElement('div');
  hero.className='record-v55';
  hero.innerHTML=`
    <div class="record-eyebrow-v55">THE ARTIST YOUR SPARK FOUND</div>
    <p class="record-intro-v55">오늘, 당신의 스파크가 닿은 아티스트</p>
    <h2 class="record-artist-v55 ${artist.name.length>10?'long':''}">${safe(artist.name)}</h2>
    <p class="record-subtitle-v55">우연히 마주친 무대가<br>새로운 관심의 시작이 될지도 몰라요.</p>
    <div class="record-date-v55"><span>${date}</span><span>MY FIRST SPARK · #${safe(rec.id)}</span></div>
    <div class="record-song-v55"><small>OUR FIRST STAGE</small><strong>${safe(artist.song)}</strong></div>
    <figure class="record-photo-v55"><img src="${image}" alt="${safe(artist.name)} 아티스트 이미지" loading="eager"><figcaption>YOUR SPARK, FINALLY LIVE.</figcaption></figure>

    <section class="record-section-v55" aria-labelledby="greeting-title-v55">
      <p class="record-section-kicker-v55">A MESSAGE FOR YOU</p>
      <h3 id="greeting-title-v55">내게 도착한 인사</h3>
      <div class="letter-v55">
        <div class="letter-top-v55"><span>TO. MY FIRST SPARK</span><span>LETTER ${String((serial+artist.id)%9+1).padStart(2,'0')}</span></div>
        <p class="letter-body-v55">${safe(greeting)}</p>
        <p class="letter-from-v55">from. ${safe(member)} ♡</p>
      </div>
      <p class="letter-footnote-v55">오늘 만난 아티스트와 조금 더 가까워지는 첫 페이지</p>
    </section>

    <section class="record-section-v55" aria-labelledby="replay-title-v55">
      <p class="record-section-kicker-v55">REPLAY THE SPARK</p>
      <h3 id="replay-title-v55">이 무대, 다시 만나볼래?</h3>
      <div class="record-replay-v55">
        <p class="record-eyebrow-v55">THE STAGE WE JUST SHARED</p>
        <div class="track-v55">${safe(artist.name)} — ${safe(artist.song)}</div>
        <p class="record-lead-v55">방금 당신이 경험한 그 무대!<br>짧은 하이라이트로는 다 보여주지 못한 순간들을 다시 만나보세요.</p>
        <a class="record-link-v55" href="${safe(stageUrl)}" target="_blank" rel="noopener noreferrer"><span>전체 무대 보러 가기</span><span>↗</span></a>
      </div>
    </section>

    <section class="record-section-v55" aria-labelledby="songs-title-v55">
      <p class="record-section-kicker-v55">ONE MORE SONG?</p>
      <h3 id="songs-title-v55">한 곡만 더 들어볼래?</h3>
      <p class="record-lead-v55">오늘의 스파크를 이어갈 두 곡. 같은 팀인데도 다른 장면이 보일 거예요.</p>
      <div class="one-more-v55">${info.songs.map((pair,i)=>`<div class="one-more-item-v55"><div class="one-more-header-v55"><strong>${safe(pair[0])}</strong><em>0${i+1}</em></div><p>${safe(pair[1])}</p><a href="${safe(searchSong(pair[0]))}" target="_blank" rel="noopener noreferrer">이 곡 들어보기 ↗</a></div>`).join('')}</div>
      <a class="record-link-v55 lime" href="${safe(playlistUrl)}" target="_blank" rel="noopener noreferrer"><span>${safe(artist.name)} PLAYLIST 듣기</span><span>↗</span></a>
    </section>

    <section class="record-section-v55" aria-labelledby="behind-title-v55">
      <p class="record-section-kicker-v55">GET TO KNOW THEM</p>
      <h3 id="behind-title-v55">무대 밖에서는 이런 모습!</h3>
      <p class="record-lead-v55"><strong>무대 위와는 또 다른 매력.</strong><br>무대에서는 이렇게 멋있는데, 평소에는 어떤 모습일까요? 멤버들의 일상과 케미를 만나보세요.</p>
      <div class="curation-video-v55"><img src="${image}" loading="lazy" alt=""><div><strong>처음엔 이 영상부터!</strong><p>${safe(artist.name)}의 공식 비하인드와 멤버들 케미를 찾아보세요.</p></div></div>
      <a class="record-link-v55 ink" href="${safe(behindUrl)}" target="_blank" rel="noopener noreferrer"><span>추천 비하인드 영상 보러 가기</span><span>↗</span></a>
    </section>

    <section class="record-social-section-v56" aria-label="${safe(artist.name)} 공식 소셜 채널">
      <p class="record-section-kicker-v55">OFFICIAL CHANNELS</p>
      <div class="record-social-icons-v56">
        ${[['instagram','Instagram'],['youtube','YouTube'],['x','X (Twitter)']].map(([service,label])=>`<a class="record-social-link-v56" href="${safe(channels[service])}" target="_blank" rel="noopener noreferrer" aria-label="${safe(artist.name)} 공식 ${label}" title="${safe(artist.name)} · ${label}">${socialSvg[service]}</a>`).join('')}
      </div>
    </section>`;
  const originalHeader=document.querySelector('#content > .top');
  originalHeader?.insertAdjacentElement('afterend',hero);
  const save=document.querySelector('#content .save');
  const download=document.getElementById('download');
  if(download){download.firstChild.textContent='기록 이미지 저장하기 ';download.setAttribute('aria-label','나의 스파크 기록 이미지 저장하기');}
  if(save){
    const heading=save.querySelector('h3');
    if(heading)heading.textContent='나의 스파크 기록 저장하기';
    const note=save.querySelector('.note');
    if(note)note.textContent='오늘 만난 무대를 내 휴대폰에 간직해 보세요.';
  }
})();

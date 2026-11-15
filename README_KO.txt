SPARKON — MY FIRST SPARK RECORD v42
2026.11.16 수정본 / 사용자 원본 디자인 복원 및 오디오 경로 수정

[실행]
1. ZIP 압축을 해제하고 폴더 구조를 유지합니다.
2. index.html을 Chrome으로 열고 초기 카메라·마이크 권한을 허용합니다.
3. Space / Enter / 화면 클릭: 메인 → 안내 → 3·2·1 → 인터랙션.
4. Ctrl + Alt + Shift + A (Mac: Control + Option + Shift + A)로 관리자 열기.
5. 관리자에서 QR 주소에 실제 HTTPS record.html URL을 입력해 저장합니다.
6. 관리자 > 스피커 소리 테스트로 먼저 음원을 들어보세요. 브라우저에 별도 스피커 권한 수락은 없으며, 클릭/키 입력으로 오디오 재생 제한을 해제하도록 수정했습니다.

[변경한 항목]
- 메인 배경 모션: 사용자가 첨부한 SPARKON_MOTION_v28_WIDE_CAMERA_MOVE_4K 원본 (3840×2160, 60fps, 8.4초).
- 시작 안내: 약 6.4초 주기로 천천히 불투명도가 변합니다.
- 인터랙션 페이지에서 기존 SPARK STAGE, YOUR SPARK 원본 레이아웃을 유지합니다. 카메라 필터의 블러를 대폭 낮추고 실루엣 윤곽을 더 알아볼 수 있도록 샘플링을 높였습니다.
- 카메라 아래 1/4 곡 순서 표시는 없으며, 현재 곡명은 스테이지 아래쪽에 작게 표시됩니다.
- 안내 화면은 원래 헤드셋/응원봉 아이콘과 타이포, 순차 등장 모션을 복원했습니다. 카운트다운 1은 실제 글자 윤곽을 기준으로 수평 중앙 보정했습니다.
- 8개 MP3 기본 탑재. 체험마다 중복 없이 랜덤 3개 선정, 각 실제 MP3 길이대로 14.8~28.4초 재생.
- v41에서 발생할 수 있던 로컬 MP3/WebAudio 연결 시 무음 문제를 피하기 위해 직접 Audio 요소에서 재생합니다.
- LNGSHOT MP3 실제 길이(14.76초)와 기존 데이터 설정(17.98초) 불일치를 수정했습니다.
- 다음 곡 전에 1.35초 공백, 곡 시작/끝 약 0.45초 오디오 페이드.
- 체험 길이는 선정된 3곡에 따라 달라집니다(약 53~86초).
- 가장 반응이 높았던 아티스트 한 팀이 선정되며, 그 아티스트의 소개/곡/추천 영상/Spotify 버튼으로 연결합니다.
- 4개 기록 유형: BURST / WAVE / PULSE / RISE SPARK.
- 웹 기록 화면: 전달해 준 원본 아트보드를 토대로 유형+멘트+3곡 실제 반응 그래프+대표 아티스트+QR을 표기합니다. 60초 후 메인 복귀.
- 모바일 기록 화면: 전달해 준 세로 디자인과 문구/컬러/배치에 맞춰 반응 유형, 3곡 그래프, 최고 반응 아티스트, 추천 영상 및 플레이리스트로 연결합니다.
- 다운로드용 PNG: 전달해 준 1080×1701 원본 아트보드의 로고·그래픽·배치를 유지하고, 결과 데이터와 날짜/사진을 채워 생성합니다.
- 날짜는 체험한 기기의 실제 현지 날짜를 기록합니다. No.XXXX는 해당 기기에서 순번을 부여합니다.
- 기존 MediaPipe 손 인식, 관리자 권한, 전체화면, 기록 JSON 내보내기 기능 유지.

[아티스트/곡]
DAY 01  LNGSHOT / Saucin’ | KickFlip / FREEZE | izna / Mamma Mia | ALLDAY PROJECT / FAMOUS
DAY 02  NEXZ / O-RLY? | MEOVV / GO HARD | CRAVITY / Ready or Not | KISS OF LIFE / Bad News
관리자에서 각 팀의 YouTube 동영상 ID와 Spotify 플레이리스트 ID 수정 가능. 기본값은 제공한 링크입니다.

[QR / 모바일 배포 주의]
반드시 index.html, record.html, assets 폴더를 함께 보존해야 합니다.
모바일에서 사용할 record.html과 assets/sparkon-data.js, assets/sparkon-record-core-v41.js,
assets/sparkon-mobile-v41.js, assets/logo.png 등을 HTTPS 웹사이트(GitHub Pages 등)에 함께 배포합니다.
전시 컴퓨터의 관리자 > QR 주소에 해당 사이트의 전체 record.html URL을 입력합니다.
예: https://YOUR-SITE.example/record.html (실제 배포한 주소로 교체)
외부 HTTPS 배포 전에는 다른 기기에서 스캔 가능한 QR이 생성되지 않습니다.
기록 데이터는 URL의 # 부분에만 담기며, 동영상/카메라 화면/원본 음성은 저장하지 않습니다.
모바일 결과지는 QR에 포함된 기록만으로 재구성되므로 별도 기록 서버는 필요 없습니다.
모바일 디자인 확인: record.html?demo=1 (임의의 예시 결과, 실제 체험 아님).
기록 URL은 자동 만료되지 않습니다. 웹 QR 표시 화면만 60초 후 메인으로 복귀합니다.

[폰트 파일 필요]
디자인 코드에는 다음 폰트 패밀리가 정확히 지정되어 있습니다.
  메인 영문 및 숫자: PP Neue Machina Inktrap Ultrabold
  본문 영문: PP Palma
  국문: Paperlogy
그러나 해당 3종의 폰트 원본 파일은 이번 첨부에 포함되어 있지 않습니다.
실제 전시 환경에서 정확한 폰트로 보이려면 사용권을 가진 파일을 아래 이름으로 복사하세요.
  assets/fonts/PPNeueMachina-InktrapUltrabold.woff2
  assets/fonts/PPPalma-Regular.woff2
  assets/fonts/Paperlogy-7Bold.woff2
파일명을 다르게 사용할 경우 index.html과 record.html 상단 @font-face 경로도 변경하세요.
파일이 없는 환경에서는 기존 프로젝트에 포함돼 있던 합법적 Pretendard 폰트 등 대체 글꼴이 표시됩니다.

[권한 및 실기기 확인]
실제 iMac에서 Chrome 카메라 권한, 주먹·응원봉 추적, 헤드셋 오디오,
블루투스 단일 키, 4K 영상 재생 성능, 사운드/곡간 텀을 확인하세요.
오디오가 계속 안 들릴 경우 관리자 음량 100%, iMac의 실제 출력 장치와 Chrome 탭 음소거 여부를 확인하세요.
iPhone/Android에서 HTTPS QR 스캔, YouTube/Spotify 연결, PNG 저장을 확인하세요.
YouTube 썸네일은 인터넷에 연결되어야 뜹니다. 저장 이미지에는 오프라인 그래픽 대체 디자인이 있습니다.
공개 배포된 모바일 파일과 전시 컴퓨터의 QR 주소가 같은 버전인지 확인하세요.

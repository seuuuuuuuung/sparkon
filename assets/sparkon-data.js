/* SPARKON Festival v41 — one source of truth for all eight highlights. */
(function(root){
  const artists=[
    {id:0,day:1,name:'LNGSHOT',song:'Saucin’',seconds:14.76,audio:'assets/audio/01_lngshot.mp3',hook:'듣자마자 고개부터 까딱이게 되는 그루브.',description:'자유로운 랩과 보컬, 자신감 넘치는 힙합 에너지.',videoLabel:'Saucin’ · 서울스프링페스티벌 라이브',youtube:'iXl-hLJJPM8',spotify:'2YwJvsePIVRh1zUfz9Dsd6'},
    {id:1,day:1,name:'KickFlip',song:'FREEZE',seconds:25.68,audio:'assets/audio/02_kickflip.mp3',hook:'하고 싶은 대로 뛰어노는 것, 그게 킥플립의 청춘.',description:'장난기와 자유로움이 가득한 청춘의 에너지.',videoLabel:'FREEZE · it’s Live 밴드 라이브',youtube:'dcDuclI4Qs0',spotify:'0d2PUIVTOcADUbJxoHFLLf'},
    {id:2,day:1,name:'izna',song:'Mamma Mia',seconds:28.37,audio:'assets/audio/03_izna.mp3',hook:'한 번 보면 또 보게 되는 퍼포먼스.',description:'시원한 에너지와 눈을 뗄 수 없는 군무.',videoLabel:'Mamma Mia · STUDIO CHOOM 4K',youtube:'miV6819bnkc',spotify:'7MQfFfmeOELgGgEWvUuZD2'},
    {id:3,day:1,name:'ALLDAY PROJECT',song:'FAMOUS',seconds:17.98,audio:'assets/audio/04_allday.mp3',hook:'데뷔부터 존재감 확실했던 바로 그 팀.',description:'자유로운 스타일과 자신감으로 완성하는 무대.',videoLabel:'FAMOUS · 2025 MAMA AWARDS',youtube:'UbBMBPv2OJQ',spotify:'2voBlBV09HKXwTFLDMGXsw'},
    {id:4,day:2,name:'NEXZ',song:'O-RLY?',seconds:27.26,audio:'assets/audio/05_nexz.mp3',hook:'넥스지는 퍼포먼스까지 봐야 진짜다.',description:'디테일한 춤선과 완벽한 합이 만드는 쾌감.',videoLabel:'O-RLY? · Official Performance Video',youtube:'U7r3rS-CYe8',spotify:'5Me0QPolwxgGWDu8JdAxl8'},
    {id:5,day:2,name:'MEOVV',song:'GO HARD',seconds:24.22,audio:'assets/audio/06_meovv.mp3',hook:'무대 위에서 제대로 터지는 에너지.',description:'자신감 넘치는 퍼포먼스와 강렬한 무대 장악력.',videoLabel:'GO HARD · M COUNTDOWN : PLAY FESTA',youtube:'yrabUDGGvos',spotify:'5iPdeF8JHRmwcx5rxTycg2'},
    {id:6,day:2,name:'CRAVITY',song:'Ready or Not',seconds:27.38,audio:'assets/audio/07_cravity.mp3',hook:'이 노래 나오면 공연장에서 가만히 있을 수 없음.',description:'함께 뛰고 따라 부르게 되는 청량한 에너지.',videoLabel:'Ready or Not · it’s Live 밴드 라이브',youtube:'u4xFvynqKd4',spotify:'7I8qAymc5cjdoZZFw3ftOI'},
    {id:7,day:2,name:'KISS OF LIFE',song:'Bad News',seconds:26.78,audio:'assets/audio/08_kissoflife.mp3',hook:'멤버들의 보컬 차력쇼가 궁금하다면?',description:'개성 있는 음색과 탄탄한 라이브의 조합.',videoLabel:'Bad News · it’s Live 밴드 라이브',youtube:'GBzoOs45C7I',spotify:'2CkHIUGVq6E3PA6uKozdpg'}
  ];
  root.SPARKON_DATA=Object.freeze(artists.map(item=>Object.freeze(item)));
})(window);

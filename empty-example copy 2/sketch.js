// 먼저 기본 변수들 선언
let t = 0; //무지개 배경을 위한 변수
let pageIndex;
let pageBool = []; 
let pageNum = 3;
let checkPage = true;
// 전역 변수 추가 (파일 상단에)
let methodScrollY = 0;
// 전역 변수로 선택된 레시피 저장
let selectedRecipe = null;

// UI 기본 크기 변수들 (초기값 설정)
let margin = 20;  // 기본값으로 설정
let buttonWidth = 120;
let buttonHeight = 40;
let categoryY = 200;
let recipeStartY = 300;
let cardWidth;
let imageSize = 100;
let recipeCardHeight = 150;

// 스크롤 관련 변수들
let categoryScroll = 0;
let recipeScroll = 0;
let selectedCategory = 'all';

// ML5 관련 변수들
let classifier;
let video;
let label = "Model loading...";
let confidence = 0;
let imageModelURL = "https://teachablemachine.withgoogle.com/models/6j0oT911A/";

// 냉장고 관련 변수들
let myFridge = [];
let shownLabels = [];
let labelScrollY = 0;
let fridgeScrollY = 0;

// UI 요소들의 위치와 크기
let backButton = {x: 20, y: 20, w: 100, h: 40};
let fridgeBox = {x: 20, y: 20, w: 300, h: 150};
let recipeButton, confidenceBox, labelBox, addButton;  // setup에서 초기화

// 인식된 라벨들
let detectedLabels = [];
let detectedConfidences = [];

// 랜덤 레시피 관련 상수들
const cuttingMethods = ['깍둑썰기', '깎기', '썰기', '채썰기', '자르기', '다지기', '갈기', '다듬기'];
const cookingMethods = ['삶기', '끓이기', '졸이기', '튀기기', '굽기', '볶기', '찌기'];
const basicSeasonings = ['소금', '후추', '간장', '참기름', '깨'];
const cookingTools = ['냄비','프라이팬','찜통','양은냄비','밥솥','에어프라이기'];
let recipeAdjectives = ['신비한', '황홀한', '놀라운', '특별한', '환상적인', '마법같은', '귀여운','맛깔나는','발랄한','킹받는','아찔한','군침이 흐르는', '야무진'];
let selectedIngredients = [];


const recipeFormats = [
  {
    steps: 5,
    format: [
      {
        text: "[재료1]과 [재료2]를 [조리법1]한다",
        type: "cutting"
      },
      {
        text: "[재료3]은 적당한 크기로 [조리법2]한다",
        type: "cutting" 
      },
      {
        text: "[조리도구]에 [재료1]을 넣고 [조리법3]한다",
        type: "cooking"
      },
      {
        text: "[재료2]와 [재료3]을 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣고 한번 더 [조리법5]해서 완성한다",
        type: "cooking"
      }
    ]
  },
  {
    steps: 7,
    format: [
      {
        text: "[재료1]은 한입 크기로 [조리법1]하고, [재료2]는 [조리법2]한다",
        type: "cutting"
      },
      {
        text: "[재료3]과 [재료4]는 같은 크기로 [조리법3]한다",
        type: "cutting"
      },
      {
        text: "[조리도구]에 [양념류]를 두른다",
        type: "seasoning"
      },
      {
        text: "[재료1]과 [재료2]를 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "[재료3]을 넣고 [조리법5]한다",
        type: "cooking"
      },
      {
        text: "[재료4]와 [양념류]를 넣고 [조리법6]한다",
        type: "cooking"
      },
      {
        text: "마지막으로 [양념류]를 넣어 완성한다",
        type: "seasoning"
      }
    ]
  },
  {
    steps: 8,
    format: [
      {
        text: "[재료1], [재료2], [재료3]을 [조리법1]한다",
        type: "cutting"
      },
      {
        text: "[조리도구]를 달군 후 [양념류]를 둘러준다",
        type: "seasoning"
      },
      {
        text: "[재료1]을 넣고 [조리법2]한다",
        type: "cooking"
      },
      {
        text: "향이 올라오면 [재료2]를 넣고 [조리법3]한다",
        type: "cooking"
      },
      {
        text: "[재료3]을 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣고 간을 맞춘다",
        type: "seasoning"
      },
      {
        text: "중간 불로 [조리법5]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 뿌려 완성한다",
        type: "seasoning"
      }
    ]
  },
  {
    steps: 10,
    format: [
      {
        text: "[재료1]은 [조리법1]하고 [양념류]로 밑간한다",
        type: "cutting"
      },
      {
        text: "[재료2]와 [재료3]은 [조리법2]한다",
        type: "cutting"
      },
      {
        text: "[재료4]와 [재료5]는 [조리법3]한다",
        type: "cutting"
      },
      {
        text: "[조리도구]에 [재료1]을 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "[재료2]를 넣고 [조리법5]한다",
        type: "cooking"
      },
      {
        text: "[재료3]을 넣고 [조리법6]한다",
        type: "cooking"
      },
      {
        text: "[재료4]와 [재료5]를 넣고 [조리법7]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣고 간을 맞춘다",
        type: "seasoning"
      },
      {
        text: "중간 불로 [조리법8]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣어 완성한다",
        type: "seasoning"
      }
    ]
  },
  {
    steps: 12,
    format: [
      {
        text: "[재료1]은 [조리법1]한다",
        type: "cutting"
      },
      {
        text: "[재료2]와 [재료3]은 [조리법2]한다",
        type: "cutting"
      },
      {
        text: "[재료4]는 [조리법3]하고 [양념류]에 재워둔다",
        type: "cutting"
      },
      {
        text: "[조리도구]를 뜨겁게 달군다",
        type: "cooking"
      },
      {
        text: "[재료1]을 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "[재료2]를 넣고 [조리법5]한다",
        type: "cooking"
      },
      {
        text: "[재료3]을 넣고 [조리법6]한다",
        type: "cooking"
      },
      {
        text: "[재료4]를 넣고 [조리법7]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣고 간을 맞춘다",
        type: "seasoning"
      },
      {
        text: "중간 불로 [조리법8]한다",
        type: "cooking"
      },
      {
        text: "약한 불로 [조리법9]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣어 완성한다",
        type: "seasoning"
      }
    ]
  },
  {
    steps: 6,
    format: [
      {
        text: "[재료1], [재료2], [재료3]을 비슷한 크기로 [조리법1]한다",
        type: "cutting"
      },
      {
        text: "[조리도구]에 [양념류]를 두른다",
        type: "seasoning"
      },
      {
        text: "[재료1]을 넣고 [조리법2]한다",
        type: "cooking"
      },
      {
        text: "[재료2]와 [재료3]을 넣고 [조리법3]한다",
        type: "cooking"
      },
      {
        text: "[양념류]를 넣고 [조리법4]한다",
        type: "cooking"
      },
      {
        text: "마지막으로 [양념류]를 넣어 완성한다",
        type: "seasoning"
      }
    ]
  }
];

// 식재료 데이터베이스
let ingredients = {
  "바나나": {
      category: "과일"
  },
  "김치": {
    category: "과일"
  },
  //채소
  "양파": {
    tag: ["채"],
    category: "야채"
  },
  "대파": {
    tag: ["채"],
    category: "야채"
  },
  "마늘": {
    tag: ["채"],
    category: "야채"
  },
  "당근": {
    tag: ["채"],
    category: "야채"
  },
  "감자": {
    tag: ["채"],
    category: "야채"
  },
  "고구마": {
    tag: ["채"],
    category: "야채"
  },
  "크래커": {
    category: "과자류"
  },
  "오이": {
    tag: ["채"],
    category: "야채"
  },
  "가지": {
    tag: ["채"],
    category: "야채"
  },
  "상추": {
    tag: ["채"],
    category: "야채"
  },
  "깻잎": {
    tag: ["채"],
    category: "야채"
  },
  "배추": {
    tag: ["채"],
    category: "야채"
  },
  "시금치": {
    tag: ["채"],
    category: "야채"
  },
  "부추": {
    tag: ["채"],
    category: "야채"
  },
  "청경채": {
    tag: ["채"],
    category: "야채"
  },
  "토마토": {
    tag: ["채"],
    category: "야채"
  },
  "양배추": {
    tag: ["채"],
    category: "야채"
  },
  "브로콜리": {
    tag: ["채"],
    category: "야채"
  },
  "콩나물": {
    tag: ["채"],
    category: "야채"
  },
  //균류
  "팽이버섯": {
    tag: ["채"],
    category: "균류"
  },
  "표고버섯": {
    tag: ["채"],
    category: "균류"
  },
  //고기
  "돼지고기": {
    tag: ["부위"],
    category: "육류"
  },
  "소고기": {
    tag: ["부위"],
    category: "육류"
  },
  "닭다리": {
    // tag: ["부위"],
    category: "육류"
  },
  "닭가슴살": {
    tag: ["부위"],
    category: "육류"
  },
  //단백질류
  "달걀": {
    // tag: [""],
    category: "단백질류"
  },
  //유제품
  "우유": {
    // tag: [""],
    category: "유제품"
  },
  "요거트": {
    // tag: [""],
    category: "유제품"
  },
  "과자": {
    // tag: [""],
    category: "과자류"
  },
  "캔디": {
    // tag: [""],
    category: "캔디류"
  },
  "치즈": {
    // tag: [""],
    category: "유제품"
  },
  //과일
  "사과": {
    // tag: [""],
    category: "과일"
  },
  "배": {
    // tag: [""],
    category: "과일"
  },
  "귤": {
    // tag: [""],
    category: "과일"
  },
  "딸기": {
    // tag: [""],
    category: "과일"
  },
  "레몬": {
    // tag: [""],
    category: "과일"
  },
  "블루베리": {
    // tag: [""],
    category: "과일"
  },
  //가공식품
  "떡볶이떡": {
    // tag: [""],
    category: "가공식품"
  },
  "떡국떡": {
    // tag: [""],
    category: "가공식품"
  },
  "파스타면": {
    // tag: [""],
    category: "가공식품"
  },
  //탄수화물류
  "쌀": {
    // tag: [""],
    category: "탄수화물류"
  },
  "밀가루": {
    // tag: [""],
    category: "탄수화물류"
  },
  //양념류
  "다진마늘": {
    // tag: ["부위"],
    category: "양념류"
  },
  "고추장": {
    // tag: [""],
    category: "양념류"
  },
  "올리브유": {
    // tag: [""],
    category: "양념류"
  },
  "버터": {
    // tag: [""],
    category: "양념류"
  },
  "간장": {
    // tag: [""],
    category: "양념류"
  },
  //생선류
  "고등어": {
    // tag: ["부위"],
    category: "생선"
  },
  "갈치": {
    // tag: [""],
    category: "생선"
  },
  //해산물
  "새우": {
    // tag: [""],
    category: "해산물"
  },
  "오징어": {
    // tag: [""],
    category: "해산물"
  },
  "문어": {
    // tag: [""],
    category: "해산물"
  },
  "멸치": {
    // tag: [""],
    category: "해산물"
  },

};

// 레시피 데이터 객체 추가
let recipes = {
  home: [
    {
      title: "김치찌개",
      image: "./asset/recipe/kimchi-stew.jpg",
      mainIngredients: [
        { ingredient: "김치", cap: "3컵(390g)"},
      ],
      requiredIngredients: [
        { ingredient: "돼지고기", cap: "1컵(130g)"},
        { ingredient: "김치", cap: "3컵(390g)"},
        { ingredient: "청양고추", cap: "2개(20g)"},
        { ingredient: "대파", cap: "2/3대(70g)"},
        { ingredient: "마늘", cap: "1큰술(20g)"},
        { ingredient: "고춧가루", cap: ""},
        { ingredient: "새우젓", cap: "1큰술(20g)"},
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "돼지고기는 1.5cm 정도 두께로 먹기 좋게 자른다." },
        { step: 2, description: "냄비에 돼지고기, 정수물, 새우젓을 넣고 강 불로 끓인다. " },
        { step: 3, description: "찌개가 끓어오르면 중 약불로 줄인 후 고기가 무를 때 까지 최소 10분 정도 끓인다." },
        { step: 4, description: "대파는 두께 0.5cm로 송송썬다." },
        { step: 5, description: "청양고추는 두께 0.5cm로 어슷썬다." },
        { step: 6, description: "10분 후 물이 졸아들면 졸아든 만큼의 물을 보충한 후 신김치, 국간장, 굵은 고춧가루, 고운 고춧가루, 간 마늘을 넣는다. " },
        { step: 7, description: "찌개가 팔팔 끓으면 대파, 청양고추를 넣는다.  " },
        { step: 8, description: "완성 직전에 고춧가루를 뿌려 완성한다." },
        // { step: 9, description: "돼지고기를 넣고 볶는다" },
        // { step: 10, description: "돼지고기를 넣고 볶는다" },
      ]
    },
    {
      title: "계란말이",
      image: "./asset/recipe/eggmari.jpg",
      mainIngredients: [
        { ingredient: "달걀", cap: "6개(왕란 5개)"},
      ],
      requiredIngredients: [
        { ingredient: "달걀", cap: "6개(왕란 5개)"},
        { ingredient: "당근", cap: "1/5컵(20g)"},
        { ingredient: "대파", cap: "1/2컵(30g)"},
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "대파와 당근은 작은 크기로 다지듯이 잘게 썬다." },
        { step: 2, description: "그릇에 달걀을 깨뜨려 담고 소금과 설탕을 넣는다." },
        { step: 3, description: "젓가락으로 저어 달걀을 푼다." },
        { step: 4, description: "달걀에 채소를 넣고 섞는다." },
        { step: 5, description: "팬에 식용유를 두르고 달군 뒤 약불에서 달걀물을 반쯤 붓는다." },
        { step: 6, description: "달걀의 가장자리가 익고 윗면이 마르기 시작하면 말아준다." },
        { step: 7, description: "달걀말이를 다시 뒤집어 팬 앞쪽으로 밀고 달걀물을 다시 부어 말아준다." },
        { step: 8, description: "달걀물을 다 사용할 때 까지 반복한다." },
        { step: 9, description: "달걀말이의 모양을 잡아가며 완전히 익힌다." },
        { step: 10, description: "완성 된 달걀말이는 알맞은 크기로 썰어 완성한다." },
      ]
    },
    {
      title: "떡볶이",
      image: "./asset/recipe/tteokbokki.jpg",
      mainIngredients: [
        { ingredient: "떡볶이떡", cap: "8컵(800g)"},
        { ingredient: "고추장", cap: "1/3컵(80g))"},
      ],
      requiredIngredients: [
        { ingredient: "떡볶이떡", cap: "8컵(800g)"},
        { ingredient: "사각어묵", cap: "4장(160g)"},
        { ingredient: "양배추", cap: "2컵(160g))"},
        { ingredient: "대파", cap: "3컵(240g)"},
        { ingredient: "삶은달걀", cap: "3개"},
        { ingredient: "고추장", cap: "1/3컵(80g)"},
        { ingredient: "고춧가루", cap: ""},
        { ingredient: "설탕", cap: "1/3컵(70g)"},
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "대파는 어슷 썰거나 반으로 갈라 길게 썰어 준비한다." },
        { step: 2, description: "양배추, 어묵은 먹기 좋은 크기로 썰어 준비한다." },
        { step: 3, description: "냄비에 물, 진간장, 황설탕, 고추장, 굵은고춧가루, 고운고춧가루, 대파, 양배추를 넣어 끓인다." },
        { step: 4, description: "떡볶이떡은 흐르는 물에 가볍게 세척한다." },
        { step: 5, description: "육수가 끓으면 삶은달걀, 떡을 넣고 함께 끓여준다." },
        { step: 6, description: "기호에 맞게 MSG를 넣는다." },
        { step: 7, description: "떡을 넣고 육수가 끓어오르면 어묵을 넣어준다." },
        { step: 8, description: "양념장이 걸쭉하게 졸아들 때까지 끓여 완성한다." },
        // { step: 9, description: "돼지고기를 넣고 볶는다" },
        // { step: 10, description: "돼지고기를 넣고 볶는다" },
      ]
    },
    {
      title: "김치전",
      image: "./asset/recipe/kimchijeon.jpg",
      mainIngredients: [
        { ingredient: "김치", cap: "2컵(260g)"},
        { ingredient: "부침가루", cap: "2컵(220g)"},
      ],
      requiredIngredients: [
        { ingredient: "김치", cap: "2컵(260g)"},
        { ingredient: "부침가루", cap: "2컵(220g)"},
        { ingredient: "청양고추", cap: "2개(20g)"},
        { ingredient: "대파", cap: "2/5대(40g)"},
        { ingredient: "소시지", cap: "2개(90g)"},
        { ingredient: "고춧가루", cap: "1큰술(6g)"},
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "김치는 가위를 이용하여 잘게 자른다. (신 김치가 아니면 양조식초를 넣어주면 된다.)" },
        { step: 2, description: "대파와 청양고추는 송송 썬다." },
        { step: 3, description: "소시지는 최대한 얇게 편 썬다." },
        { step: 4, description: "큰 볼에 신 김치, 대파, 청양고추, 소시지를 넣고 섞는다." },
        { step: 5, description: "고운 고춧가루, 황설탕, 부침가루, 물을 넣어 뭉치지 않게 섞는다." },
        { step: 6, description: "프라이팬을 달군 뒤 식용유를 넉넉히 두르고 반죽을 넣어 얇게 편다." },
        { step: 7, description: "반죽이 익기 시작하면 팬을 돌려가며 기름이 김치전 안쪽으로 들어가게 한다." },
        { step: 8, description: "가장자리 윗부분이 익기 시작하면 뒤집는다." },
        { step: 9, description: "뒤집은 후 팬을 돌려가면서 부쳐주고 완전히 익으면 다시 한번 뒤집어 익힌 뒤 완성한다." },
        // { step: 10, description: "돼지고기를 넣고 볶는다" },
      ]
    },
    {
      title: "잡채",
      image: "./asset/recipe/japchae.jpg",
      mainIngredients: [
        { ingredient: "당면", cap: "250g" },
        { ingredient: "시금치", cap: "150g" },
        { ingredient: "돼지고기", cap: "2/3컵(110g)" },
        { ingredient: "건목이버섯", cap: "1/2컵(3g)" },
      ],
      requiredIngredients: [
        { ingredient: "당면", cap: "250g" },
        { ingredient: "시금치", cap: "150g" },
        { ingredient: "돼지고기", cap: "2/3컵(110g)" },
        { ingredient: "건목이버섯", cap: "1/2컵(3g)" },
        { ingredient: "양파", cap: "2컵(180g)" },
        { ingredient: "대파", cap: "2/3컵(40g)" },
        { ingredient: "당근", cap: "2/3컵(40g)" },
        { ingredient: "진간장", cap: "4큰술(30g)" },
        { ingredient: "황설탕", cap: "2큰술(22g)" },
        { ingredient: "참기름", cap: "4큰술(25g)" },
        { ingredient: "간마늘", cap: "1/2큰술(15g)" },
        { ingredient: "식용유", cap: "4큰술(25g)" },
        { ingredient: "꽃소금", cap: "1/3큰술(2g)" },
        { ingredient: "통깨", cap: "1/2큰술(4g)" },
        { ingredient: "MSG", cap: "1/3큰술(2g)" },
        { ingredient: "후추가루", cap: "1g" },
        { ingredient: "캐러멜", cap: "1g" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "당면을 물에 30분 정도 불린다." },
        { step: 2, description: "시금치는 뿌리를 제거하고 한 줄기씩 뜯어 준비한다." },
        { step: 3, description: "양파는 결 방향으로 가늘게 채 썬다." },
        { step: 4, description: "당근은 채 썰고 대파는 길게 어슷썰기 한다." },
        { step: 5, description: "목이버섯은 물에 30분 정도 불려 한 입 크기로 뜯거나 잘라 준비한다." },
        { step: 6, description: "프라이팬에 식용유를 1 큰 술 정도 두르고 채 썬 돼지고기를 볶아준다." },
        { step: 7, description: "프라이팬에 식용유 1 큰 술 정도 둘러 양파, 후춧가루를 넣어 중불에서 숨이 죽지 않게 볶는다." },
        { step: 8, description: "프라이팬에 식용유를 1/2 큰 술 정도 두르고 당근, 소금을 넣어 중불에서 볶는다." },
        { step: 9, description: "프라이팬에 식용유를 1/2 큰 술 정도 두르고 목이버섯을 중불에서 볶는다." },
        { step: 10, description: "프라이팬에 식용유를 1/3 큰 술 정도 두르고 대파를 중불에서 볶는다." },
        { step: 11, description: "물에 소금을 넣고 끓여 시금치를 12초 정도 데쳐낸다." },
        { step: 12, description: "끓는 물에 불린 당면을 넣어 삶고 찬물에 헹궈 준비한다." },
        { step: 13, description: "찬물에 헹군 당면의 물기를 충분히 제거하고 가위를 이용하여 먹기 좋게 자른다." },
        { step: 14, description: "당면에 볶은 재료, 시금치, 간 마늘을 넣어 골고루 섞어준다." },
        { step: 15, description: "설탕, 간장, 소금을 넣어 간을 맞추고 참기름, 후춧가루, MSG, 캐러멜을 넣어 섞는다." },
        { step: 16, description: "완성접시에 담은 후 통깨를 뿌려 마무리한다." }
      ]
    },
    
    {
      title: "소고기뭇국",
      image: "./asset/recipe/beefmoosoup.jpg",
      mainIngredients: [
        { ingredient: "무", cap: "1과1/2컵(230g)" },
        { ingredient: "소고기", cap: "1컵(150g)" },
      ],
      requiredIngredients: [
        { ingredient: "무", cap: "1과1/2컵(230g)" },
        { ingredient: "소양지", cap: "1컵(150g)" },
        { ingredient: "양파", cap: "1/4개(50g)" },
        { ingredient: "참기름", cap: "1큰술(8g)" },
        { ingredient: "식용유", cap: "1큰술(8g)" },
        { ingredient: "대파", cap: "1/3컵(30g)" },
        { ingredient: "간마늘", cap: "1큰술(15g)" },
        { ingredient: "국간장", cap: "2큰술(20g)" },
        { ingredient: "멸치액젓", cap: "2큰술(20g)" },
        { ingredient: "꽃소금", cap: "1/2큰술(5g)" },
        { ingredient: "후춧가루", cap: "적당량" },
        { ingredient: "물", cap: "1.5L" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "무는 사방 3cm 정도로 편 썰기 하여 준비한다." },
        { step: 2, description: "소고기는 핏기를 제거하여 준비한다." },
        { step: 3, description: "대파는 송송 썰거나 어슷썰고 양파는 채 썰어 준비한다." },
        { step: 4, description: "냄비에 참기름, 식용유을 두르고 소고기를 넣어 볶는다." },
        { step: 5, description: "고기의 겉면이 익으면 무를 넣어 볶는다." },
        { step: 6, description: "고기가 익으면 물, 간마늘, 국간장, 멸치액젓을 넣고 중불에서 20분 정도 끓인다." },
        { step: 7, description: "소고기가 부드러워지면 양파를 넣어 끓인다." },
        { step: 8, description: "소금으로 간을 맞추고 대파,후추를 넣어 마무리한다." }
      ]
    },
    {
      title: "계란찜",
      image: "./asset/recipe/eggjjim.jpg",
      mainIngredients: [
        { ingredient: "달걀", cap: "6개(324g)" },
      ],
      requiredIngredients: [
        { ingredient: "달걀", cap: "6개(324g)" },
        { ingredient: "새우젓", cap: "1큰술(15g)" },
        { ingredient: "설탕", cap: "1작은술(5g)" },
        { ingredient: "물", cap: "1/3컵(60ml)" },
        { ingredient: "참기름", cap: "1큰술(15ml)" },
        { ingredient: "참깨", cap: "1작은술(5g)" },
        { ingredient: "대파", cap: "40g" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "대파는 송송 썰고, 새우젓은 잘게 다져 준비합니다." },
        { step: 2, description: "믹싱볼에 달걀과 새우젓, 설탕을 넣고 잘 섞습니다." },
        { step: 3, description: "재료가 잘 섞이면 물을 넣고 다시 한 번 잘 저어줍니다." },
        { step: 4, description: "뚝배기에 달걀물을 넣고 중약불로 가열합니다." },
        { step: 5, description: "달걀이 뚝배기 바닥과 가장자리에 눌어붙지 않도록, 숟가락으로 바닥을 긁어가며 끓여줍니다." },
        { step: 6, description: "달걀이 몽글몽글하게 익으면 대파를 넣고 섞습니다." },
        { step: 7, description: "사이즈가 맞는 다른 뚝배기를 뒤집어 뚜껑처럼 덮어 약불로 익힙니다." },
        { step: 8, description: "대파, 참기름, 깨를 달걀찜 위에 고명으로 뿌려 마무리합니다." }
      ]
    },
    {
      title: "감자전",
      image: "./asset/recipe/potatoejeon.jpg",
      mainIngredients: [
        { ingredient: "감자", cap: "2-3개(400g)" },
      ],
      requiredIngredients: [
        { ingredient: "감자", cap: "2-3개(400g)" },
        { ingredient: "꽃소금", cap: "약간" },
        { ingredient: "식용유", cap: "4큰술" },
        { ingredient: "물", cap: "2컵(360ml)" },
        { ingredient: "청양고추", cap: "적당량" },
        { ingredient: "청양고추", cap: "1개(10g)" },
        { ingredient: "진간장", cap: "3큰술(30g)" },
        { ingredient: "식초", cap: "1큰술(8g)" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "감자는 껍질을 벗겨 적당한 크기로 자른다." },
        { step: 2, description: "믹서기에 자른 감자와 물을 넣고 곱게 간다." },
        { step: 3, description: "가는 체에 간 감자를 거른 후, 전분이 가라앉도록 약 10~15분 정도 둔다." },
        { step: 4, description: "물에서 분리된 전분이 가라앉으면 조심히 물을 따라내고 전분만 남긴다." },
        { step: 5, description: "전분만 남은 볼에 체에 걸러 둔 감자를 섞는다." },
        { step: 6, description: "반죽에 꽃소금을 넣어 골고루 섞는다." },
        { step: 7, description: "청양고추는 가늘게 송송 썬다." },
        { step: 8, description: "넓은 팬에 식용유를 넉넉히 두르고 중 불에서 팬을 달군 후 감자전 반죽을 한 국자씩 올린다." },
        { step: 9, description: "감자전 위에 송송 썬 청양고추를 올린다." },
        { step: 10, description: "감자전을 뒤집어 가며 노릇하게 부친다." },
        { step: 11, description: "잘 익힌 감자전을 양념장과 함께 낸다." },
        { step: 12, description: "양념장용 청양고추는 두께 0.3cm 정도로 송송 썬다." },
        { step: 13, description: "그릇에 진간장, 청양고추, 식초를 섞어서 양념장을 만든다." }
      ]
    },
    
    {
      title: "콩나물국",
      image: "./asset/recipe/kongnamulsoup.jpg",
      mainIngredients: [
        { ingredient: "콩나물", cap: "300g" },
      ],
      requiredIngredients: [
          { ingredient: "콩나물", cap: "300g" },
          { ingredient: "정수물", cap: "약 11컵(2L)" },
          { ingredient: "대파", cap: "약 1/2대(40g)" },
          { ingredient: "간마늘", cap: "1큰술(20g)" },
          { ingredient: "꽃소금", cap: "약 1큰술(10g)" },
          { ingredient: "국간장", cap: "1과 1/2큰술(15g)" },
          { ingredient: "청양고추", cap: "1개(10g)" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "콩나물은 가볍게 세척한 후 체에 밭쳐 물기를 제거한다." },
        { step: 2, description: "대파, 청양고추는 두께 0.3cm로 송송 썰어 준비한다." },
        { step: 3, description: "냄비에 정수물을 넣고 끓어오르면 콩나물, 국간장, 간 마늘, 꽃소금을 넣고 강불에 끓인다." },
        { step: 4, description: "국물이 끓어오르면 중불로 줄여 약 5분 정도 끓인 후 대파, 청양고추를 넣고 1분 정도 더 끓여 완성한다." } 
      ]
    },
    
    {
      title: "감바스 알 아히요",
      image: "./asset/recipe/gambas.jpg",
      mainIngredients: [
        { ingredient: "새우", cap: "大 사이즈(26/30) 10마리(100g)" },
        { ingredient: "마늘", cap: "15개(75g)" },
      ],
      requiredIngredients: [
        { ingredient: "새우", cap: "大 사이즈(26/30) 10마리(100g)" },
        { ingredient: "마늘", cap: "15개(75g)" },
        { ingredient: "양송이버섯", cap: "4개(80g)" },
        { ingredient: "방울토마토", cap: "6개(60g)" },
        { ingredient: "고추", cap: "5개(2g)" },
        { ingredient: "올리브유", cap: "1컵(180ml)" },
        { ingredient: "맛소금", cap: "약 1/5큰술(3g)" },
        { ingredient: "후춧가루", cap: "약간" },
        { ingredient: "파슬리가루", cap: "약간" },
        { ingredient: "바게트", cap: "적당량" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "바게트와 식빵을 먹기 좋은 크기로 자르고, 팬에 노릇하게 구워 준비한다." },
        { step: 2, description: "새우는 세척하고, 통마늘은 으깨주고, 양송이버섯은 4등분으로 썰어준다." },
        { step: 3, description: "방울토마토는 꼭지를 떼고 세척하여 2등분으로 썰어준다." },
        { step: 4, description: "팬에 올리브유를 넣어주고 으깬 통마늘, 부순 베트남 고추, 맛소금을 넣고 중약 불로 마늘 오일을 뽑아주며 노릇하게 색을 내준다." },
        { step: 5, description: "새우, 양송이버섯, 방울토마토를 넣고 새우가 익을 때까지 끓여준다." },
        { step: 6, description: "세팅 그릇에 담아 준 후, 후춧가루, 파슬리가루를 뿌려 완성해준다." },
        { step: 7, description: "바게트 or 식빵을 구워 함께 곁들어 먹는다." }
      ]
    }
  ],
  christmas: [
    {
      title: "버터갈릭새우",
      image: "./asset/recipe/buttergarlicshrimp.jpg",
      mainIngredients: [
        { ingredient: "새우", cap: "20마리" },
        { ingredient: "버터", cap: "20g" },
      ],
      requiredIngredients: [
        { ingredient: "새우", cap: "20마리" },
        { ingredient: "버터", cap: "20g" },
        { ingredient: "올리고당", cap: "2큰술" },
        { ingredient: "다진마늘", cap: "1큰술" },
        { ingredient: "파슬리", cap: "약간" },
        { ingredient: "후추", cap: "약간" },
        { ingredient: "올리브유", cap: "약간" },
        { ingredient: "소금", cap: "약간" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "새우는 껍질을 깐 뒤 내장을 제거한다." },
        { step: 2, description: "손질한 새우에 소금, 올리브유, 후추를 약간씩 넣고 버무린 다음 10분간 재운다." },
        { step: 3, description: "버터 20g, 다진 마늘 2큰술, 올리고당 2큰술, 파슬리 가루 약간을 넣어 버터갈릭 소스를 만든다." },
        { step: 4, description: "프라이팬을 중불로 달군 뒤 새우를 넣고 굽는다." },
        { step: 5, description: "새우가 살짝 익으면 만들어 둔 버터갈릭 소스를 넣고 볶는다." },
        { step: 6, description: "버터갈릭 소스가 졸아들 때까지 계속 볶으면 버터갈릭새우가 완성된다." }
      ]
    },
    {
      title: "카나페",
      image: "./asset/recipe/canape.jpg",
      mainIngredients: [
        { ingredient: "크래커", cap: "2~3봉" },
        { ingredient: "치즈", cap: "2~4장" },
      ],
      requiredIngredients: [
        { ingredient: "크래커", cap: "2~3봉" },
        { ingredient: "치즈", cap: "2~4장" },
        { ingredient: "참치캔", cap: "1캔" },
        { ingredient: "마요네즈", cap: "2큰술" },
        { ingredient: "케첩", cap: "1큰술" },
        { ingredient: "오이", cap: "1/2개" },
        { ingredient: "토마토", cap: "1개" },
        { ingredient: "키위", cap: "1개" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "캔참치는 기름을 따라버리고 마요네즈 2큰술, 케첩 1큰술을 넣어 잘 섞어주세요." },
        { step: 2, description: "크래커를 넓은 쟁반에 펼쳐줍니다. 기호에 따라 IVY, 참크래커, 야채크래커 어떤 것이든 좋아요." },
        { step: 3, description: "오이를 0.3mm 두께로 슬라이스 해주세요. 크래커 숫자 만큼 슬라이스해 준비하면 돼요." },
        { step: 4, description: "슬라이스 한 오이를 크래커에 올려주세요." },
        { step: 5, description: "토마토도 크래커 수 만큼 얇게 슬라이스 해주세요. 토마토 크기에 따라 원통형으로 슬라이스 해도 되고, 방울토마토를 사용해도 돼요." },
        { step: 6, description: "슬라이스한 토마토를 4의 오이 위에 올려주세요." },
        { step: 7, description: "치즈도 기호에 따라 4등분 또는 9등분 해서 올려주세요." },
        { step: 8, description: "앞서 마요네즈와 케첩을 넣어 섞어두었던 참치를 올려주세요." },
        { step: 9, description: "삼각형으로 슬라이스 한 키위를 올려 데코해주세요. 기호 또는 계절에 따라 파인애플, 딸기, 귤, 오렌지 등 마지막 데코 과일은 자유롭게 해주시면 돼요." }
      ]
    },
    {
      title: "두부오이롤",
      image: "./asset/recipe/tofucucum.jpg",
      mainIngredients: [
        { ingredient: "두부", cap: "300g" },
        { ingredient: "오이 슬라이스", cap: "8~10장" },
      ],
      requiredIngredients: [
        { ingredient: "두부", cap: "300g" },
        { ingredient: "오이 슬라이스", cap: "8~10장" },
        { ingredient: "햄", cap: "70g" },
        { ingredient: "치즈", cap: "1장" },
        { ingredient: "쌈장", cap: "적당량" }
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "두부는 끓는물에 데쳐내고 칼로 1~2cm정도 두께로 썰어준다음 칼을 넓은 부분으로 눌러 으깨준다." },
        { step: 2, description: "면보자기에 으깬 두부를 넣고 물기를 꼭 짜낸다." },
        { step: 3, description: "물기를 짜낸 두부를 그릇에 담아준다." },
        { step: 4, description: "끓는 물에 햄을 데쳐 기름기와 염분을 제거한다." },
        { step: 5, description: "오이는 감자깍는 칼을 이용해서 한겹한겹 8장 정도 슬라이스해준다." },
        { step: 6, description: "햄은 잘게 다진다." },
        { step: 7, description: "치즈도 햄과 비슷한 크기로 썰어준다." },
        { step: 8, description: "두부에 다진 햄과 치즈를 넣고 골고루 섞어준다." },
        { step: 9, description: "오이로 말아줄 수 있도록 타원형으로 두부 반죽을 만든다." },
        { step: 10, description: "오이 위에 두부 반죽을 올려 돌돌 말아준다." },
        { step: 11, description: "말아놓은 두부롤 위에 강낭콩 크기만큼 쌈장을 올려 완성한다." }
      ]
    },
  ],
  random: [
    {
      title: "시크릿 레시피",
      requiredIngredients: [
        { ingredient: "", cap: "" },
      ],
      missingIngredients: [],
      howto: [
        { step: 1, description: "" },
        { step: 2, description: "" },
        { step: 3, description: "" },
        { step: 4, description: "" },
        { step: 5, description: "" },
        { step: 6, description: "" },
        { step: 7, description: "" },
        { step: 8, description: "" },
        { step: 9, description: "" },
        { step: 9, description: "" },
      ],
      isRainbow: true // 레인보우 효과를 위한 플래그
    }
  ]
};


///////////////////////////함수 시작

function calculateUI() {
    margin = windowWidth * 0.05;  // 여기서 margin 재계산
    let containerWidth = windowWidth - (margin * 2);
    cardWidth = containerWidth;  // cardWidth 계산

    backButton = {
      x: 0,
      y: 0,
      w: windowHeight * 0.1,
      h: windowHeight * 0.05
    };

    
    fridgeBox = {
        x: margin,
        y: margin,
        w: containerWidth,
        h: windowHeight * 0.2
    };
    
    recipeButton = {
        x: margin,
        y: fridgeBox.y + fridgeBox.h - (windowHeight * 0.06),
        w: containerWidth - margin,
        h: windowHeight * 0.06
    };
    
    confidenceBox = {
        x: margin,
        y: windowHeight * 0.6,
        w: containerWidth,
        h: windowHeight * 0.06
    };
    
    labelBox = {
        x: margin,
        y: windowHeight * 0.7,
        w: containerWidth - (windowHeight * 0.08) - margin,
        h: windowHeight * 0.06
    };
    
    addButton = {
        x: labelBox.x + labelBox.w + (margin/2),
        y: labelBox.y,
        w: windowHeight * 0.06,
        h: windowHeight * 0.06
    };
    backButton = {
      x: 0,
      y: 0,
      w: windowHeight * 0.1,
      h: windowHeight * 0.05
  };

  fridgeBox = {
      x: margin,
      y: margin,
      w: containerWidth,
      h: windowHeight * 0.2
  };

  recipeButton = {
      x: margin,
      y: fridgeBox.y + fridgeBox.h - (windowHeight * 0.06),
      w: containerWidth - margin,
      h: windowHeight * 0.06
  };
}

function preload() {
    ml5.setBackend('webgl');
    classifier = ml5.imageClassifier(imageModelURL + "model.json");

    // 레시피 이미지 로드
    recipes.home.forEach(recipe => {
      if (recipe.image) {
          recipe.loadedImage = loadImage(recipe.image, 
              // 성공 콜백
              () => console.log(`${recipe.title} 이미지 로드 성공`),
              // 실패 콜백
              () => console.log(`${recipe.title} 이미지 로드 실패`)
          );
      }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateUI();  // UI 계산
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  classifier.classifyStart(video, gotResult);

  //start
  for(let i=0;i<pageNum;i++){
      pageBool[i] = false;
  }
  pageBool[0] = true;
  // myFridge = ['당근', '양파', '감자', '달걀', '우유', '닭가슴살', '새우'];
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateUI();
    video.size(windowWidth, windowWidth);
}

///////////////////draw함수

function draw() {
    background(255);
    for(let i=0;i<pageNum;i++){
      if(pageBool[i]===true){
        pageIndex = i;
        resetPages(i);
      }
    }
  
}

function resetPages(index){
  for(let i=0;i<pageNum;i++){
    pageBool[i] = false;
  }
  pageBool[index] = true;
  let funcName = 'page' + index;
  window[funcName]();
}

///////////////////////////////////// page0 함수들

function drawCamera() {
    image(video, 0, windowHeight/10, windowWidth, windowHeight*0.7);
}

function drawFridgeBox() {
    // 냉장고 박스 배경
    fill(245, 245, 220);
    rect(fridgeBox.x, fridgeBox.y, fridgeBox.w, fridgeBox.h, 15);
    
    // 제목 (고정 위치)
    fill(0);
    textStyle(BOLD);
    textSize(24);
    text("내 냉장고", fridgeBox.x + 20, fridgeBox.y + 35);
    textStyle(NORMAL);
    
    // 아이템 목록 영역
    let startY = fridgeBox.y + 50;
    let visibleHeight = fridgeBox.h - 60;
    let itemHeight = 60;  // 라벨 영역과 동일한 높이로 변경
    
    // 각 아이템 그리기
    textSize(18);
    for(let i = 0; i < myFridge.length; i++) {
        let yPos = startY + (i * itemHeight) + fridgeScrollY;
        
        if (yPos >= startY && yPos <= startY + visibleHeight) {
            // 아이템 박스
            fill(245, 245, 220);
            rect(fridgeBox.x + 10, yPos, fridgeBox.w - 70, itemHeight - 10, 25);
            
            // 삭제 버튼
            fill(255, 150, 150);  // 빨간색 계열
            rect(fridgeBox.x + fridgeBox.w - 50, yPos, 40, itemHeight - 10, 25);
            
            // 텍스트
            fill(0);
            textAlign(LEFT, CENTER);
            text(myFridge[i], fridgeBox.x + 30, yPos + (itemHeight - 10)/2);
            
            // 삭제 버튼 텍스트
            textAlign(CENTER, CENTER);
            textStyle(BOLD);
            text("-", fridgeBox.x + fridgeBox.w - 30, yPos + (itemHeight - 10)/2);
            textStyle(NORMAL);
            textAlign(LEFT, BASELINE);
        }
    }
}

function drawRecipeButton() {
    fill(255, 220, 100);
    rect(recipeButton.x, recipeButton.y, recipeButton.w, recipeButton.h, 25);
    fill(0);
    textAlign(CENTER, CENTER);
    text("레시피 추천받기 →", recipeButton.x + recipeButton.w/2, recipeButton.y + recipeButton.h/2);
    textAlign(LEFT, BASELINE);
}

function drawConfidenceBox() {
    if(confidence > 0 && label) {
        fill(220, 240, 255);
        rect(confidenceBox.x, confidenceBox.y, confidenceBox.w, confidenceBox.h, 25);
        fill(0);
        textAlign(CENTER, CENTER);
        text(`${label} ${confidence.toFixed(1)}%`, confidenceBox.x + confidenceBox.w/2, confidenceBox.y + confidenceBox.h/2);
        textAlign(LEFT, BASELINE);
    }
}

function drawDetectedLabels() {
    // 라벨 영역의 시작과 끝 위치 정의
    let startY = labelBox.y;
    let visibleHeight = windowHeight * 0.2;
    
    // 스크롤 영역 표시 (선택사항)
    fill(240);
    rect(labelBox.x, startY, labelBox.w + addButton.w + 10, visibleHeight);
    
    // 보여질 라벨의 시작과 끝 인덱스 계산
    let itemHeight = 60;
    let startIndex = Math.floor(-labelScrollY / itemHeight);
    let endIndex = Math.min(
        startIndex + Math.ceil(visibleHeight / itemHeight),
        detectedLabels.length
    );
    
    // 보이는 영역의 라벨만 그리기
    for (let i = Math.max(0, startIndex); i < endIndex; i++) {
        let currentLabel = detectedLabels[i];
        
        if (!shownLabels.includes(currentLabel)) {
            let yPos = startY + (i * itemHeight) + labelScrollY;
            
            if (yPos >= startY && yPos <= startY + visibleHeight) {
                fill(245, 245, 220);
                rect(labelBox.x, yPos, labelBox.w, labelBox.h, 25);
                
                fill(255, 220, 100);
                rect(addButton.x, yPos, addButton.w, addButton.h, 25);
                
                fill(0);
                textAlign(LEFT, CENTER);
                text(currentLabel, labelBox.x + 20, yPos + labelBox.h/2);
                textAlign(CENTER, CENTER);
                textStyle(BOLD);
                text("+", addButton.x + addButton.w/2, yPos + addButton.h/2);
                textStyle(NORMAL);
                textAlign(LEFT, BASELINE);
            }
        }
    }
}

function gotResult(results) {
  label = results[0].label;
  confidence = results[0].confidence * 100;
  
  if (!detectedLabels.includes(label) && !shownLabels.includes(label)&&confidence>50) {
      detectedLabels.push(label);
      detectedConfidences.push(confidence);
  }
}

/////////////////////////////////page1 함수들

function drawFridgeBoxPage1() {
  // 냉장고 박스 배경
  fill(245, 245, 220);
  rect(fridgeBox.x, fridgeBox.y, fridgeBox.w, fridgeBox.h, 15);
  
  // 제목 (고정 위치)
  fill(0);
  textStyle(BOLD);
  textSize(24);
  text("내 냉장고", fridgeBox.x + 20, fridgeBox.y + 35);
  textStyle(NORMAL);
  
  // 아이템 목록 영역 정의
  let startY = fridgeBox.y + 50;  // 아이템 시작 y좌표
  let visibleHeight = fridgeBox.h - 60;  // 보여질 수 있는 영역의 높이
  let itemHeight = 25;  // 각 아이템의 높이
  
  // 아이템 그리기
  textSize(18);
  
  // 스크롤 가능한 영역 설정
  for(let i = 0; i < myFridge.length; i++) {
      // 현재 아이템의 y 위치 계산 (스크롤 위치 반영)
      let yPos = startY + (i * itemHeight) + fridgeScrollY;
      
      // 보이는 영역 내에 있는 아이템만 그리기
      if (yPos >= startY && yPos <= startY + visibleHeight) {
          text("• " + myFridge[i], fridgeBox.x + 20, yPos);
      }
  }
  
  // 스크롤 범위 제한
  let maxScroll = -Math.max(0, (myFridge.length * itemHeight) - visibleHeight);
  fridgeScrollY = constrain(fridgeScrollY, maxScroll, 0);
}


function drawRecipeCard(recipe, y) {
  if (!recipe) return;
  
  // random 카테고리의 특별한 레시피인 경우
  if (recipe.isRainbow) {
    // 레인보우 배경 효과
    let colors = [
      color(255, 0, 0),    // 빨
      color(255, 127, 0),  // 주
      color(255, 255, 0),  // 노
      color(0, 255, 0),    // 초
      color(0, 0, 255),    // 파
      color(75, 0, 130),   // 남
      color(148, 0, 211)   // 보
    ];
    
    // 그라데이션 효과
    for (let i = 0; i < cardWidth; i++) {
      let inter = map(i, 0, cardWidth, 0, colors.length - 1);
      let c = lerpColor(
        colors[floor(inter)], 
        colors[min(floor(inter) + 1, colors.length - 1)], 
        inter % 1
      );
      stroke(c);
      line(margin + i, y, margin + i, y + recipeCardHeight);
    }
    noStroke();
    
    // 텍스트
    textSize(24);
    textStyle(BOLD);
    fill(255);
    textAlign(CENTER, CENTER);
    text(recipe.title, 
         margin + cardWidth/2, 
         y + recipeCardHeight/2);
    
    // 스타일 초기화
    textStyle(NORMAL);
    textAlign(LEFT, BASELINE);
    textSize(18);
    return;
  }

  // 메인 재료가 모두 있는지 확인
  let hasAllMainIngredients = recipe.mainIngredients ? 
      recipe.mainIngredients.every(item => myFridge.includes(item.ingredient)) 
      : false;

  // 메인 재료가 하나라도 없으면 레시피를 표시하지 않음
  if (!hasAllMainIngredients) return;

  // 가진 재료와 없는 재료 계산
  let availableIngredients = recipe.requiredIngredients.filter(item => 
      myFridge.includes(item.ingredient)
  );
  let missingIngredients = recipe.requiredIngredients.filter(item => 
      !myFridge.includes(item.ingredient)
  );
  
  // 카드 배경
  fill(245);
  rect(margin, y, cardWidth, recipeCardHeight, 15);
  // 이미지 영역 (왼쪽)
  
  if (recipe.loadedImage && recipe.loadedImage.width) {
    // 로드된 이미지가 있는 경우
    image(recipe.loadedImage, margin + 10, y + 10, imageSize, imageSize);
  } else {
    // 이미지가 없거나 로드되지 않은 경우 기본 회색 사각형
    fill(200);
    rect(margin + 10, y + 10, imageSize, imageSize, 10);
  }
  
  // 제목
  fill(0);
  textSize(18);
  text(recipe.title, margin + imageSize + 20, y + 20);
  
  // 가진 재료 (파란색)
  textSize(16);
  fill(0);
  text(`가진 재료(${availableIngredients.length}개): `, margin + imageSize + 20, y + 50);
  fill(0, 0, 255); // 파란색

  // 텍스트 줄바꿈을 위한 설정
  let availableText = availableIngredients.map(item => item.ingredient).join(', ');
  let startX = margin + imageSize + 20 + textWidth(`가진 재료(${availableIngredients.length}개): `);
  let maxWidth = windowWidth - startX - margin; // 최대 너비
  let words = availableText.split(', ');
  let lineData = '';
  let yOffset = 0;

  // 단어별로 확인하며 줄바꿈
  words.forEach((word, index) => {
      let testLine = lineData + word + (index < words.length - 1 ? ', ' : '');
      if (textWidth(testLine) > maxWidth) {
          text(lineData, startX, y + 50 + yOffset);
          lineData = word + ', ';
          yOffset += 20; // 줄간격
      } else {
        lineData = testLine;
      }
  });
  text(lineData, startX, y + 50 + yOffset);

  // 없는 재료 (빨간색)
  fill(0);
  text(`없는 재료(${missingIngredients.length}개): `, margin + imageSize + 20, y + 80 + yOffset);
  fill(255, 0, 0);

  // 없는 재료도 같은 방식으로 줄바꿈
  let missingText = missingIngredients.map(item => item.ingredient).join(', ');
  startX = margin + imageSize + 20 + textWidth(`없는 재료(${missingIngredients.length}개): `);
  words = missingText.split(', ');
  lineData = '';
  let missingYOffset = 0;

  words.forEach((word, index) => {
      let testLine = lineData + word + (index < words.length - 1 ? ', ' : '');
      if (textWidth(testLine) > maxWidth) {
          text(lineData, startX, y + 80 + yOffset + missingYOffset);
          lineData = word + ', ';
          missingYOffset += 20;
      } else {
        lineData = testLine;
      }
  });
  text(lineData, startX, y + 80 + yOffset + missingYOffset);
}

//random 식재료 카테고리 체크
function checkIngredientCategories() {
  let hasProtein = myFridge.some(item => ingredients[item]?.category === '육류');
  // let hasDairy = myFridge.some(item => ingredients[item]?.category === '유제품');
  let hasVegetable = myFridge.some(item => ingredients[item]?.category === '야채');
  // let hasSeasoning = myFridge.some(item => ingredients[item]?.category === '양념류');
  if(hasVegetable&&hasProtein){ //&& hasDairy && hasVegetable && hasSeasoning
    return true;
  }
  else {
    return false; 
  }
}

function getVisibleCategories() {
  let categories = [
      {id: 'all', text: '전체🍽️'},
      {id: 'home', text: '가정용🏡'},
      {id: 'christmas', text: '특별한날🎅'},
      {id: 'student', text: '자취생🧑‍🎓'}
  ];
  
  // 모든 카테고리의 재료가 있을 때만 random 카테고리 추가
  if (checkIngredientCategories()) {
      categories.push({id: 'random', text: '🌚??'});
  }
  
  return categories;
}

// drawCategoryButtons 함수 수정
function drawCategoryButtons() {
  push();
  translate(categoryScroll, 0);
  
  let x = margin;
  let visibleCategories = getVisibleCategories();  // 보이는 카테고리만 가져오기
  
  visibleCategories.forEach(cat => {
      // 버튼 배경
      fill(cat.id === selectedCategory ? 220 : 255);
      rect(x, categoryY, buttonWidth, buttonHeight, 25);
      
      // 버튼 텍스트
      fill(0);
      textAlign(CENTER, CENTER);
      text(cat.text, x + buttonWidth/2, categoryY + buttonHeight/2);
      
      x += buttonWidth + 10;
  });
  
  pop();
}

function getAllRecipes() {
  let allRecipes = [];
  // 모든 카테고리의 레시피를 합침
  for (let category in recipes) {
      allRecipes = allRecipes.concat(recipes[category].map(recipe => ({
          ...recipe,
          category: category // 카테고리 정보 추가
      })));
  }
  return allRecipes;
}

function getAvailableRecipes(recipeList) {
  return recipeList.filter(recipe => {
      // 메인 재료가 모두 있는지 확인
      let hasAllMainIngredients = recipe.mainIngredients ? 
          recipe.mainIngredients.every(item => myFridge.includes(item.ingredient)) 
          : false;

      // 메인 재료가 모두 있는 레시피만 반환
      return hasAllMainIngredients;
  });
}

function recipeRecommandation(){
   // 냉장고 영역
   drawFridgeBoxPage1();
  
   // 카테고리 버튼들
   drawCategoryButtons();
   
    // 레시피 목록
    push();
    translate(0, recipeScroll);
    
    let y = recipeStartY;
    let currentRecipes = [];
    
    if (selectedCategory === 'random' && checkIngredientCategories()) {
        // random 카테고리이면서 조건을 만족할 때만 특별 레시피 표시
        currentRecipes = [{
            title: "숨겨진 레시피",
            isRainbow: true
        }];
    } else if (selectedCategory === 'all') {
        // 전체 카테고리일 때
        let allRecipes = [];
        ['home', 'christmas', 'student'].forEach(category => {
            if (recipes[category]) {
                allRecipes = allRecipes.concat(recipes[category]);
            }
        });
        currentRecipes = getAvailableRecipes(allRecipes);
    } else if (selectedCategory !== 'random') {
        // random이 아닌 다른 카테고리들
        currentRecipes = getAvailableRecipes(recipes[selectedCategory] || []);
    }
    
    // 실제로 그려질 레시피들만 순차적으로 배치
    currentRecipes.forEach(recipe => {
        drawRecipeCard(recipe, y);
        y += recipeCardHeight + 20;
    });
 
    pop();
}

//////////////page 2



////////////////////////////interaction 관련

function mouseWheel(event) {
  // 이벤트의 기본 동작 방지
  event.preventDefault();

  if(pageIndex === 0){
    // 라벨 영역 스크롤
    if (mouseX >= labelBox.x && 
      mouseX <= addButton.x + addButton.w &&
      mouseY >= labelBox.y && 
      mouseY <= labelBox.y + (windowHeight * 0.2)) {
      
      labelScrollY -= event.delta;
      let maxScroll = -Math.max(0, (detectedLabels.length * 60) - (windowHeight * 0.2));
      labelScrollY = constrain(labelScrollY, maxScroll, 0);
      
      return false;
    }

    // page0의 냉장고 영역 스크롤
    if (mouseX >= fridgeBox.x && 
      mouseX <= fridgeBox.x + fridgeBox.w &&
      mouseY >= fridgeBox.y + 50 && 
      mouseY <= fridgeBox.y + fridgeBox.h) {
      
      fridgeScrollY -= event.delta;
      let maxScroll = -Math.max(0, (myFridge.length * 60) - (fridgeBox.h - 60));
      fridgeScrollY = constrain(fridgeScrollY, maxScroll, 0);
      
      return false;
    }
  }
  else if(pageIndex === 1){
    // page1의 냉장고 영역 스크롤
    if (mouseX >= fridgeBox.x && 
        mouseX <= fridgeBox.x + fridgeBox.w &&
        mouseY >= fridgeBox.y + 50 && 
        mouseY <= fridgeBox.y + fridgeBox.h) {
      
      fridgeScrollY -= event.delta;
      let maxScroll = -Math.max(0, (myFridge.length * 25) - (fridgeBox.h - 60));
      fridgeScrollY = constrain(fridgeScrollY, maxScroll, 0);
      
      return false;
    }

    // 카테고리 영역에서의 가로 스크롤
    if(mouseY < categoryY + buttonHeight) {
      categoryScroll -= event.delta;
      // 스크롤 범위 제한 로직 추가
      return false;
    }
    
    // 레시피 목록 영역에서의 세로 스크롤
    if(mouseY > recipeStartY) {
      recipeScroll -= event.delta;
      // 스크롤 범위 제한 로직 추가
      return false;
    }

    // 카테고리 영역에서의 가로 스크롤
    if(mouseY < categoryY + buttonHeight) {
      categoryScroll -= event.delta;
      // 스크롤 범위 제한
      let maxScroll = -(buttonWidth * 3 + 20 - windowWidth + margin * 2);
      categoryScroll = constrain(categoryScroll, maxScroll, 0);
      return false;
    }
  }
  else if(pageIndex === 2){
    let methodBoxY = 250 + 150 + 20;
    let boxHeight = 300;
    let boxMargin = 40;
    let boxWidth = 300;
    
    if (mouseX >= boxMargin && 
        mouseX <= boxMargin + boxWidth &&
        mouseY >= methodBoxY && 
        mouseY <= methodBoxY + boxHeight) {
      
      methodScrollY -= event.delta;
      
      // 스크롤 범위 제한
      let totalHeight = recipe.howto.length * 20; // 전체 내용 높이 계산
      let maxScroll = -Math.max(0, totalHeight - boxHeight);
      methodScrollY = constrain(methodScrollY, maxScroll, 0);
      
      return false;
    }
  }

  return false; // 페이지 전체 스크롤 방지
}

function mouseClicked() {

  if(pageIndex === 0){
    // 레시피 버튼 클릭 -> page1으로 이동
    if (mouseX > recipeButton.x && 
      mouseX < recipeButton.x + recipeButton.w &&
      mouseY > recipeButton.y && 
      mouseY < recipeButton.y + recipeButton.h) {
        console.log("레시피 추천받기 버튼 클릭되었음");
        resetPages(1); //page1로 이동
        checkPage = true;
        return;  // 다른 클릭 이벤트 처리 방지
    }
    
    // 냉장고 아이템 삭제 버튼 체크
    let startY = fridgeBox.y + 50;
    let itemHeight = 60;
    
    for(let i = 0; i < myFridge.length; i++) {
        let yPos = startY + (i * itemHeight) + fridgeScrollY;
        let deleteX = fridgeBox.x + fridgeBox.w - 50;
        
        if (mouseX > deleteX && mouseX < deleteX + 40 &&
            mouseY > yPos && mouseY < yPos + itemHeight - 10) {
            // 냉장고에서 아이템 제거
            let removedLabel = myFridge[i];
            myFridge.splice(i, 1);
            // shownLabels에서도 제거하여 다시 인식 가능하게 함
            let labelIndex = shownLabels.indexOf(removedLabel);
            if (labelIndex > -1) {
                shownLabels.splice(labelIndex, 1);
            }
            return;
        }
    }
    
    // 라벨 추가 버튼 체크
    for (let i = 0; i < detectedLabels.length; i++) {
        let currentLabel = detectedLabels[i];
        let yPos = labelBox.y + (i * 60) + labelScrollY;
        
        if (!shownLabels.includes(currentLabel) &&
            mouseX > addButton.x && mouseX < addButton.x + addButton.w &&
            mouseY > yPos && mouseY < yPos + addButton.h) {
            
            if (!myFridge.includes(currentLabel)) {
                myFridge.push(currentLabel);
                shownLabels.push(currentLabel);
            }
            
            let index = detectedLabels.indexOf(currentLabel);
            if (index > -1) {
                detectedLabels.splice(index, 1);
                detectedConfidences.splice(index, 1);
            }
        }
    }
      }

    if (pageIndex === 1) {
      // 뒤로가기 버튼 클릭 체크
    if (mouseX > backButton.x && 
      mouseX < backButton.x + backButton.w &&
      mouseY > backButton.y && 
      mouseY < backButton.y + backButton.h) {
      console.log("뒤로가기 버튼 클릭");
      resetPages(0);
      return;
  }

  // 카테고리 버튼 클릭 체크
  if (mouseY >= categoryY && mouseY <= categoryY + buttonHeight) {
      let x = margin + categoryScroll;
      let visibleCategories = getVisibleCategories(); // 보이는 카테고리만 가져오기
      
      visibleCategories.forEach(cat => {
          if (mouseX >= x && mouseX <= x + buttonWidth) {
              selectedCategory = cat.id;
              recipeScroll = 0; // 스크롤 위치 초기화
              console.log("선택된 카테고리:", cat.text);
          }
          x += buttonWidth + 10;
      });
      return;
  }

  // 레시피 카드 클릭 체크
  let recipeAreaHeight = windowHeight - recipeStartY - margin;
  if (mouseY >= recipeStartY && mouseY <= recipeStartY + recipeAreaHeight) {
      let currentRecipes;
      
      // random 카테고리이고 조건을 만족할 때
      if (selectedCategory === 'random' && checkIngredientCategories()) {
          currentRecipes = [{
              title: "숨겨진 레시피",
              isRainbow: true
          }];
      } else if (selectedCategory === 'all') {
          currentRecipes = getAvailableRecipes(getAllRecipes());
      } else {
          currentRecipes = getAvailableRecipes(recipes[selectedCategory] || []);
      }

      let y = recipeStartY + recipeScroll;

      currentRecipes.forEach((recipe, index) => {
          if (mouseY >= y && mouseY <= y + recipeCardHeight &&
              mouseX >= margin && mouseX <= margin + cardWidth) {
              console.log("선택된 레시피:", recipe.title);
              selectedRecipe = recipe;
              resetPages(2);
          }
          y += recipeCardHeight + 20;
      });
  }
  }


  
  if (pageIndex === 2) {
      // 뒤로가기 버튼 클릭 체크
      if (mouseX > backButton.x && 
          mouseX < backButton.x + backButton.w &&
          mouseY > backButton.y && 
          mouseY < backButton.y + backButton.h) {
          console.log("뒤로가기 버튼 클릭");
          resetPages(1);
          return;
      }

  }
}
////////////////////interaction 관련 끝///////////////






///////////// pages

//home
function page0(){ 
  if(checkPage === true){
    console.log(pageIndex);
    checkPage = false;
  }
  drawCamera();
  drawFridgeBox();
  drawRecipeButton();
  drawConfidenceBox();
  drawDetectedLabels();
}

//레시피 추천
function page1() {
  if(checkPage === true){
    console.log(pageIndex);
    console.log("=== 현재 냉장고 재료 목록 ===");
    myFridge.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
    });
    checkPage = false;
  }
  recipeRecommandation();
   
   // 뒤로가기 버튼
   drawBackButton();
}

//레시피
function page2() {
  page2UI();
  // 뒤로가기 버튼
  drawBackButton();
}

/////////////////////////////////////////////////////////////page2

// 제목과 카테고리 표시
function drawRecipeHeader(recipe, boxMargin, boxWidth) {
  // 레시피 제목 박스
  fill(240);
  rect(boxMargin, 80, boxWidth, 150, 15);
  if (recipe.loadedImage && recipe.loadedImage.width) {
    // 로드된 이미지가 있는 경우
    image(recipe.loadedImage, boxMargin+50, 100, imageSize, imageSize);
  }
  
  // 제목 텍스트
  fill(0);
  textSize(24);
  text(recipe.title, boxMargin + 200, 120);
  
  // 카테고리 버튼
  fill(240);
  rect(boxMargin + 200, 140, 100, 40, 20);
  fill(0);
  textSize(16);
  text(getCategoryEmoji(recipe.category), boxMargin + 215, 165);
}

// 또는 객체를 사용한 방식
const categoryEmojis = {
  home: '👨‍👩‍👧가정용',
  student: '🧑‍🎓자취생',
  christmas: '🎅특별한날',
  random: '🌚??',
  all: '🍽️전체'
};

function getCategoryEmoji(category) {
  return categoryEmojis[category] || '🍽️전체';
}
function drawAvailableIngredients(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight) {
  push();
  // 박스 그리기
  fill(240);
  rect(boxMargin, ingredientBoxY, boxWidth/2 - 10, ingredientBoxHeight, 15);
  
  // 제목
  fill(0);
  textSize(12);
  text("있는 재료", boxMargin + 20, ingredientBoxY + 30);
  
  // 재료 목록
  let availableY = ingredientBoxY + 60;
  recipe.requiredIngredients.forEach((ingredientObj, i) => {
      if(myFridge.includes(ingredientObj.ingredient)) {  // ingredient 속성으로 비교
          fill(0, 0, 255);
          text(ingredientObj.ingredient, boxMargin + 20, availableY + (i * 25));
      }
  });
  pop();
}

// 없는 재료 표시 함수
function drawMissingIngredients(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight) {
  push();
  // 박스 그리기
  fill(240);
  rect(boxMargin + boxWidth/2 + 10, ingredientBoxY, boxWidth/2 - 10, ingredientBoxHeight, 15);
  
  // 제목
  fill(0);
  textSize(12);
  text("없는 재료", boxMargin + boxWidth/2 + 30, ingredientBoxY + 30);
  
  // 재료 목록
  let missingY = ingredientBoxY + 60;
  recipe.requiredIngredients.forEach((ingredientObj, i) => {
      if(!myFridge.includes(ingredientObj.ingredient)) {  // ingredient 속성으로 비교
          fill(255, 0, 0);
          text(ingredientObj.ingredient, boxMargin + boxWidth/2 + 30, missingY -30 + (i * 15));
      }
  });
  pop();
}

// 재료 목록 표시
function drawIngredientBoxes(recipe, boxMargin, boxWidth) {
  let ingredientBoxY = 250;
  let ingredientBoxHeight = 150;
  
  // 있는 재료 박스
  drawAvailableIngredients(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight);
  
  // 없는 재료 박스
  drawMissingIngredients(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight);
}
function drawCookingMethod(recipe, boxMargin, boxWidth) {
  let methodBoxY = 250 + 150 + 20;
  let boxHeight = 300;
  
  // 배경 박스
  fill(240);
  rect(boxMargin, methodBoxY, boxWidth, boxHeight, 15);
  
  // 스크롤 가능한 영역 설정
  push();
  translate(0, methodScrollY);
  
  fill(0);
  textSize(18);
  text("조리방법", boxMargin + 20, methodBoxY + 30);
  
  if(recipe.howto) {
      let availableWidth = boxWidth - 30;
      
      recipe.howto.forEach((step, i) => {
          let stepText = `${step.step}. ${step.description}`;
          let words = stepText.split(' ');
          let line = '';
          let y = methodBoxY + 50 + (i * 40);
          
          textSize(12);
          
          words.forEach(word => {
              let testLine = line + word + ' ';
              let testWidth = textWidth(testLine);
              
              if (testWidth > availableWidth) {
                  text(line, boxMargin + 20, y);
                  line = word + ' ';
                  y += 15;
              } else {
                  line = testLine;
              }
          });
          
          text(line, boxMargin + 20, y);
      });
  }
  pop();
}


//////////////////////////////////////////////////// 랜덤


// 랜덤 레시피 생성 함수
function generateRandomRecipe(ingredients) {
  // 1. 랜덤 포맷 선택
  const format = recipeFormats[Math.floor(Math.random() * recipeFormats.length)];
  
  // 2. 랜덤 형용사 선택
  const adjective = recipeAdjectives[Math.floor(Math.random() * recipeAdjectives.length)];
  
  // 3. 제목용 랜덤 재료 선택
  const titleIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
  
  // 4. 조리 단계 생성
  const steps = format.format.map(step => {
    let text = step.text;
    
    // 재료 매핑
    text = replaceIngredients(text, ingredients);
    
    // 조리법 매핑
    if (step.type === "cutting") {
      text = replaceCookingMethod(text, cuttingMethods);
    } else if (step.type === "cooking") {
      text = replaceCookingMethod(text, cookingMethods);
    } 
    
    text = replaceSeasonings(text, basicSeasonings);
    //조리도구맵핑
    text = replaceCookingTools(text, cookingTools);
    
    return text;
  });

  // 5. 완성된 레시피 반환
  return {
    title: `${adjective} ${titleIngredient.name}의 재탄생!`,
    ingredients: ingredients,
    steps: steps,
    isRainbow: true
  };
}
// 레시피 생성 관련 보조 함수들
function replaceIngredients(text, ingredients) {
  let result = text;
  
  // 선택된 재료들을 순서대로 매핑
  ingredients.forEach((ingredient, index) => {
    result = result.replace(`[재료${index + 1}]`, ingredient.name);
  });
  
  return result;
}

function replaceCookingMethod(text, methodArray) {
  let result = text;
  const methodPattern = /\[조리법\d+\]/g;
  const matches = text.match(methodPattern);
  
  if (matches) {
    matches.forEach(() => {
      const randomMethod = methodArray[Math.floor(Math.random() * methodArray.length)];
      result = result.replace(methodPattern, randomMethod);
    });
  }
  return result;
}

function replaceCookingTools(text, methodArray) {
  let result = text;
  const toolPattern = /\[조리도구\]/g;  // 정규표현식으로 변경
  const matches = text.match(toolPattern);
  
  if (matches) {
    matches.forEach(() => {
      const randomMethod = methodArray[Math.floor(Math.random() * methodArray.length)];
      result = result.replace(toolPattern, randomMethod);
    });
  }
  return result;
}

function replaceSeasonings(text) {
  let result = text;
  while (result.includes('[양념류]')) {
    const randomSeasoning = basicSeasonings[Math.floor(Math.random() * basicSeasonings.length)];
    result = result.replace('[양념류]', randomSeasoning);
  }
  return result;
}

// UI 함수 수정
function drawRecipeHeaderRandom(recipe, boxMargin, boxWidth) {
  // 배경
  fill(255, 182, 193); // 부드러운 톤의 빨간색
  rect(boxMargin, 50, boxWidth, 60, 15);
  
  // 제목 텍스트
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(recipe.title, boxMargin + boxWidth/2, 80);
  textAlign(LEFT, BASELINE);
}

function drawCookingMethodRandom(recipe, boxMargin, boxWidth) {
  let methodBoxY = 350;
  fill(240);
  rect(boxMargin, methodBoxY, boxWidth, 300, 15);
  
  fill(0);
  textSize(18);
  text("조리방법", boxMargin + 20, methodBoxY + 30);
  
  if(recipe.steps) {
    let availableWidth = boxWidth - 30;
    recipe.steps.forEach((step, i) => {
      let y = methodBoxY + 60 + (i * 30);
      textSize(14);
      text(`${i + 1}. ${step}`, boxMargin + 20, y);
    });
  }
}

function drawAvailableIngredientsRandom(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight) {
  push();
  // 박스 그리기
  fill(240);
  rect(boxMargin, 120, boxWidth, ingredientBoxHeight, 15);
  
  // 제목
  fill(0);
  textSize(18);
  text("준비된 재료", boxMargin + 20, 150);
  
  // 재료 목록
  textSize(14);
  recipe.ingredients.forEach((ingredient, i) => {
    text(`• ${ingredient.name}`, boxMargin + 20, 180 + (i * 25));
  });
  pop();
}

function drawIngredientBoxesRandom(recipe, boxMargin, boxWidth) {
  let ingredientBoxY = 250;
  let ingredientBoxHeight = 200;
  drawAvailableIngredientsRandom(recipe, boxMargin, boxWidth, ingredientBoxY, ingredientBoxHeight);
}

// page2UI 함수 수정
function page2UI() {
  if (!selectedRecipe) {
    selectedRecipe = recipes.home[0];
  }
  
  let boxMargin = 20;
  let boxWidth = windowWidth - (boxMargin * 2);

  if(selectedRecipe.isRainbow){
    push();
    for(let i=0;i<windowWidth;i++){
      let r = 127+127*sin(i*0.01+t);
      let g = 127+127 * sin(i*0.01 + t + 2);
      let b = 127 + 127*sin(i*0.01 + t + 4);
      stroke(r,g,b);
      line(i,0,i,height);
    }
    t += 0.05;
  // 랜덤 레시피 생성 (처음 한 번만)
  if (!selectedRecipe.steps) {
    // myFridge에서 랜덤하게 3~5개 재료 선택
    let shuffledIngredients = [...myFridge].sort(() => Math.random() - 0.5); // 재료 랜덤 섞기
    let numberOfIngredients = Math.floor(Math.random() * 3) + 5; // 3~5개 랜덤 선택
    
    // 선택된 재료들을 객체 형태로 변환
    selectedIngredients = shuffledIngredients
      .slice(0, numberOfIngredients)
      .map(item => ({
        name: item,
        category: ingredients[item]?.category
      }));
    
    // 레시피 생성
    Object.assign(selectedRecipe, generateRandomRecipe(selectedIngredients));
  }
    
    drawRecipeHeaderRandom(selectedRecipe, boxMargin, boxWidth);
    drawIngredientBoxesRandom(selectedRecipe, boxMargin, boxWidth);
    drawCookingMethodRandom(selectedRecipe, boxMargin, boxWidth);
    pop();
  } else {
    drawRecipeHeader(selectedRecipe, boxMargin, boxWidth);
    drawIngredientBoxes(selectedRecipe, boxMargin, boxWidth);
    drawCookingMethod(selectedRecipe, boxMargin, boxWidth);
  }
}

//////////////뒤로가기 버튼(UI)
function drawBackButton() {
  fill(255, 150, 150);  // 빨간색 계열
  rect(backButton.x, backButton.y, backButton.w, backButton.h, 25);
  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("←", backButton.x + backButton.w/2, backButton.y + backButton.h/2);
  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);
}
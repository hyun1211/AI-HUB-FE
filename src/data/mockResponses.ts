// SSE 스트리밍을 위한 더미 응답 데이터
export const mockResponses = [
  {
    id: 1,
    trigger: "안녕",
    response: `안녕하세요! **AI Hub**에 오신 것을 환영합니다. 😊

무엇을 도와드릴까요? 다음과 같은 주제로 질문해보세요:

- 프로그래밍 언어
- 웹 개발
- 인공지능
- 일반적인 지식

궁금한 점이 있으시면 언제든 물어보세요!`,
  },
  {
    id: 2,
    trigger: "날씨",
    response: `## 날씨 정보 안내

죄송하지만 저는 *실시간 날씨 정보*에 접근할 수 없습니다.

하지만 날씨 관련 **일반적인 정보**나 조언은 드릴 수 있어요!

### 추천 날씨 앱
- Weather.com
- AccuWeather
- 기상청 날씨누리

> 날씨 정보는 신뢰할 수 있는 공식 기상청 앱을 이용하시는 것을 추천드립니다.`,
  },
  {
    id: 3,
    trigger: "코딩",
    response: `# 프로그래밍 언어 가이드

코딩에 대해 궁금하신가요? 저는 다양한 **프로그래밍 언어**와 개발 관련 질문에 답변할 수 있습니다.

## 주요 언어들

| 언어 | 주요 용도 | 난이도 |
|------|-----------|--------|
| Python | 데이터 분석, AI | 쉬움 |
| JavaScript | 웹 개발 | 보통 |
| TypeScript | 타입 안전한 웹 개발 | 보통 |
| Java | 엔터프라이즈, 안드로이드 | 어려움 |

---

어떤 언어가 궁금하신가요? 🤔`,
  },
  {
    id: 4,
    trigger: "React",
    response: `## React란?

**React**는 사용자 인터페이스를 구축하기 위한 *JavaScript 라이브러리*입니다.

### 주요 특징

1. **컴포넌트 기반 아키텍처**
2. **가상 DOM**을 통한 효율적인 렌더링
3. 단방향 데이터 플로우

### 간단한 예제

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return <Welcome name="React" />;
}
\`\`\`

React Hooks를 사용하면 함수형 컴포넌트에서도 \`useState\`, \`useEffect\` 같은 기능을 활용할 수 있습니다.

React에 대해 더 구체적으로 어떤 것이 궁금하신가요?`,
  },
  {
    id: 5,
    trigger: "Next.js",
    response: `# Next.js 프레임워크

**Next.js**는 React 기반의 풀스택 프레임워크입니다! 🚀

## 핵심 기능

- ✅ **서버 사이드 렌더링 (SSR)**
- ✅ **정적 사이트 생성 (SSG)**
- ✅ **API 라우트**
- ✅ **파일 기반 라우팅**
- ✅ **이미지 최적화**

### 설치 방법

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### 간단한 페이지 예제

\`\`\`typescript
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
    </main>
  );
}
\`\`\`

> 현재 이 프로젝트도 Next.js로 만들어졌어요!

더 자세한 내용은 [공식 문서](https://nextjs.org)를 참고하세요.`,
  },
  {
    id: 6,
    trigger: "TypeScript",
    response: `## TypeScript 소개

**TypeScript**는 JavaScript에 *정적 타입*을 추가한 프로그래밍 언어입니다.

### 왜 TypeScript를 사용할까?

1. **타입 안정성** - 개발 중 오류를 미리 발견
2. **더 나은 IDE 지원** - 코드 자동완성과 리팩토링
3. **대규모 프로젝트에 적합** - 유지보수성 향상

### 기본 타입 예제

\`\`\`typescript
// 기본 타입 정의
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;

// 인터페이스
interface User {
  id: number;
  name: string;
  email?: string; // 선택적 속성
}

// 함수 타입
function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

TypeScript를 사용하면 코드의 **품질**과 **안정성**이 크게 향상됩니다! 💪`,
  },
  {
    id: 7,
    trigger: "AI",
    response: `# 인공지능 (Artificial Intelligence)

**인공지능(AI)**은 컴퓨터 시스템이 인간의 지능을 모방하여 학습, 추론, 문제 해결 등을 수행하는 기술입니다.

## AI의 주요 분야

### 1. 머신러닝 (Machine Learning)
데이터로부터 패턴을 학습하는 기술

### 2. 딥러닝 (Deep Learning)
신경망을 활용한 고급 학습 기법

### 3. 자연어 처리 (NLP)
인간의 언어를 이해하고 생성하는 기술

---

## AI 활용 예시

\`\`\`python
# 간단한 머신러닝 예제
from sklearn.linear_model import LinearRegression

# 모델 생성
model = LinearRegression()

# 학습
model.fit(X_train, y_train)

# 예측
predictions = model.predict(X_test)
\`\`\`

> AI는 현재 의료, 금융, 교육, 엔터테인먼트 등 다양한 산업에서 혁신을 일으키고 있습니다.

**흥미로운 사실**: ChatGPT와 같은 대화형 AI도 NLP 기술을 기반으로 합니다! 🤖`,
  },
  {
    id: 8,
    trigger: "default",
    response: `흥미로운 질문이네요! 🤔

제가 가진 지식을 바탕으로 답변드리자면, 이 주제는 **매우 다양한 관점**에서 접근할 수 있습니다.

### 추가로 알려주시면 도움이 될 정보:

- 구체적인 상황이나 맥락
- 관심 있는 특정 부분
- 원하는 답변의 깊이

더 자세히 설명해주시면 더 도움이 될 수 있을 것 같습니다! 💡`,
  },
];

// 메시지 내용에 따라 적절한 응답을 찾는 함수
export function findMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // 키워드 매칭
  const matchedResponse = mockResponses.find((item) =>
    item.trigger !== "default" && lowerMessage.includes(item.trigger.toLowerCase())
  );

  // 매칭되는 응답이 있으면 반환, 없으면 기본 응답 반환
  return matchedResponse?.response || mockResponses.find(r => r.trigger === "default")!.response;
}

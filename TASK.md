# 전화번호 관리 시스템 개발 체크리스트

이 문서는 `prd.md`의 요구사항을 기반으로 프로젝트를 구현하기 위한 마일스톤 및 세부 작업 체크리스트입니다.

## M1. 프로젝트 초기 설정 및 기반 구축 (Project Setup & Auth)
- [ ] **Next.js 프로젝트 생성**: `app` 라우터 기반 프로젝트 설정
- [ ] **패키지 설치**: Tailwind CSS (기본 포함 시 확인), UI 라이브러리(선택), Supabase 클라이언트 SDK, Zod, DOMPurify 등
- [ ] **Supabase 프로젝트 생성 및 설정**:
  - [ ] 새 프로젝트 생성 및 Auth 설정 (Email/Password)
  - [ ] 데이터베이스 테이블 2개 생성 (`categories`, `contacts`) 및 인덱스 설정
  - [ ] RLS(Row Level Security) 정책 적용 스크립트 실행
- [ ] **환경 변수 구성**: `.env.local`에 Supabase URL, Anon Key, `ENCRYPTION_KEY`, `HMAC_KEY` 설정
- [ ] **유틸리티/라이브러리 세팅**: 클라이언트 및 서버용 Supabase 인스턴스 설정 (`lib/supabase/*`)
- [ ] **인증 라우팅 및 페이지 구현**:
  - [ ] 회원가입 페이지 (`/signup`)
  - [ ] 로그인 페이지 (`/login`)
  - [ ] 미들웨어(`middleware.ts`)를 통한 인증 라우트 보호 (비인가 접근 시 `/login` 리다이렉트)

## M2. 분류(카테고리) 및 연락처 데이터 접근층 개발 (Core Data Access & Category Management)
- [ ] **보안 및 암호화 유틸 구현 (`lib/crypto.ts`)**: AES-256-GCM 암/복호화 및 HMAC-SHA256 해시 함수 구현
- [ ] **입력 검증 스키마 작성 (`lib/validators.ts`)**: Zod를 이용한 폼 데이터 검증 규칙
- [ ] **분류(Category) 관리 구현**:
  - [ ] 분류 목록 조회 Server Action
  - [ ] 분류 추가/수정/삭제 Server Actions
  - [ ] 분류 관리 페이지 UI 구현 (`/categories`) 및 폼 연결
- [ ] **연락처(Contact) CRUD 내부 로직 구현 (Server Actions)**:
  - [ ] 연락처 생성 Action (암호화 및 블라인드 인덱싱 포함)
  - [ ] 연락처 읽기(단건/목록) Action (목록 페이징 및 복호화 처리 포함)
  - [ ] 연락처 수정 Action (암호화 적용 및 낙관적 업데이트 대비)
  - [ ] 연락처 삭제 Action (소프트 삭제 처리)

## M3. 연락처 관리 UI 및 주요 기능 구현 (Contacts Management UI & Search)
- [ ] **연락처 생성/수정 UI 구현**:
  - [ ] 공용 연락처 폼 컴포넌트 (`ContactForm.tsx`)
  - [ ] 분류(Category) 선택 드롭다운 연동
  - [ ] 새 연락처 페이지 (`/contacts/new`) 연결
  - [ ] 연락처 수정 페이지 (`/contacts/[id]/edit`) 연결 및 데이터 프리페치
- [ ] **목록 및 필터/검색 UI 구현 (`/contacts`)**:
  - [ ] 연락처 목록 및 카드형(`ContactCard.tsx`) UI 컴포넌트 개발
  - [ ] 카테고리 필터 컴포넌트 (`CategoryFilter.tsx`) 개발
  - [ ] 디바운스(Debouncing) 적용된 검색창 (`SearchBar.tsx`) 구현
  - [ ] 커서 기반 페이지네이션 컴포넌트 (`Pagination.tsx`) 및 무한스크롤(또는 페이징 버튼) 연동
- [ ] **UX 개선**: 삭제 재확인 다이얼로그 (`DeleteDialog.tsx`) 구현

## M4. 애플 스타일 UI/UX 및 테마 고도화 (Apple-Style UI Polishing)
- [ ] **타이포그래피 및 레이아웃**:
  - [ ] 기본 폰트 시스템 구성 설정 (`San Francisco`, 고딕 폴백 지정)
  - [ ] 전역적으로 여유로운 padding/margin 여백 조정 및 컴포넌트 모서리(Border-radius 16px+) 둥글게 처리
- [ ] **스타일링 및 효과 (Glassmorphism & Depth)**:
  - [ ] 모달, 네비게이션, 필터 바에 `backdrop-blur` 적용 (반투명 효과)
  - [ ] 다크/라이트 모드 대응 (오프화이트 ~ 다크그레이 대비 활용)
  - [ ] 부드러운 Drop Shadow 효과 적용
- [ ] **인터랙션(애니메이션) 및 피드백 적용**:
  - [ ] 버튼 및 카드 호버/터치 시 스케일 변환 트랜지션 적용 (0.2~0.3s)
  - [ ] 리스트 항목 삭제, 모달 온오프 시 Fade/Slide 애니메이션 적용
  - [ ] 연락처가 없을 때 표시할 미니멀한 라인 아이콘 기반 비어있음(Empty State) 화면 구현
  - [ ] 에러 및 성공 시 토스트 알림(Toast Notification) 중앙 정렬 둥근 디자인 컴포넌트 구현
  - [ ] 로딩 시 은은한 스켈레톤(Skeleton UI) 전환 확인

## M5. 품질 검증 및 배포 (QA & Deploy)
- [ ] **기능 테스트**: 전체 시나리오(회원가입 -> 로그인 -> 카테고리 생성 -> 연락처 생성/수정/삭제/검색) 동작 점검
- [ ] **보안 점검**:
  - [ ] 연락처 리스트 및 수정 데이터 반환 시 암/복호화 정상 동작 여부
  - [ ] 브라우저 콘솔/네트워크를 통해 평문 개인정보(이름·전화번호)가 전송되지 않도록 확인 (서버에서만 처리 확인)
  - [ ] `DOMPurify` 등 XSS 방지 처리 점검
- [ ] **성능 테스트**: LCP 등 Lighthouse 웹 지표 점검 (Lighthouse 90점 타겟)
- [ ] **배포**: Vercel 연동
  - [ ] Vercel 프로젝트 생성 (GitHub 레포지토리 연동)
  - [ ] 환경 변수 등록 (`NEXT_PUBLIC_SUPABASE_*`, `ENCRYPTION_KEY`, `HMAC_KEY` 등 프로덕션 값 세팅)
  - [ ] 배포 실행 및 커스텀/기본 도메인 점검 (모바일 접속 및 레이아웃 깨짐 확인)

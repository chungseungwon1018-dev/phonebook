# 전화번호 관리 시스템 — PRD (Product Requirements Document)

> **Version**: 1.3  
> **Date**: 2026-03-31  
> **Tech Stack**: Supabase (Postgres) · Next.js 14+ (App Router) · Vercel  
> **변경 이력**:  
> - v1.1 — 이름·전화번호 필드 암호화 요구사항 추가  
> - v1.2 — 연락처 분류(그룹) 관리 기능 추가
> - v1.3 — 애플 스타일 (Apple-style) UI/UX 요구사항 추가

---

## 1. 개요

### 1.1 목적
개인 또는 소규모 팀이 연락처를 안전하고 효율적으로 관리할 수 있는 웹 기반 전화번호 관리 시스템을 구축한다.

### 1.2 배경
- 빠른 개발과 배포를 위해 **Supabase**(인증·DB·RLS)와 **Next.js App Router**(서버 컴포넌트·서버 액션)를 채택한다.
- **Vercel**을 통해 CI/CD 및 글로벌 엣지 배포를 수행한다.

### 1.3 대상 사용자
- 연락처를 웹에서 간편하게 관리하고 싶은 개인 사용자
- 공유 연락처가 필요한 소규모 팀

---

## 2. 기능 요구사항

### 2.1 연락처 추가 (Create)

| 항목 | 내용 |
|---|---|
| **설명** | 새로운 연락처를 등록한다. |
| **입력 필드** | 이름(필수, 최대 50자), 전화번호(필수, 최대 20자), 분류(선택, 드롭다운), 메모(선택, 최대 200자) |
| **유효성 검사** | 이름: 빈 값 불가 · 전화번호: 숫자·하이픈·공백만 허용 (`/^[0-9\-\s]+$/`) |
| **동작** | 저장 성공 시 목록 페이지로 이동, 실패 시 에러 메시지 표시 |

### 2.2 연락처 수정 (Update)

| 항목 | 내용 |
|---|---|
| **설명** | 기존 연락처의 정보를 수정한다. |
| **입력 필드** | 이름, 전화번호, 분류, 메모 (추가와 동일) |
| **유효성 검사** | 추가와 동일한 규칙 적용 |
| **동작** | 수정 성공 시 목록 페이지로 이동, 낙관적 업데이트(Optimistic UI) 권장 |

### 2.3 연락처 삭제 (Delete)

| 항목 | 내용 |
|---|---|
| **설명** | 연락처를 삭제한다. |
| **동작** | 삭제 전 확인 다이얼로그 표시 → 확인 시 소프트 삭제(`deleted_at` 타임스탬프) |
| **복구** | 향후 휴지통 기능 확장 가능하도록 소프트 삭제 방식 채택 |

### 2.4 연락처 검색 (Search)

| 항목 | 내용 |
|---|---|
| **설명** | 이름 또는 전화번호로 연락처를 검색한다. |
| **검색 방식** | 서버사이드에서 복호화 후 부분 일치 필터링 (암호화된 데이터이므로 DB 레벨 ILIKE 불가) |
| **블라인드 인덱스** | HMAC-SHA256 기반 블라인드 인덱스로 정확 일치 검색 최적화, 부분 일치는 서버 복호화 후 필터 |
| **동작** | 검색어 입력 시 300ms 디바운스 적용 후 결과 목록 갱신 |
| **빈 결과** | "검색 결과가 없습니다" 메시지 표시 |

### 2.5 연락처 목록 (List)

| 항목 | 내용 |
|---|---|
| **설명** | 등록된 연락처를 목록으로 표시한다. |
| **필터링** | 선택한 분류(그룹)에 포함된 연락처만 모아보기 |
| **페이징** | 커서 기반 페이지네이션 (페이지당 20건) |
| **정렬** | 기본 정렬: 이름 오름차순 (가나다순) |
| **표시 정보** | 이름, 전화번호, 분류(배지 형태), 메모(일부), 등록일 |

### 2.6 분류 관리 (Category Management)

| 항목 | 내용 |
|---|---|
| **설명** | 연락처를 묶을 수 있는 분류(그룹)를 관리한다. (예: 친구, 친척, 동아리 등) |
| **기능** | 분류 추가, 수정, 삭제 |
| **동작** | 분류 삭제 시, 해당 분류에 속해 있던 연락처의 분류 정보는 `NULL` 처리(연락처 자체는 삭제 안 됨) |
| **색상 지정** | (선택 사항) 그룹별 라벨 색상 커스터마이징 |

---

## 3. 비기능 요구사항

### 3.1 보안

| 항목 | 상세 |
|---|---|
| **인증** | Supabase Auth (이메일/비밀번호 로그인) |
| **RLS (Row Level Security)** | 모든 테이블에 RLS 활성화 — 본인 데이터만 CRUD 가능 |
| **필드 암호화** | 이름·전화번호를 AES-256-GCM으로 서버사이드 암호화 후 DB 저장 (아래 상세) |
| **입력 검증** | 클라이언트 + 서버 양쪽에서 유효성 검사 (이중 검증) |
| **SQL Injection** | Supabase SDK의 파라미터 바인딩으로 방어 |
| **XSS** | React의 자동 이스케이프 + `DOMPurify`로 메모 필드 sanitize |
| **CSRF** | Next.js Server Actions 기본 보호 + SameSite 쿠키 |
| **Rate Limiting** | Vercel Edge Middleware로 API 요청 제한 (분당 60회) |

### 3.2 필드 암호화 (Field-Level Encryption)

> 이름과 전화번호는 **개인정보**에 해당하므로, DB 유출 시에도 평문 노출을 방지하기 위해 필드 단위 암호화를 적용한다.

| 항목 | 상세 |
|---|---|
| **대상 필드** | `name`, `phone` |
| **알고리즘** | AES-256-GCM (인증된 암호화, 무결성 보장) |
| **암호화 위치** | Server Actions (서버사이드 전용) — 클라이언트에 키 노출 금지 |
| **키 관리** | 환경 변수 `ENCRYPTION_KEY` (32바이트 Base64)로 관리, Vercel 환경 변수에 저장 |
| **IV (초기화 벡터)** | 매 암호화 시 랜덤 12바이트 생성, 암호문 앞에 prefix로 저장 |
| **저장 포맷** | `base64(iv + ciphertext + authTag)` → DB의 `TEXT` 컬럼에 저장 |
| **복호화** | 목록 조회·수정 시 Server Component/Action에서 복호화 후 클라이언트에 전달 |
| **검색 지원** | HMAC-SHA256 블라인드 인덱스 (`name_index`, `phone_index`) 컬럼 활용 |
| **키 로테이션** | 향후 지원을 위해 `key_version` 컬럼 포함 |

### 3.3 성능

- 목록 페이지 초기 로드: **< 1.5초** (LCP 기준)
- 검색 응답 시간: **< 500ms** (서버사이드 복호화 포함)
- Lighthouse 성능 점수: **90점 이상**

### 3.4 접근성

- 시맨틱 HTML 사용
- 키보드 내비게이션 지원
- ARIA 라벨링 적용

---

## 4. 기술 아키텍처

### 4.1 시스템 구성도

```
[사용자] → [Vercel Edge Network]
              ↓
         [Next.js App Router]
         ├── Server Components (목록 조회)
         ├── Server Actions (CRUD)
         └── Client Components (검색, 폼)
              ↓
         [Supabase]
         ├── Auth (인증/인가)
         ├── Postgres (데이터 저장)
         └── RLS (행 수준 보안)
```

### 4.2 데이터베이스 스키마

-- 분류(그룹) 테이블
CREATE TABLE categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        VARCHAR(50) NOT NULL,    -- 예: '친구', '가족'
  color       VARCHAR(10),             -- 예: '#FF5733' (선택)
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 연락처 테이블 (이름·전화번호는 암호화된 상태로 저장)
CREATE TABLE contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL, -- 분류 정보
  name_encrypted   TEXT NOT NULL,       -- AES-256-GCM 암호문 (base64)
  phone_encrypted  TEXT NOT NULL,       -- AES-256-GCM 암호문 (base64)
  name_index       TEXT NOT NULL,       -- HMAC-SHA256 블라인드 인덱스 (검색용)
  phone_index      TEXT NOT NULL,       -- HMAC-SHA256 블라인드 인덱스 (검색용)
  key_version      SMALLINT DEFAULT 1,  -- 암호화 키 버전 (키 로테이션 대비)
  memo             VARCHAR(200),        -- 메모는 평문 저장 (민감정보 아님)
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  deleted_at       TIMESTAMPTZ          -- 소프트 삭제용
);

-- 인덱스
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_category_id ON contacts(category_id);

CREATE INDEX idx_contacts_name_index ON contacts(user_id, name_index);
CREATE INDEX idx_contacts_phone_index ON contacts(user_id, phone_index);

-- RLS 정책
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Categories 테이블 RLS 정책
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can full access own categories"
  ON categories FOR ALL
  USING (auth.uid() = user_id);
```

### 4.3 프로젝트 구조

```
phonebook/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 랜딩 → 로그인 리다이렉트
│   ├── login/
│   │   └── page.tsx            # 로그인 페이지
│   ├── signup/
│   │   └── page.tsx            # 회원가입 페이지
│   ├── categories/
│   │   └── page.tsx            # 분류(그룹) 관리 페이지
│   └── contacts/
│       ├── page.tsx            # 연락처 목록 (Server Component)
│       ├── new/
│       │   └── page.tsx        # 연락처 추가 폼
│       └── [id]/
│           └── edit/
│               └── page.tsx    # 연락처 수정 폼
├── components/
│   ├── ContactCard.tsx         # 연락처 카드 컴포넌트
│   ├── ContactForm.tsx         # 추가/수정 공용 폼
│   ├── CategoryFilter.tsx      # 분류 필터 목록
│   ├── SearchBar.tsx           # 검색 바
│   ├── Pagination.tsx          # 페이지네이션
│   └── DeleteDialog.tsx        # 삭제 확인 다이얼로그
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 브라우저 Supabase 클라이언트
│   │   └── server.ts           # 서버 Supabase 클라이언트
│   ├── crypto.ts               # AES-256-GCM 암호화/복호화 + HMAC 블라인드 인덱스
│   └── validators.ts           # Zod 스키마 (입력 검증)
├── actions/
│   └── contacts.ts             # Server Actions (CRUD + 암호화/복호화 처리)
└── middleware.ts               # 인증 미들웨어
```

### 4.4 주요 라이브러리

| 라이브러리 | 용도 |
|---|---|
| `@supabase/supabase-js` | Supabase 클라이언트 |
| `@supabase/ssr` | Next.js SSR 연동 |
| `zod` | 스키마 기반 입력 검증 |
| `dompurify` | XSS 방어 (메모 필드) |
| Node.js `crypto` (내장) | AES-256-GCM 암호화/복호화 + HMAC-SHA256 블라인드 인덱스 |

---

## 5. 화면 설계

### 5.1 페이지 목록

| 경로 | 화면 | 설명 |
|---|---|---|
| `/login` | 로그인 | 이메일 + 비밀번호 로그인 |
| `/signup` | 회원가입 | 이메일 + 비밀번호 가입 |
| `/contacts` | 연락처 목록 | 검색 + 필터(분류) + 목록 + 페이지네이션 |
| `/contacts/new` | 연락처 추가 | 이름·전화번호·분류·메모 입력 폼 |
| `/contacts/[id]/edit` | 연락처 수정 | 기존 데이터 로드 + 수정 폼 |
| `/categories` | 분류 관리 | 분류 목록 + 추가/수정/삭제 폼 |

### 5.2 UI/UX 요구사항 (Apple-Style Design)

> 본 시스템은 사용자에게 친숙하고 세련된 **애플 스타일(Apple-Style)** 디자인을 적용한다.

- **타이포그래피**: 
  - 기본 폰트: 시스템 기본 폰트 사용 (Mac/iOS에서는 `San Francisco`, Windows에서는 맑은 고딕 등 우아한 고딕체 폴백 적용)
  - 가독성을 위해 자간/행간을 여유롭게 배치하고, 제목(Header) 텍스트는 굵고 선명하게 처리
- **레이아웃 및 형태**:
  - 카드 및 패널 디자인 시 모서리가 둥근 `border-radius` (예: 16px 이상) 적용
  - 여백(Margin/Padding)을 넓게 두어 시각적 안정감(Breathing room) 확보
- **색상 및 질감**:
  - **Glassmorphism (글래스모피즘)**: 네비게이션 바, 탭 바, 모달 배경 등에 반투명 효과(`backdrop-blur`)를 적극 활용
  - **다크/라이트 모드 대응**: 시스템 설정에 맞게 배경색과 텍스트 색상을 대비감 있게 (예: 배경은 순백색/완전 흑색 대신 부드러운 오프화이트/다크그레이 사용) 조정
  - 부드럽고 섬세한 Drop Shadow 적용으로 컴포넌트 간 깊이감(Depth) 표현
- **인터랙션 및 애니메이션**:
  - 버튼 호버(Hover) 시 부드러운 스케일링 또는 투명도 변화 애니메이션 적용 (Transition 0.2s~0.3s)
  - 모달 팝업, 리스트 항목 삭제 시 자연스러운 페이드인/페이드아웃 및 슬라이딩 효과 적용
- **에러 처리 및 로딩 상태**: 
  - 스켈레톤(Skeleton) UI 적용 (은은한 펄스 효과 포함)
  - 토스트 알림(Toast Notification)은 화면 상단(또는 하단) 중앙에 둥글고 심플하게 표시
- **빈 상태 (Empty State)**: 
  - 연락처가 없을 때를 위한 미니멀한 라인 아이콘 및 친절한 안내 텍스트, 돋보이는 CTA 버튼 배치

---

## 6. 배포

| 항목 | 상세 |
|---|---|
| **호스팅** | Vercel (프로덕션 + 프리뷰 배포) |
| **환경 변수** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ENCRYPTION_KEY` (서버 전용, 32바이트 Base64), `HMAC_KEY` (서버 전용, 32바이트 Base64) |
| **CI/CD** | GitHub → Vercel 자동 배포 (main 브랜치 push 시) |
| **도메인** | Vercel 기본 도메인 사용 (커스텀 도메인 추후 연결 가능) |

---

## 7. 마일스톤

| 단계 | 내용 | 예상 기간 |
|---|---|---|
| **M1** | 프로젝트 초기 설정 + Supabase 연동 + 인증 | 1일 |
| **M2** | 연락처 CRUD 구현 | 1일 |
| **M3** | 검색 + 페이지네이션 구현 | 0.5일 |
| **M4** | UI 폴리싱 + 반응형 + 다크모드 | 0.5일 |
| **M5** | 보안 점검 + Vercel 배포 | 0.5일 |

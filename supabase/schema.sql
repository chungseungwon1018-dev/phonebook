-- 1. 분류(그룹) 테이블 생성
CREATE TABLE categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        VARCHAR(50) NOT NULL,
  color       VARCHAR(10),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. 연락처 테이블 생성
CREATE TABLE contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_encrypted   TEXT NOT NULL,
  phone_encrypted  TEXT NOT NULL,
  name_index       TEXT NOT NULL,
  phone_index      TEXT NOT NULL,
  key_version      SMALLINT DEFAULT 1,
  memo             VARCHAR(200),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);

-- 3. 검색 및 조회 성능을 위한 인덱스 추가
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_category_id ON contacts(category_id);
CREATE INDEX idx_contacts_name_index ON contacts(user_id, name_index);
CREATE INDEX idx_contacts_phone_index ON contacts(user_id, phone_index);

-- 4. Categories 테이블 RLS(보안) 정책 설정
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can full access own categories"
  ON categories FOR ALL
  USING (auth.uid() = user_id);

-- 5. Contacts 테이블 RLS(보안) 정책 설정
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 조회: 내 연락처이며 삭제되지 않은 것만
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 추가: 내 UID로만 추가 가능
CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 수정: 내 연락처만 수정 가능
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

-- 삭제: 내 연락처만 삭제 가능
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

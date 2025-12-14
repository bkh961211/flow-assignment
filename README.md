## 서버 개발자 과제 정리

- PDF 위치: `/Users/baekwangho/Downloads/Server Developer Assignment.pdf`
- 내용 요약
  - 특정 확장자(exe, sh 등) 업로드 차단 기능 구현.
  - **고정 확장자**: 자주 차단하는 목록이 기본 제공되며 기본값은 체크 해제. 체크/해제 시 DB 저장, 새로고침 후에도 상태 유지. 커스텀 영역에는 표시하지 않음.
  - **커스텀 확장자**: 직접 추가 가능, 입력 길이 최대 20자. 추가 시 DB 저장 후 목록에 표시. 최대 200개까지 추가 가능. 항목 옆 X 클릭 시 DB에서 삭제.
  - 추가 고려사항 예시: 커스텀 확장자 중복 체크 등.
  - 제출: 면접일까지 유지되는 사이트 + 과제 수행 git 주소.

## 초기 작업 상태

- 작업 폴더 생성: `/Users/baekwangho/server-developer-assignment`
- 가상환경 생성: `.venv` (PDF 텍스트 추출용 PyPDF2 설치 완료)

## 구현 계획 (Express + PostgreSQL)

1. Express 기반 API + PostgreSQL(Pg Pool) 연결.
2. 테이블 생성
   - `fixed_extensions`: ext(unique), is_blocked, created_at.
   - `custom_extensions`: ext(unique), created_at, 길이 체크(<=20).
3. 시드: 자주 쓰는 고정 확장자 기본 등록.
4. API
   - GET `/api/fixed` : 고정 확장자 목록 조회
   - PUT `/api/fixed/:ext` : 차단 상태 on/off 저장
   - GET `/api/custom` : 커스텀 확장자 목록 조회
   - POST `/api/custom` : 커스텀 확장자 추가 (중복/길이/문자검증, 최대 200개)
   - DELETE `/api/custom/:ext` : 커스텀 확장자 삭제
5. UI: 단일 페이지(정적 파일)로 체크/추가/삭제와 상태 유지 확인.

## 로컬 실행 방법

1. `.env` 파일 생성 (`.env.example` 참고) 후 PostgreSQL 연결 정보 입력.
2. 의존성 설치: `npm install`
3. 개발 서버: `npm run dev` (http://localhost:3000)
4. 빌드/실행: `npm run build && npm start`

## Fly.io 배포(무료 플랜 예시, Neon DB 연결)

사전: `brew install flyctl` 후 `flyctl auth login` 또는 `export FLY_API_TOKEN=...` 으로 인증.

1. `.env`의 `DATABASE_URL`을 Neon 연결 문자열(sslmode=require)로 설정하고 Fly 시크릿으로 등록:
   ```bash
   flyctl secrets set DATABASE_URL="postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
2. 앱 이름 수정: `fly.toml`의 `app = "server-ext-blocker"`를 고유 이름으로 변경.
3. 배포:
   ```bash
   flyctl deploy
   ```
4. 헬스체크/동작 확인:
   ```bash
   curl https://<앱이름>.fly.dev/health
   curl https://<앱이름>.fly.dev/api/fixed
   ```
5. 커스텀 도메인(DuckDNS 등) 연결 시:
   ```bash
   flyctl certs add <your-duckdns-domain>
   # DNS CNAME을 <앱이름>.fly.dev 로 설정 후 HTTPS 확인
   ```

## 추가 고려사항 기록용

- 중복 체크: 커스텀/고정 영역 교차 중복 방지.
- 입력 검증: 영문 소문자/숫자/-/_ 허용, 최대 20자, 앞 점(.) 제거 후 저장.
- 커스텀 개수 제한: 200개 초과 시 추가 불가.
- 상태 지속: 고정 확장자 체크/해제 시 DB 반영 후 재로딩 시 유지.

추가 요구사항이나 선호 스택이 있으면 알려주세요.

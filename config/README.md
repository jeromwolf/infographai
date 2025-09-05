# ⚙️ Configuration Files

프로젝트 설정 파일들을 관리합니다.

## 📁 구조

```
config/
├── nginx/          # Nginx 설정 (production)
├── env/            # 환경별 설정 파일
└── k8s/            # Kubernetes 설정 (future)
```

## 🔐 환경 변수 관리

환경별 설정:
- `.env.local` - 로컬 개발
- `.env.staging` - 스테이징 서버
- `.env.production` - 프로덕션

## ⚠️ 보안 주의사항

- 절대 실제 API 키를 커밋하지 마세요
- 환경 변수는 반드시 `.env` 파일로 관리
- 프로덕션 설정은 별도 관리
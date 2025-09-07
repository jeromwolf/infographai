# 이미지 자산 소스 가이드

InfoGraphAI에서 사용할 이미지 자산들의 소스와 수집 가이드입니다.

## 📸 무료 이미지 소스

### 1. Unsplash
- **URL**: https://unsplash.com/
- **라이센스**: Unsplash License (무료, 상업적 사용 가능)
- **특징**: 고품질 사진, API 제공
- **추천 검색어**: 
  - "technology", "coding", "laptop"
  - "education", "learning", "books"
  - "business", "office", "meeting"

### 2. Pexels
- **URL**: https://www.pexels.com/
- **라이센스**: Pexels License (무료)
- **특징**: 사진 + 동영상, API 제공
- **추천 검색어**:
  - "programmer", "developer", "code"
  - "student", "classroom", "online learning"
  - "abstract", "gradient", "minimal"

### 3. Pixabay
- **URL**: https://pixabay.com/
- **라이센스**: Pixabay License (무료)
- **특징**: 사진, 일러스트, 벡터
- **추천 검색어**:
  - "technology background"
  - "education illustration"
  - "data visualization"

### 4. Freepik (무료 컬렉션)
- **URL**: https://www.freepik.com/
- **라이센스**: Freepik License (무료, 크레딧 필요)
- **특징**: 벡터, 일러스트, PSD
- **추천**: 인포그래픽 요소, 아이콘

### 5. unDraw
- **URL**: https://undraw.co/
- **라이센스**: MIT License
- **특징**: 일관성 있는 일러스트, 컬러 커스터마이징
- **추천**: 캐릭터, 개념 일러스트

## 🎨 카테고리별 필수 이미지

### 배경 이미지
```
Tech Backgrounds:
- abstract-circuit.jpg
- gradient-blue.jpg
- code-screen-blur.jpg
- network-connection.jpg
- digital-interface.jpg

Education Backgrounds:
- classroom-empty.jpg
- books-stack.jpg
- online-learning.jpg
- study-desk.jpg
- graduation-cap.jpg

Business Backgrounds:
- office-modern.jpg
- meeting-room.jpg
- data-charts.jpg
- teamwork.jpg
- presentation.jpg
```

### 일러스트
```
Concepts:
- learning-online.svg
- coding-developer.svg
- data-analysis.svg
- teamwork-collaboration.svg
- innovation-idea.svg

Characters:
- student-reading.svg
- developer-working.svg
- teacher-presenting.svg
- business-meeting.svg
- remote-work.svg
```

### 로고/브랜딩
```
InfoGraphAI Assets:
- logo-full.svg (전체 로고)
- logo-mark.svg (심볼만)
- logo-white.svg (흰색 버전)
- logo-dark.svg (어두운 버전)
- watermark.png (워터마크용)
- favicon.ico (파비콘)
```

## 🖼️ 이미지 규격 가이드

### 비디오용 이미지
```
해상도: 1920x1080 (16:9)
포맷: PNG (투명), JPG (배경)
DPI: 72 (웹용)
색상: RGB
```

### 썸네일/프리뷰
```
해상도: 1280x720 (16:9)
포맷: JPG
품질: 80-90%
파일크기: 200KB 이하
```

### 아이콘/심볼
```
해상도: 512x512 (정사각형)
포맷: SVG (벡터), PNG (래스터)
배경: 투명
```

## 📋 수집 체크리스트

### Phase 1: 핵심 배경 (20장)
- [ ] 기술/IT 배경 (8장)
- [ ] 교육 관련 배경 (6장)
- [ ] 비즈니스 배경 (6장)

### Phase 2: 일러스트 (15장)  
- [ ] 학습/교육 일러스트 (5장)
- [ ] 개발/기술 일러스트 (5장)
- [ ] 비즈니스 일러스트 (5장)

### Phase 3: 브랜딩 자산 (10장)
- [ ] InfoGraphAI 로고 세트 (6장)
- [ ] 워터마크/파비콘 (4장)

### Phase 4: 스톡 이미지 (30장)
- [ ] 사람/팀워크 (10장)
- [ ] 사무실/학습환경 (10장)
- [ ] 추상/개념적 (10장)

## 🎯 검색 키워드 전략

### Unsplash/Pexels 검색어
```
Technology:
- "programming code screen"
- "developer workspace setup"
- "laptop coding dark"
- "circuit board macro"
- "data center servers"

Education:
- "online learning student"
- "books knowledge education"
- "classroom empty chairs"
- "graduation ceremony"
- "study group collaboration"

Business:
- "modern office space"
- "business meeting presentation"
- "data analysis charts"
- "team collaboration"
- "professional workspace"

Abstract:
- "geometric gradient background"
- "minimal abstract shapes"
- "technology pattern"
- "blue gradient texture"
- "network connection lines"
```

## 🔄 이미지 최적화

### 자동 최적화 도구
```bash
# ImageMagick 설치
brew install imagemagick

# 배치 리사이징
mogrify -resize 1920x1080^ -gravity center -crop 1920x1080+0+0 *.jpg

# WebP 변환 (용량 절약)
cwebp -q 80 input.jpg -o output.webp
```

### 최적화 체크리스트
- [ ] 적절한 해상도 (과도하게 크지 않게)
- [ ] 압축 품질 80-90% 
- [ ] WebP 포맷 고려
- [ ] 파일명 일관성 (kebab-case)
- [ ] Alt 텍스트 작성

## 📱 디바이스별 대응

### 반응형 이미지
```
Desktop: 1920x1080
Tablet: 1024x768  
Mobile: 375x667
```

### 다중 해상도
```
@1x: 기본 해상도
@2x: 레티나 디스플레이용
@3x: 고밀도 디스플레이용
```

## ⚖️ 라이센스 관리

### 라이센스 확인사항
1. **상업적 사용** 가능 여부
2. **수정/편집** 허용 여부  
3. **크레딧 표기** 필요성
4. **재배포** 제한사항

### 크레딧 표기 예시
```
Photo by John Doe on Unsplash
Illustration by Jane Smith from unDraw
Icon from Heroicons (MIT License)
```

## 📊 사용 추적

### 이미지 사용 로그
```
assets/
├── images/
│   ├── backgrounds/
│   │   ├── tech-abstract-01.jpg
│   │   └── education-books-01.jpg
│   └── usage-log.csv
```

### 성능 모니터링
- 로딩 속도 측정
- 사용 빈도 추적  
- 사용자 선호도 분석

이 가이드를 통해 효과적이고 법적으로 안전한 이미지 자산 컬렉션을 구축할 수 있습니다.
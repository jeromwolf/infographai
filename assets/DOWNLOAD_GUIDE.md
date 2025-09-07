# Asset 다운로드 가이드

이 스크립트 실행 후 수동으로 다운로드해야 하는 항목들입니다.

## 🎵 오디오 자산

### 배경음악 (4곡)
- [ ] corporate-upbeat.mp3 (YouTube Audio Library)
- [ ] educational-calm.mp3 (YouTube Audio Library)  
- [ ] tech-ambient.mp3 (Freesound)
- [ ] focus-minimal.mp3 (YouTube Audio Library)

### UI 효과음 (5개)
- [ ] click-soft.wav (UI-sounds.com)
- [ ] whoosh-transition.wav (Zapsplat)
- [ ] success-chime.wav (Freesound)
- [ ] error-beep.wav (Freesound)
- [ ] pop-notification.wav (Freesound)

## 🖼️ 이미지 자산

### 배경 이미지 (12장)
- [ ] tech-abstract-01.jpg (Unsplash)
- [ ] tech-coding-02.jpg (Pexels)  
- [ ] education-books-01.jpg (Unsplash)
- [ ] education-classroom-02.jpg (Pexels)
- [ ] business-office-01.jpg (Unsplash)
- [ ] business-meeting-02.jpg (Pexels)
- 기타 6장...

### 로고 생성 (6개)
- [ ] InfoGraphAI 로고 전체 버전
- [ ] 심볼 마크만
- [ ] 흰색/검은색 버전
- [ ] 워터마크용 투명 PNG

## 🎨 아이콘 다운로드 (30개)

### Heroicons에서 다운로드
```bash
# UI 기본 아이콘들
curl -o assets/icons/ui/menu.svg "https://heroicons.com/24/outline/bars-3.svg"
curl -o assets/icons/ui/close.svg "https://heroicons.com/24/outline/x-mark.svg"
curl -o assets/icons/ui/play.svg "https://heroicons.com/24/outline/play.svg"
curl -o assets/icons/ui/pause.svg "https://heroicons.com/24/outline/pause.svg"
# ... 추가 아이콘들
```

### Simple Icons에서 기술 아이콘들
- React, Vue, Angular
- JavaScript, TypeScript, Python
- Docker, Kubernetes, AWS
- 등등...

## 📱 완료 확인

모든 다운로드 완료 후:
```bash
npm run asset-check
```

이 명령으로 누락된 자산이 있는지 확인할 수 있습니다.

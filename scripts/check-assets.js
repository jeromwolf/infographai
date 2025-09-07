#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Asset 체크 시작...\n');

const assetDirs = [
  'assets/audio/background-music',
  'assets/audio/sound-effects', 
  'assets/audio/ui-sounds',
  'assets/images/backgrounds',
  'assets/images/logos',
  'assets/icons/ui',
  'assets/icons/technology',
  'assets/templates/education',
  'assets/templates/tech',
  'assets/templates/business',
  'assets/fonts/korean',
  'assets/fonts/english'
];

let totalFiles = 0;
let missingDirs = 0;

assetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
    console.log(`✅ ${dir}: ${files.length}개 파일`);
    totalFiles += files.length;
  } else {
    console.log(`❌ ${dir}: 디렉토리 없음`);
    missingDirs++;
  }
});

console.log(`\n📊 요약:`);
console.log(`  총 파일: ${totalFiles}개`);
console.log(`  누락 디렉토리: ${missingDirs}개`);

if (totalFiles < 20) {
  console.log(`\n⚠️ 권장사항: 최소 20개 이상의 asset이 필요합니다.`);
  console.log(`   DOWNLOAD_GUIDE.md를 참고하여 추가 다운로드해주세요.`);
}

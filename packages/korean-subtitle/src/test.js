"use strict";
/**
 * Korean Subtitle Processor Test
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function runTests() {
    const processor = new index_1.KoreanSubtitleProcessor();
    console.log('🧪 한국어 자막 처리 테스트 시작\n');
    console.log('='.repeat(50));
    // 테스트 1: 조사 처리
    console.log('\n📝 테스트 1: 조사 처리');
    const testCases = [
        { input: '철수가 학교에 갔다', expected: '철수가 학교에 갔다' },
        { input: '영희는 공부를 한다', expected: '영희는 공부를 한다' },
        { input: '사과를 먹었다', expected: '사과를 먹었다' },
        { input: '책이 있다', expected: '책이 있다' }
    ];
    testCases.forEach(test => {
        const result = processor.processSubtitle(test.input);
        const passed = result === test.expected;
        console.log(`  ${passed ? '✅' : '❌'} "${test.input}" → "${result}"`);
    });
    // 테스트 2: 타이밍 계산
    console.log('\n⏱️  테스트 2: 타이밍 계산');
    const timingTests = [
        { text: '안녕하세요', wpm: 150 },
        { text: '이것은 긴 문장입니다. 여러 단어가 포함되어 있습니다.', wpm: 150 },
        { text: 'React는 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다', wpm: 200 }
    ];
    timingTests.forEach(test => {
        const duration = processor.calculateDuration(test.text, test.wpm);
        console.log(`  📊 "${test.text.substring(0, 20)}..." (${test.wpm} WPM)`);
        console.log(`     지속 시간: ${duration}ms (${(duration / 1000).toFixed(1)}초)`);
    });
    // 테스트 3: 자막 분할
    console.log('\n✂️  테스트 3: 자막 분할');
    const longText = '이것은 매우 긴 문장입니다. 자막으로 표시하기에는 너무 길어서 여러 줄로 나누어야 합니다. 적절한 위치에서 분할이 필요합니다.';
    const segments = processor.splitIntoSegments(longText, 30);
    console.log(`  원본 길이: ${longText.length}자`);
    console.log(`  분할 결과: ${segments.length}개 세그먼트`);
    segments.forEach((segment, index) => {
        console.log(`    ${index + 1}. "${segment}" (${segment.length}자)`);
    });
    // 테스트 4: 자막 스타일링
    console.log('\n🎨 테스트 4: 자막 스타일링');
    const styledSubtitle = processor.applyStyle('중요한 내용입니다', {
        fontSize: 24,
        color: '#ff0000',
        bold: true
    });
    console.log(`  스타일 적용: ${JSON.stringify(styledSubtitle, null, 2)}`);
    // 테스트 5: 읽기 난이도 분석
    console.log('\n📖 테스트 5: 읽기 난이도 분석');
    const readabilityTests = [
        '쉬운 문장입니다.',
        '자바스크립트는 프로토타입 기반의 프로그래밍 언어입니다.',
        '비동기 프로그래밍 패러다임을 활용한 이벤트 루프 메커니즘'
    ];
    readabilityTests.forEach(text => {
        const score = processor.analyzeReadability(text);
        const level = score < 30 ? '쉬움' : score < 60 ? '보통' : '어려움';
        console.log(`  📊 "${text.substring(0, 30)}..."`);
        console.log(`     난이도: ${score.toFixed(1)} (${level})`);
    });
    // 테스트 6: 특수 케이스
    console.log('\n⚠️  테스트 6: 특수 케이스');
    const specialCases = [
        { input: '10개의 사과', desc: '숫자 + 조사' },
        { input: 'JavaScript와 TypeScript', desc: '영어 + 조사' },
        { input: '(주)회사는', desc: '괄호 포함' },
        { input: '"인용문"을', desc: '따옴표 포함' }
    ];
    specialCases.forEach(test => {
        const result = processor.processSubtitle(test.input);
        console.log(`  ${test.desc}: "${test.input}" → "${result}"`);
    });
    console.log('\n' + '='.repeat(50));
    console.log('✨ 테스트 완료!\n');
}
// 테스트 실행
runTests();

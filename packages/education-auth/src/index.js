"use strict";
/**
 * Education Authentication System
 * 교육 기관 인증 및 무료 플랜 관리
 * Figma Make 교육 플랜 벤치마킹
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationAuthSystem = exports.PLANS = exports.EducationRole = exports.VerificationType = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 교육 기관 도메인 화이트리스트
const EDU_DOMAINS = [
    // 한국 대학
    '.ac.kr',
    'kaist.ac.kr',
    'snu.ac.kr',
    'yonsei.ac.kr',
    'korea.ac.kr',
    'skku.edu',
    'hanyang.ac.kr',
    'postech.ac.kr',
    // 국제 대학
    '.edu',
    '.ac.uk',
    '.edu.au',
    '.edu.cn',
    '.ac.jp',
    // 온라인 교육 플랫폼
    '@student.42seoul.kr',
    '@wecode.co.kr',
    '@codestates.com'
];
// 인증 타입
var VerificationType;
(function (VerificationType) {
    VerificationType["EMAIL"] = "email";
    VerificationType["DOCUMENT"] = "document";
    VerificationType["API"] = "api";
    VerificationType["MANUAL"] = "manual"; // 수동 승인
})(VerificationType || (exports.VerificationType = VerificationType = {}));
// 사용자 역할
var EducationRole;
(function (EducationRole) {
    EducationRole["STUDENT"] = "student";
    EducationRole["TEACHER"] = "teacher";
    EducationRole["RESEARCHER"] = "researcher";
    EducationRole["ADMIN"] = "admin";
})(EducationRole || (exports.EducationRole = EducationRole = {}));
// 플랜 정의
exports.PLANS = {
    // 일반 무료
    FREE: {
        name: '무료',
        monthlyVideoLimit: 10,
        dailyVideoLimit: 2,
        maxVideoDuration: 60,
        hasWatermark: true,
        watermarkSize: 'large',
        features: ['basic_templates', 'subtitle_only']
    },
    // 교육 무료 (핵심!)
    EDUCATION: {
        name: '교육 기관',
        monthlyVideoLimit: 100,
        dailyVideoLimit: 10,
        maxVideoDuration: 180,
        hasWatermark: true,
        watermarkSize: 'small',
        features: [
            'all_templates',
            'realtime_edit',
            'collaboration',
            'export_hd',
            'korean_support'
        ]
    },
    // 프로 (유료)
    PRO: {
        name: '프로',
        monthlyVideoLimit: -1, // unlimited
        dailyVideoLimit: -1,
        maxVideoDuration: 600,
        hasWatermark: false,
        watermarkSize: 'none',
        features: [
            'all_features',
            'api_access',
            'priority_support',
            'custom_branding'
        ]
    }
};
// 교육 인증 시스템
class EducationAuthSystem {
    jwtSecret;
    verifiedUsers = new Map();
    constructor(jwtSecret = process.env.JWT_SECRET || 'education-secret') {
        this.jwtSecret = jwtSecret;
    }
    /**
     * 교육 기관 인증
     */
    async verify(request) {
        // 1. 이메일 도메인 체크 (즉시 승인)
        if (this.isEducationEmail(request.email)) {
            return this.approveEducation(request, VerificationType.EMAIL);
        }
        // 2. 문서 검증 (학생증/재직증명서)
        if (request.document) {
            const documentValid = await this.verifyDocument(request.document);
            if (documentValid) {
                return this.approveEducation(request, VerificationType.DOCUMENT);
            }
        }
        // 3. SheerID API 연동 (옵션)
        if (process.env.SHEERID_API_KEY) {
            const apiResult = await this.verifyViaSheerID(request);
            if (apiResult) {
                return this.approveEducation(request, VerificationType.API);
            }
        }
        // 4. 실패 시 일반 플랜
        return {
            verified: false,
            type: VerificationType.EMAIL,
            role: request.role,
            plan: exports.PLANS.FREE,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일
        };
    }
    /**
     * .edu 이메일 체크
     */
    isEducationEmail(email) {
        const domain = email.toLowerCase();
        // 화이트리스트 도메인 체크
        return EDU_DOMAINS.some(eduDomain => {
            return domain.endsWith(eduDomain);
        });
    }
    /**
     * 교육 플랜 승인
     */
    async approveEducation(request, type) {
        // 기관명 추출
        const institution = this.extractInstitution(request.email);
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({
            email: request.email,
            institution,
            role: request.role,
            plan: 'EDUCATION',
            type
        }, this.jwtSecret, { expiresIn: '1y' } // 1년 유효
        );
        const result = {
            verified: true,
            type,
            institution,
            role: request.role,
            plan: exports.PLANS.EDUCATION,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            token
        };
        // 캐시 저장
        this.verifiedUsers.set(request.email, result);
        // 통계 기록
        await this.logVerification(result);
        return result;
    }
    /**
     * 문서 검증 (OCR 또는 수동)
     */
    async verifyDocument(document) {
        // 실제로는 OCR API 사용 (Google Cloud Vision, AWS Textract 등)
        // 여기서는 시뮬레이션
        // 학생증/재직증명서 키워드 체크
        const keywords = ['학생증', '재학증명서', '재직증명서', 'student', 'faculty'];
        // 간단한 시뮬레이션
        return Math.random() > 0.2; // 80% 승인
    }
    /**
     * SheerID API 연동
     */
    async verifyViaSheerID(request) {
        if (!process.env.SHEERID_API_KEY)
            return false;
        try {
            const response = await axios_1.default.post('https://api.sheerid.com/verify', {
                email: request.email,
                organization: request.institution,
                segment: request.role === EducationRole.STUDENT ? 'student' : 'teacher'
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.SHEERID_API_KEY}`
                }
            });
            return response.data.verified === true;
        }
        catch (error) {
            console.error('SheerID verification failed:', error);
            return false;
        }
    }
    /**
     * 기관명 추출
     */
    extractInstitution(email) {
        const domain = email.split('@')[1];
        // 알려진 기관 매핑
        const institutionMap = {
            'kaist.ac.kr': 'KAIST',
            'snu.ac.kr': '서울대학교',
            'yonsei.ac.kr': '연세대학교',
            'korea.ac.kr': '고려대학교',
            'mit.edu': 'MIT',
            'stanford.edu': 'Stanford University'
        };
        return institutionMap[domain] || domain;
    }
    /**
     * 인증 통계 기록
     */
    async logVerification(result) {
        // 통계 DB 저장 (Prisma 사용)
        console.log('Education verification:', {
            email: result.institution,
            type: result.type,
            role: result.role,
            timestamp: new Date()
        });
    }
    /**
     * 토큰 검증
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return {
                verified: true,
                type: decoded.type,
                institution: decoded.institution,
                role: decoded.role,
                plan: exports.PLANS[decoded.plan],
                expiresAt: new Date(decoded.exp * 1000)
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * 사용량 체크
     */
    async checkUsageLimit(email, currentUsage) {
        const verification = this.verifiedUsers.get(email);
        if (!verification) {
            return {
                allowed: false,
                remaining: { daily: 0, monthly: 0 },
                message: '인증되지 않은 사용자입니다'
            };
        }
        const plan = verification.plan;
        // 무제한 체크
        if (plan.dailyVideoLimit === -1) {
            return {
                allowed: true,
                remaining: { daily: -1, monthly: -1 }
            };
        }
        // 한도 체크
        const dailyRemaining = plan.dailyVideoLimit - currentUsage.daily;
        const monthlyRemaining = plan.monthlyVideoLimit - currentUsage.monthly;
        if (dailyRemaining <= 0) {
            return {
                allowed: false,
                remaining: { daily: 0, monthly: monthlyRemaining },
                message: '일일 생성 한도를 초과했습니다'
            };
        }
        if (monthlyRemaining <= 0) {
            return {
                allowed: false,
                remaining: { daily: dailyRemaining, monthly: 0 },
                message: '월간 생성 한도를 초과했습니다'
            };
        }
        return {
            allowed: true,
            remaining: {
                daily: dailyRemaining,
                monthly: monthlyRemaining
            }
        };
    }
    /**
     * 재인증 필요 체크
     */
    needsReverification(email) {
        const verification = this.verifiedUsers.get(email);
        if (!verification)
            return true;
        // 만료 30일 전 재인증 알림
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return verification.expiresAt < thirtyDaysFromNow;
    }
    /**
     * 대량 인증 (학교 단위)
     */
    async bulkVerify(institution, emails) {
        const results = new Map();
        // 기관 도메인 확인
        const institutionDomain = this.getInstitutionDomain(institution);
        for (const email of emails) {
            if (email.endsWith(institutionDomain)) {
                const result = await this.verify({
                    email,
                    institution,
                    role: EducationRole.STUDENT
                });
                results.set(email, result);
            }
        }
        return results;
    }
    getInstitutionDomain(institution) {
        const domainMap = {
            'KAIST': '@kaist.ac.kr',
            '서울대학교': '@snu.ac.kr',
            '연세대학교': '@yonsei.ac.kr'
        };
        return domainMap[institution] || `@${institution.toLowerCase()}.ac.kr`;
    }
    /**
     * 통계 조회
     */
    getStatistics() {
        const stats = {
            totalVerified: this.verifiedUsers.size,
            byInstitution: new Map(),
            byRole: new Map()
        };
        this.verifiedUsers.forEach(user => {
            // 기관별
            const institution = user.institution || 'unknown';
            stats.byInstitution.set(institution, (stats.byInstitution.get(institution) || 0) + 1);
            // 역할별
            stats.byRole.set(user.role, (stats.byRole.get(user.role) || 0) + 1);
        });
        return stats;
    }
}
exports.EducationAuthSystem = EducationAuthSystem;
exports.default = EducationAuthSystem;

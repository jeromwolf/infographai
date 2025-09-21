/**
 * Education Authentication System
 * 교육 기관 인증 및 무료 플랜 관리
 * Figma Make 교육 플랜 벤치마킹
 */
export declare enum VerificationType {
    EMAIL = "email",// .edu 이메일
    DOCUMENT = "document",// 학생증/재직증명서
    API = "api",// SheerID 같은 API
    MANUAL = "manual"
}
export declare enum EducationRole {
    STUDENT = "student",
    TEACHER = "teacher",
    RESEARCHER = "researcher",
    ADMIN = "admin"
}
export interface EducationPlan {
    name: string;
    monthlyVideoLimit: number;
    dailyVideoLimit: number;
    maxVideoDuration: number;
    hasWatermark: boolean;
    watermarkSize: 'none' | 'small' | 'large';
    features: string[];
}
export declare const PLANS: Record<string, EducationPlan>;
export interface VerificationRequest {
    email: string;
    institution?: string;
    role: EducationRole;
    document?: Buffer;
}
export interface VerificationResult {
    verified: boolean;
    type: VerificationType;
    institution?: string;
    role: EducationRole;
    plan: EducationPlan;
    expiresAt: Date;
    token?: string;
}
export declare class EducationAuthSystem {
    private jwtSecret;
    private verifiedUsers;
    constructor(jwtSecret?: string);
    /**
     * 교육 기관 인증
     */
    verify(request: VerificationRequest): Promise<VerificationResult>;
    /**
     * .edu 이메일 체크
     */
    private isEducationEmail;
    /**
     * 교육 플랜 승인
     */
    private approveEducation;
    /**
     * 문서 검증 (OCR 또는 수동)
     */
    private verifyDocument;
    /**
     * SheerID API 연동
     */
    private verifyViaSheerID;
    /**
     * 기관명 추출
     */
    private extractInstitution;
    /**
     * 인증 통계 기록
     */
    private logVerification;
    /**
     * 토큰 검증
     */
    verifyToken(token: string): VerificationResult | null;
    /**
     * 사용량 체크
     */
    checkUsageLimit(email: string, currentUsage: {
        daily: number;
        monthly: number;
    }): Promise<{
        allowed: boolean;
        remaining: {
            daily: number;
            monthly: number;
        };
        message?: string;
    }>;
    /**
     * 재인증 필요 체크
     */
    needsReverification(email: string): boolean;
    /**
     * 대량 인증 (학교 단위)
     */
    bulkVerify(institution: string, emails: string[]): Promise<Map<string, VerificationResult>>;
    private getInstitutionDomain;
    /**
     * 통계 조회
     */
    getStatistics(): {
        totalVerified: number;
        byInstitution: Map<string, number>;
        byRole: Map<EducationRole, number>;
    };
}
export default EducationAuthSystem;
//# sourceMappingURL=index.d.ts.map
"use strict";
/**
 * 시나리오 관리 API 라우트
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const scenario_manager_1 = __importDefault(require("@infographai/scenario-manager"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const scenarioManager = new scenario_manager_1.default();
// 시나리오 생성 검증 스키마
const createScenarioSchema = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    type: joi_1.default.string().valid('auto', 'user', 'hybrid').required(),
    generationOptions: joi_1.default.object({
        topic: joi_1.default.string().required(),
        duration: joi_1.default.number().min(30).max(600).required(),
        targetAudience: joi_1.default.string().required(),
        language: joi_1.default.string().default('ko'),
        style: joi_1.default.string().default('educational'),
        keywords: joi_1.default.array().items(joi_1.default.string()).optional()
    }).when('type', { is: 'auto', then: joi_1.default.required() }),
    userContent: joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        scenes: joi_1.default.array().items(joi_1.default.object({
            title: joi_1.default.string().required(),
            content: joi_1.default.string().required(),
            duration: joi_1.default.number().required(),
            visualType: joi_1.default.string().required(),
            visualPrompt: joi_1.default.string().optional(),
            subtitles: joi_1.default.array().items(joi_1.default.object({
                text: joi_1.default.string().required(),
                startTime: joi_1.default.number().required(),
                endTime: joi_1.default.number().required()
            })).optional()
        })).required(),
        metadata: joi_1.default.object().optional()
    }).when('type', { is: 'user', then: joi_1.default.required() })
});
// 시나리오 업데이트 검증 스키마
const updateScenarioSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    scenes: joi_1.default.array().items(joi_1.default.object({
        title: joi_1.default.string().required(),
        content: joi_1.default.string().required(),
        duration: joi_1.default.number().required(),
        visualType: joi_1.default.string().required(),
        visualPrompt: joi_1.default.string().optional(),
        subtitles: joi_1.default.array().items(joi_1.default.object({
            text: joi_1.default.string().required(),
            startTime: joi_1.default.number().required(),
            endTime: joi_1.default.number().required()
        })).optional()
    })).optional(),
    metadata: joi_1.default.object().optional()
});
// 시나리오 목록 조회
router.get('/scenarios', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { projectId, page = 1, limit = 10, status } = req.query;
        const where = {};
        // 프로젝트별 필터링
        if (projectId) {
            const project = await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId
                }
            });
            if (!project) {
                return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
            }
            where.projectId = projectId;
        }
        else {
            // 사용자의 모든 프로젝트
            const projects = await prisma.project.findMany({
                where: { userId },
                select: { id: true }
            });
            where.projectId = { in: projects.map(p => p.id) };
        }
        if (status) {
            where.status = status;
        }
        const scenarios = await prisma.scenario.findMany({
            where,
            include: {
                project: {
                    select: { title: true }
                },
                _count: {
                    select: { versions: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        const total = await prisma.scenario.count({ where });
        res.json({
            scenarios,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// 특정 시나리오 조회
router.get('/scenarios/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            },
            include: {
                project: {
                    select: { title: true }
                },
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        res.json(scenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 생성
router.post('/scenarios', auth_1.authenticate, (0, validation_1.validateRequest)(createScenarioSchema), async (req, res, next) => {
    try {
        const userId = req.userId;
        const { projectId, type, generationOptions, userContent } = req.body;
        // 프로젝트 소유권 확인
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId
            }
        });
        if (!project) {
            return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
        }
        let scenario;
        switch (type) {
            case 'auto':
                // AI 자동 생성
                scenario = await scenarioManager.generateScenario(generationOptions, userId);
                break;
            case 'user':
                // 사용자 제공 시나리오
                scenario = await scenarioManager.createUserScenario(userContent, userId);
                break;
            case 'hybrid':
                // AI 생성 후 사용자 수정
                scenario = await scenarioManager.generateScenario(generationOptions, userId);
                if (userContent) {
                    scenario = await scenarioManager.updateScenario(scenario.id, userContent, userId);
                }
                break;
        }
        // DB에 시나리오 저장
        const savedScenario = await prisma.scenario.create({
            data: {
                projectId,
                title: scenario.title,
                description: scenario.description,
                content: scenario,
                type,
                status: 'draft',
                metadata: scenario.metadata
            }
        });
        res.status(201).json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 수정
router.put('/scenarios/:id', auth_1.authenticate, (0, validation_1.validateRequest)(updateScenarioSchema), async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updates = req.body;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        // 시나리오 매니저로 업데이트
        const updatedScenario = await scenarioManager.updateScenario(id, updates, userId);
        // DB 업데이트
        const savedScenario = await prisma.scenario.update({
            where: { id },
            data: {
                title: updatedScenario.title,
                description: updatedScenario.description,
                content: updatedScenario,
                metadata: updatedScenario.metadata,
                updatedAt: new Date()
            }
        });
        res.json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 삭제
router.delete('/scenarios/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        // 시나리오 삭제
        await scenarioManager.deleteScenario(id, userId);
        await prisma.scenario.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 복제
router.post('/scenarios/:id/clone', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title } = req.body;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        // 시나리오 복제
        const clonedScenario = await scenarioManager.cloneScenario(id, userId);
        // DB에 저장
        const savedScenario = await prisma.scenario.create({
            data: {
                projectId: scenario.projectId,
                title: title || `${scenario.title} (복사본)`,
                description: scenario.description,
                content: clonedScenario,
                type: scenario.type,
                status: 'draft',
                metadata: scenario.metadata
            }
        });
        res.status(201).json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 버전 목록
router.get('/scenarios/:id/versions', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        const versions = await scenarioManager.getVersionHistory(id);
        res.json(versions);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 버전 복원
router.post('/scenarios/:id/versions/:versionId/restore', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id, versionId } = req.params;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        // 버전 복원
        const restoredScenario = await scenarioManager.restoreVersion(id, versionId, userId);
        // DB 업데이트
        const savedScenario = await prisma.scenario.update({
            where: { id },
            data: {
                content: restoredScenario,
                updatedAt: new Date()
            }
        });
        res.json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 내보내기
router.get('/scenarios/:id/export', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { format = 'json' } = req.query;
        // 시나리오 소유권 확인
        const scenario = await prisma.scenario.findFirst({
            where: {
                id,
                project: {
                    userId
                }
            }
        });
        if (!scenario) {
            return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
        }
        const exportData = await scenarioManager.exportScenario(id, format);
        // 파일 다운로드 응답 설정
        const filename = `scenario_${id}_${Date.now()}.${format}`;
        res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(exportData);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 가져오기
router.post('/scenarios/import', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { projectId, data, format = 'json' } = req.body;
        // 프로젝트 소유권 확인
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId
            }
        });
        if (!project) {
            return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
        }
        // 시나리오 가져오기
        const importedScenario = await scenarioManager.importScenario(data, format);
        // DB에 저장
        const savedScenario = await prisma.scenario.create({
            data: {
                projectId,
                title: importedScenario.title,
                description: importedScenario.description,
                content: importedScenario,
                type: 'imported',
                status: 'draft',
                metadata: importedScenario.metadata
            }
        });
        res.status(201).json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
// 시나리오 템플릿 목록
router.get('/scenarios/templates', auth_1.authenticate, async (req, res) => {
    const templates = await scenarioManager.getTemplates();
    res.json(templates);
});
// 템플릿에서 시나리오 생성
router.post('/scenarios/from-template', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { projectId, templateName, variables } = req.body;
        // 프로젝트 소유권 확인
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId
            }
        });
        if (!project) {
            return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
        }
        // 템플릿에서 시나리오 생성
        const scenario = await scenarioManager.generateFromTemplate(templateName, variables);
        // DB에 저장
        const savedScenario = await prisma.scenario.create({
            data: {
                projectId,
                title: scenario.title,
                description: scenario.description,
                content: scenario,
                type: 'template',
                status: 'draft',
                metadata: {
                    ...scenario.metadata,
                    templateName
                }
            }
        });
        res.status(201).json(savedScenario);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;

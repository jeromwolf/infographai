/**
 * 시나리오 관리 API 라우트
 */

import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AutoScenarioGenerator } from '../services/auto-scenario-generator';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();
const prisma = new PrismaClient();
const autoScenarioGenerator = new AutoScenarioGenerator();

// 시나리오 생성 검증 스키마
const createScenarioSchema = Joi.object({
  projectId: Joi.string().required(),
  type: Joi.string().valid('auto', 'user', 'hybrid').required(),
  generationOptions: Joi.object({
    topic: Joi.string().required(),
    duration: Joi.number().min(30).max(600).optional(),
    targetAudience: Joi.string().optional(),
    language: Joi.string().default('ko'),
    style: Joi.string().default('educational'),
    keywords: Joi.array().items(Joi.string()).optional()
  }).when('type', { is: 'auto', then: Joi.required() }),
  userContent: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    scenes: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      duration: Joi.number().required(),
      visualType: Joi.string().required(),
      visualPrompt: Joi.string().optional(),
      subtitles: Joi.array().items(Joi.object({
        text: Joi.string().required(),
        startTime: Joi.number().required(),
        endTime: Joi.number().required()
      })).optional()
    })).required(),
    metadata: Joi.object().optional()
  }).when('type', { is: 'user', then: Joi.required() })
});

// 시나리오 업데이트 검증 스키마
const updateScenarioSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  scenes: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    duration: Joi.number().required(),
    visualType: Joi.string().required(),
    visualPrompt: Joi.string().optional(),
    subtitles: Joi.array().items(Joi.object({
      text: Joi.string().required(),
      startTime: Joi.number().required(),
      endTime: Joi.number().required()
    })).optional()
  })).optional(),
  metadata: Joi.object().optional()
});

// 시나리오 목록 조회
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { projectId, page = 1, limit = 10, status } = req.query;

    const where: any = {};
    
    // 프로젝트별 필터링
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId as string,
          userId
        }
      });

      if (!project) {
        return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
      }

      where.projectId = projectId;
    } else {
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
  } catch (error) {
    next(error);
  }
});

// 특정 시나리오 조회
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
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
        }
      }
    });

    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다' });
    }

    res.json(scenario);
  } catch (error) {
    next(error);
  }
});

// 시나리오 생성
router.post('/', 
  authenticate, 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
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

      // type 매핑
      const typeMap: any = {
        'auto': 'AUTO_GENERATED',
        'user': 'USER_INPUT',
        'hybrid': 'HYBRID'
      };

      switch (type) {
        case 'auto':
          // AI 자동 생성 - AutoScenarioGenerator 사용
          const generatedScenario = await autoScenarioGenerator.generateFromTopic(
            generationOptions.topic,
            userId
          );
          scenario = generatedScenario;
          break;
        
        case 'user':
          // 사용자 제공 시나리오 - 직접 시나리오 구조 생성
          const now = new Date();
          scenario = {
            id: `scenario_${Date.now()}`,
            title: userContent.title,
            description: userContent.description || '',
            scenes: userContent.scenes || [],
            metadata: {
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              createdBy: userId
            }
          };
          break;
        
        case 'hybrid':
          // AI 생성 후 사용자 수정
          const hybridScenario = await autoScenarioGenerator.generateFromTopic(
            generationOptions.topic,
            userId
          );
          // 사용자 수정 적용
          if (userContent) {
            hybridScenario.title = userContent.title || hybridScenario.title;
            hybridScenario.description = userContent.description || hybridScenario.description;
            if (userContent.scenes) {
              hybridScenario.scenes = userContent.scenes;
            }
          }
          scenario = hybridScenario;
          break;
          
        default:
          // Default case - use provided content or generate
          if (req.body.scenes) {
            // Direct scene data provided
            scenario = {
              id: `scenario_${Date.now()}`,
              title: req.body.title || 'New Scenario',
              description: req.body.description || '',
              scenes: req.body.scenes || [],
              metadata: {}
            };
          } else if (generationOptions?.topic) {
            // Generate if topic provided
            const defaultScenario = await autoScenarioGenerator.generateFromTopic(
              generationOptions.topic,
              userId
            );
            scenario = defaultScenario;
          } else {
            // Error: no scenes or topic provided
            return res.status(400).json({ error: '시나리오 생성을 위한 정보가 부족합니다' });
          }
          break;
      }

      // DB에 시나리오 저장
      const scenes = scenario.scenes || [];
      const totalDuration = scenes.reduce((acc: number, scene: any) => acc + (scene.duration || 0), 0) || 0;
      const sceneCount = scenes.length;
      
      const savedScenario = await prisma.scenario.create({
        data: {
          projectId,
          title: scenario.title,
          description: scenario.description,
          scenes: scenes,
          type: typeMap[type] || 'HYBRID',
          isDraft: true,
          totalDuration,
          sceneCount
        }
      });

      res.status(201).json(savedScenario);
    } catch (error) {
      next(error);
    }
  }
);

// 시나리오 수정
router.put('/:id',
  authenticate,
  validateRequest(updateScenarioSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
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
          content: updatedScenario as any,
          metadata: updatedScenario.metadata as any,
          updatedAt: new Date()
        }
      });

      res.json(savedScenario);
    } catch (error) {
      next(error);
    }
  }
);

// 시나리오 삭제
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
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
  } catch (error) {
    next(error);
  }
});

// 시나리오 복제
router.post('/:id/clone', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
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
        content: clonedScenario as any,
        type: scenario.type,
        status: 'draft',
        metadata: scenario.metadata as any
      }
    });

    res.status(201).json(savedScenario);
  } catch (error) {
    next(error);
  }
});

// 시나리오 버전 목록
router.get('/:id/versions', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
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
  } catch (error) {
    next(error);
  }
});

// 시나리오 버전 복원
router.post('/:id/versions/:versionId/restore', 
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
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
          content: restoredScenario as any,
          updatedAt: new Date()
        }
      });

      res.json(savedScenario);
    } catch (error) {
      next(error);
    }
  }
);

// 시나리오 내보내기
router.get('/:id/export', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
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

    const exportData = await scenarioManager.exportScenario(id, format as 'json' | 'markdown' | 'srt');

    // 파일 다운로드 응답 설정
    const filename = `scenario_${id}_${Date.now()}.${format}`;
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(exportData);
  } catch (error) {
    next(error);
  }
});

// 시나리오 가져오기
router.post('/import',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
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
      const importedScenario = await scenarioManager.importScenario(data, format as 'json' | 'markdown');

      // DB에 저장
      const savedScenario = await prisma.scenario.create({
        data: {
          projectId,
          title: importedScenario.title,
          description: importedScenario.description,
          content: importedScenario as any,
          type: 'imported',
          status: 'draft',
          metadata: importedScenario.metadata as any
        }
      });

      res.status(201).json(savedScenario);
    } catch (error) {
      next(error);
    }
  }
);

// 시나리오 템플릿 목록
router.get('/templates', authenticate, async (req: Request, res: Response) => {
  const templates = await scenarioManager.getTemplates();
  res.json(templates);
});

// 템플릿에서 시나리오 생성
router.post('/from-template',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
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
          content: scenario as any,
          type: 'template',
          status: 'draft',
          metadata: {
            ...scenario.metadata,
            templateName
          } as any
        }
      });

      res.status(201).json(savedScenario);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
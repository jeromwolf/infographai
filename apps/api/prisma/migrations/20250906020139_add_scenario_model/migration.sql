-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('AUTO_GENERATED', 'USER_INPUT', 'HYBRID');

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ScenarioType" NOT NULL DEFAULT 'HYBRID',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scenes" JSONB NOT NULL,
    "templateId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "totalDuration" INTEGER NOT NULL,
    "sceneCount" INTEGER NOT NULL,
    "aiPrompt" TEXT,
    "aiModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_projectId_key" ON "Scenario"("projectId");

-- CreateIndex
CREATE INDEX "Scenario_projectId_idx" ON "Scenario"("projectId");

-- CreateIndex
CREATE INDEX "Scenario_type_idx" ON "Scenario"("type");

-- CreateIndex
CREATE INDEX "Scenario_templateId_idx" ON "Scenario"("templateId");

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
